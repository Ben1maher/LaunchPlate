import Stripe from 'stripe';
import { SubscriptionTier, SubscriptionTiers } from '@shared/schema';
import { storage } from './storage';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16' as any, // Use type assertion to prevent version compatibility issues
});

// Map subscription tiers to Stripe price IDs
// These would need to be created in the Stripe dashboard and added here
interface StripePriceMap {
  [key: string]: string | null;
}

const tierToPriceId: StripePriceMap = {
  [SubscriptionTiers.GUEST]: null,
  [SubscriptionTiers.FREE]: null,
  [SubscriptionTiers.PAID]: 'price_paid', // Replace with actual Stripe price ID
  [SubscriptionTiers.PREMIUM]: 'price_premium', // Replace with actual Stripe price ID
};

/**
 * Create or retrieve a Stripe customer for a user
 */
export async function getOrCreateStripeCustomer(userId: number, email: string, name?: string | null): Promise<string | null> {
  try {
    // Check if user already has a Stripe customer ID
    const user = await storage.getUser(userId);
    if (user?.stripeCustomerId) {
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

    // Update user with Stripe customer ID
    if (user) {
      await storage.updateUser(userId, {
        stripeCustomerId: customer.id,
      });
    }

    return customer.id;
  } catch (error) {
    console.error('Error creating Stripe customer:', error);
    return null;
  }
}

/**
 * Create a checkout session for the subscription
 */
export async function createSubscriptionCheckoutSession(
  userId: number,
  email: string,
  name: string | null,
  tier: SubscriptionTier,
): Promise<{ url: string } | null> {
  try {
    // Get price ID for the selected tier
    const priceId = tierToPriceId[tier];
    if (!priceId) {
      throw new Error(`No price ID configured for tier: ${tier}`);
    }

    // Get or create Stripe customer
    const customerId = await getOrCreateStripeCustomer(userId, email, name);
    if (!customerId) {
      throw new Error('Failed to create or retrieve Stripe customer');
    }

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
      success_url: `${process.env.APP_URL || 'http://localhost:5000'}/account?checkout_success=true`,
      cancel_url: `${process.env.APP_URL || 'http://localhost:5000'}/pricing?checkout_canceled=true`,
      metadata: {
        userId: userId.toString(),
        tier,
      },
    });

    return { url: session.url || '' };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return null;
  }
}

/**
 * Handle Stripe webhook events
 */
export async function handleStripeWebhook(event: any): Promise<boolean> {
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = parseInt(session.metadata.userId, 10);
        const tier = session.metadata.tier as SubscriptionTier;
        
        // Update user subscription
        if (session.subscription && userId) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription);
          await updateUserSubscription(userId, tier, session.customer, session.subscription);
        }
        break;
      }
      
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const userId = await getUserIdFromCustomer(subscription.customer);
        
        if (userId) {
          const user = await storage.getUser(userId);
          if (user) {
            // Check if subscription status changed
            if (subscription.status === 'active' && user.accountType !== SubscriptionTiers.PAID) {
              await updateUserSubscription(userId, SubscriptionTiers.PAID, subscription.customer, subscription.id);
            } else if (subscription.status !== 'active' && user.accountType === SubscriptionTiers.PAID) {
              // Subscription no longer active, downgrade to free
              await updateUserSubscription(userId, SubscriptionTiers.FREE, subscription.customer, null);
            }
          }
        }
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const userId = await getUserIdFromCustomer(subscription.customer);
        
        if (userId) {
          // Subscription canceled or expired, downgrade to free
          await updateUserSubscription(userId, SubscriptionTiers.FREE, subscription.customer, null);
        }
        break;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error handling webhook:', error);
    return false;
  }
}

/**
 * Update user's subscription tier and permissions
 */
async function updateUserSubscription(
  userId: number,
  tier: SubscriptionTier,
  customerId: string | null,
  subscriptionId: string | null,
): Promise<boolean> {
  try {
    const permissions = configureTierPermissions(tier);
    
    await storage.updateUser(userId, {
      accountType: tier,
      stripeCustomerId: customerId || undefined,
      stripeSubscriptionId: subscriptionId || null,
      // Update permissions based on tier
      canDeploy: permissions.canDeploy,
      canSaveTemplates: permissions.canSaveTemplates,
      projectsLimit: permissions.projectsLimit,
      pagesLimit: permissions.pagesLimit,
      storage: permissions.storage,
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
  try {
    const user = await storage.getUser(userId);
    if (!user || !user.stripeSubscriptionId) {
      return {
        hasActiveSubscription: false,
        tier: user?.accountType || SubscriptionTiers.FREE,
      };
    }
    
    // Get subscription details from Stripe
    const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
    
    return {
      hasActiveSubscription: subscription.status === 'active',
      tier: user.accountType,
      subscription: {
        id: subscription.id,
        status: subscription.status,
        current_period_end: (subscription as any).current_period_end, // Type assertion for compatibility
        cancel_at_period_end: (subscription as any).cancel_at_period_end, // Type assertion for compatibility
      },
    };
  } catch (error) {
    console.error('Error fetching user subscription:', error);
    return {
      hasActiveSubscription: false,
      tier: SubscriptionTiers.FREE,
      error: 'Failed to fetch subscription details',
    };
  }
}

/**
 * Cancel a user's subscription
 */
export async function cancelUserSubscription(userId: number): Promise<boolean> {
  try {
    const user = await storage.getUser(userId);
    if (!user || !user.stripeSubscriptionId) {
      return false;
    }
    
    // Cancel subscription at period end
    await stripe.subscriptions.update(user.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });
    
    return true;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    return false;
  }
}

/**
 * Helper function to get userId from Stripe customerId
 */
async function getUserIdFromCustomer(customerId: string): Promise<number | null> {
  try {
    const customer = await stripe.customers.retrieve(customerId);
    if ('metadata' in customer && customer.metadata.userId) {
      return parseInt(customer.metadata.userId, 10);
    }
    return null;
  } catch (error) {
    console.error('Error retrieving customer:', error);
    return null;
  }
}

// Configure tier permissions
function configureTierPermissions(tier: SubscriptionTier): {
  canDeploy: boolean;
  canSaveTemplates: boolean;
  projectsLimit: number;
  pagesLimit: number;
  storage: number;
} {
  switch (tier) {
    case SubscriptionTiers.GUEST:
      return {
        canDeploy: false,
        canSaveTemplates: false,
        projectsLimit: 1,
        pagesLimit: 1,
        storage: 10, // MB
      };
      
    case SubscriptionTiers.FREE:
      return {
        canDeploy: false,
        canSaveTemplates: false,
        projectsLimit: 3,
        pagesLimit: 1,
        storage: 50, // MB
      };
      
    case SubscriptionTiers.PAID:
      return {
        canDeploy: true,
        canSaveTemplates: true,
        projectsLimit: 10,
        pagesLimit: 1,
        storage: 250, // MB
      };
      
    case SubscriptionTiers.PREMIUM:
      return {
        canDeploy: true,
        canSaveTemplates: true,
        projectsLimit: 30,
        pagesLimit: 3,
        storage: 1000, // MB
      };
      
    default:
      return {
        canDeploy: false,
        canSaveTemplates: false,
        projectsLimit: 3,
        pagesLimit: 1,
        storage: 50, // MB
      };
  }
}