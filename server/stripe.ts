import Stripe from 'stripe';
import { SubscriptionTiers, SubscriptionTier } from '@shared/schema';
import { storage } from './storage';

// Check if Stripe keys are available
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('Missing STRIPE_SECRET_KEY. Stripe payment features will not work.');
}

// Initialize Stripe with secret key
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-03-31.basil' as any, // Using latest version available in Stripe
    })
  : null;

// Map subscription tiers to Stripe price IDs
// These IDs should be created in the Stripe dashboard
interface StripePriceMap {
  [key: string]: string | null;
}

// This would need to be updated with actual price IDs from Stripe dashboard
const tierToPriceId: StripePriceMap = {
  [SubscriptionTiers.FREE]: null, // Free tier has no price ID
  [SubscriptionTiers.PAID]: process.env.STRIPE_PRICE_PAID || 'price_paid',
  [SubscriptionTiers.PREMIUM]: process.env.STRIPE_PRICE_PREMIUM || 'price_premium',
};

/**
 * Create or retrieve a Stripe customer for a user
 */
export async function getOrCreateStripeCustomer(userId: number, email: string, name?: string | null): Promise<string | null> {
  if (!stripe) return null;

  try {
    // Get user by ID
    const user = await storage.getUser(userId);
    if (!user) throw new Error('User not found');

    // If user already has a customer ID, return it
    if (user.stripeCustomerId) {
      return user.stripeCustomerId;
    }

    // Create a new customer
    const customer = await stripe.customers.create({
      email,
      name: name || undefined,
      metadata: {
        userId: userId.toString(),
      },
    });

    // Update user with the customer ID
    await storage.updateUser(userId, {
      stripeCustomerId: customer.id,
    });

    return customer.id;
  } catch (error) {
    console.error('Error creating/getting Stripe customer:', error);
    return null;
  }
}

/**
 * Create a checkout session for the subscription
 */
export async function createSubscriptionCheckoutSession(
  userId: number,
  tier: SubscriptionTier,
  successUrl: string,
  cancelUrl: string
): Promise<string | null> {
  if (!stripe) return null;
  
  const priceId = tierToPriceId[tier];
  if (!priceId) return null;
  
  try {
    // Get the user
    const user = await storage.getUser(userId);
    if (!user) throw new Error('User not found');

    // Ensure user has a Stripe customer ID
    const customerId = user.stripeCustomerId || await getOrCreateStripeCustomer(userId, user.email, user.fullName);
    if (!customerId) throw new Error('Failed to create Stripe customer');

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      metadata: {
        userId: userId.toString(),
        tier,
      },
    });

    return session.url;
  } catch (error) {
    console.error('Error creating subscription checkout session:', error);
    return null;
  }
}

/**
 * Handle Stripe webhook events
 */
export async function handleStripeWebhook(event: any): Promise<boolean> {
  if (!stripe) return false;

  try {
    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        if (session.mode === 'subscription') {
          // Extract user and tier from metadata
          const userId = parseInt(session.metadata.userId, 10);
          const tier = session.metadata.tier as SubscriptionTier;
          const subscriptionId = session.subscription as string;
          
          // Update user's subscription
          await updateUserSubscription(userId, tier, subscriptionId);
        }
        break;
      }
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const userId = parseInt(subscription.metadata.userId, 10);
        const tier = subscription.metadata.tier as SubscriptionTier;
        
        // Check if subscription is still active
        const status = subscription.status;
        if (status === 'active' || status === 'trialing') {
          await updateUserSubscription(userId, tier, subscription.id);
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const userId = parseInt(subscription.metadata.userId, 10);
        
        // Downgrade user back to free tier
        await updateUserSubscription(userId, SubscriptionTiers.FREE, null);
        break;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error handling Stripe webhook:', error);
    return false;
  }
}

/**
 * Update user's subscription tier and permissions
 */
async function updateUserSubscription(
  userId: number,
  tier: SubscriptionTier,
  subscriptionId: string | null
): Promise<boolean> {
  try {
    // Get the user
    const user = await storage.getUser(userId);
    if (!user) return false;
    
    // Configure permissions based on tier
    const tierConfig = configureTierPermissions(tier);
    
    // Update user with new tier and subscription info
    await storage.updateUser(userId, {
      accountType: tier,
      stripeSubscriptionId: subscriptionId,
      projectsLimit: tierConfig.projectsLimit,
      pagesLimit: tierConfig.pagesLimit,
      storage: tierConfig.storage,
      canDeploy: tierConfig.canDeploy,
      canSaveTemplates: tierConfig.canSaveTemplates,
    });
    
    return true;
  } catch (error) {
    console.error('Error updating user subscription:', error);
    return false;
  }
}

/**
 * Get subscription details for a user
 */
export async function getUserSubscription(userId: number) {
  if (!stripe) return null;
  
  try {
    const user = await storage.getUser(userId);
    if (!user || !user.stripeSubscriptionId) return null;
    
    const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
    return subscription;
  } catch (error) {
    console.error('Error getting user subscription:', error);
    return null;
  }
}

/**
 * Cancel a user's subscription
 */
export async function cancelUserSubscription(userId: number): Promise<boolean> {
  if (!stripe) return false;
  
  try {
    const user = await storage.getUser(userId);
    if (!user || !user.stripeSubscriptionId) return false;
    
    await stripe.subscriptions.cancel(user.stripeSubscriptionId);
    
    // Update user back to free tier
    await updateUserSubscription(userId, SubscriptionTiers.FREE, null);
    
    return true;
  } catch (error) {
    console.error('Error canceling user subscription:', error);
    return false;
  }
}

// Configure user permissions based on subscription tier
// Duplicated from auth.ts to avoid circular dependencies
function configureTierPermissions(tier: SubscriptionTier): {
  projectsLimit: number;
  pagesLimit: number;
  storage: number;
  canDeploy: boolean;
  canSaveTemplates: boolean;
} {
  switch (tier) {
    case SubscriptionTiers.GUEST:
      return {
        projectsLimit: 1,
        pagesLimit: 1,
        storage: 5,
        canDeploy: false,
        canSaveTemplates: false
      };
    case SubscriptionTiers.FREE:
      return {
        projectsLimit: 3,
        pagesLimit: 1,
        storage: 10,
        canDeploy: false,
        canSaveTemplates: false
      };
    case SubscriptionTiers.PAID:
      return {
        projectsLimit: 10,
        pagesLimit: 1,
        storage: 50,
        canDeploy: true,
        canSaveTemplates: true
      };
    case SubscriptionTiers.PREMIUM:
      return {
        projectsLimit: 30,
        pagesLimit: 3,
        storage: 100,
        canDeploy: true,
        canSaveTemplates: true
      };
    default:
      return {
        projectsLimit: 3,
        pagesLimit: 1,
        storage: 10,
        canDeploy: false,
        canSaveTemplates: false
      };
  }
}