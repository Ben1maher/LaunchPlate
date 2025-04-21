import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

interface PricingTier {
  id: string; // guest, free, paid, premium
  name: string;
  description: string;
  price: number | null;
  features: string[];
  buttonText: string;
  popular?: boolean;
}

// Define the pricing tiers
const pricingTiers: PricingTier[] = [
  {
    id: 'guest',
    name: 'Guest',
    description: 'Experience LaunchPlate without an account',
    price: null,
    features: [
      'Create landing pages',
      'Try out all components',
      'Limited to one session',
      'Cannot save projects',
      'Cannot deploy sites',
    ],
    buttonText: 'Continue as Guest',
  },
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for beginners',
    price: 0,
    features: [
      'Save up to 3 projects',
      'Basic components library',
      'Access to templates',
      'Single page only',
      'Cannot deploy sites',
    ],
    buttonText: 'Create Free Account',
  },
  {
    id: 'paid',
    name: 'Pro',
    description: 'For serious marketers',
    price: 19.99,
    popular: true,
    features: [
      'Save up to 10 projects',
      'Full component library',
      'Priority support',
      'Deploy landing pages',
      'Custom domain support',
      'Single page only',
    ],
    buttonText: 'Upgrade to Pro',
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'For marketing professionals',
    price: 49.99,
    features: [
      'Save up to 30 projects',
      'Full component library',
      'Priority support',
      'Deploy landing pages',
      'Custom domain support',
      'Up to 3 pages per site',
      'Analytics integration',
      'Custom CSS support',
    ],
    buttonText: 'Upgrade to Premium',
  },
];

export default function PricingTable() {
  const { user, isLoading, isAuthenticated, isGuest, guestLoginMutation } = useAuth();
  const { toast } = useToast();
  
  // Get current subscription status
  const { data: subscriptionData, isLoading: subscriptionLoading } = useQuery({
    queryKey: ['/api/subscription'],
    queryFn: async () => {
      if (!isAuthenticated) return null;
      try {
        const res = await apiRequest('GET', '/api/subscription');
        if (!res.ok) throw new Error('Failed to fetch subscription data');
        return await res.json();
      } catch (error) {
        console.error('Error fetching subscription:', error);
        return null;
      }
    },
    enabled: isAuthenticated,
  });

  const handleSubscribe = async (tierId: string) => {
    if (!isAuthenticated) {
      toast({
        title: 'Authentication Required',
        description: 'Please login or register to subscribe to a plan.',
        variant: 'destructive',
      });
      return;
    }
    
    if (tierId === 'guest' || tierId === 'free') {
      // These tiers don't need Stripe checkout
      return;
    }
    
    try {
      const res = await apiRequest('POST', '/api/subscription/checkout', { tier: tierId });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to create checkout session');
      }
      
      const { url } = await res.json();
      
      // Redirect to Stripe checkout
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: 'Checkout Failed',
        description: error.message || 'Failed to initiate checkout process',
        variant: 'destructive',
      });
    }
  };

  const getCurrentTier = (): string => {
    if (!isAuthenticated) return 'free';
    if (isGuest) return 'guest';
    return user?.accountType || 'free';
  };

  const handleGuestLogin = () => {
    guestLoginMutation.mutate();
  };

  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight mb-4">
          Simple, Transparent Pricing
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Choose the plan that's right for you. All plans include access to our drag-and-drop editor.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {pricingTiers.map((tier) => {
          const currentTier = getCurrentTier();
          const isCurrentPlan = currentTier === tier.id;
          const hasSubscription = subscriptionData?.hasActiveSubscription;
          
          return (
            <Card 
              key={tier.id} 
              className={`flex flex-col ${tier.popular ? 'border-primary shadow-lg' : ''}`}
            >
              {tier.popular && (
                <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                  <span className="bg-primary text-white text-xs px-3 py-1 rounded-full">
                    Popular
                  </span>
                </div>
              )}
              <CardHeader>
                <CardTitle>{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
                <div className="mt-4">
                  {tier.price === null ? (
                    <span className="text-3xl font-bold">Free</span>
                  ) : (
                    <>
                      <span className="text-3xl font-bold">${tier.price}</span>
                      <span className="text-muted-foreground">/month</span>
                    </>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <div className="mr-2 mt-1">
                        {feature.startsWith('Cannot') || feature.includes('Limited') ? (
                          <X className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <span className={feature.startsWith('Cannot') || feature.includes('Limited') ? 'text-muted-foreground' : ''}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                {isLoading || subscriptionLoading ? (
                  <Button disabled className="w-full">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </Button>
                ) : isCurrentPlan ? (
                  <Button disabled className="w-full">
                    Current Plan
                  </Button>
                ) : tier.id === 'guest' ? (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleGuestLogin}
                    disabled={guestLoginMutation.isPending}
                  >
                    {guestLoginMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                      </>
                    ) : tier.buttonText}
                  </Button>
                ) : (
                  <Button
                    variant={tier.popular ? "default" : "outline"}
                    className="w-full"
                    onClick={() => handleSubscribe(tier.id)}
                    disabled={(tier.id === 'paid' || tier.id === 'premium') && 
                              hasSubscription && 
                              currentTier !== 'free' && 
                              currentTier !== 'guest'}
                  >
                    {(tier.id === 'paid' || tier.id === 'premium') && 
                     hasSubscription && 
                     currentTier !== 'free' && 
                     currentTier !== 'guest' 
                      ? 'Manage Subscription' 
                      : tier.buttonText}
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <div className="mt-12 text-center text-sm text-muted-foreground">
        <p>
          All plans include a 7-day free trial. No credit card required for free plan.
          <br />
          Need a custom solution? <a href="#" className="text-primary hover:underline">Contact us</a> for custom pricing.
        </p>
      </div>
    </div>
  );
}