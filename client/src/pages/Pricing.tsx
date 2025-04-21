import React from 'react';
import Layout from '@/components/Layout';
import PricingTable from '@/components/subscription/PricingTable';

export default function PricingPage() {
  return (
    <Layout>
      <div className="container mx-auto py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary to-pink-600 text-transparent bg-clip-text">
            Choose Your Plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From testing our platform as a guest to unleashing the full power of LaunchPlate with
            our Premium tier, we have a plan for every stage of your landing page journey.
          </p>
        </div>
        
        <PricingTable />
        
        <div className="mt-20 border-t pt-16">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div>
              <h3 className="text-xl font-semibold mb-2">Can I upgrade my plan later?</h3>
              <p className="text-muted-foreground">
                Yes, you can upgrade your plan at any time. Your new features will be available immediately,
                and you'll be charged the prorated amount for the remainder of your billing cycle.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-muted-foreground">
                We accept all major credit cards including Visa, Mastercard, and American Express.
                Payment processing is securely handled through Stripe.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">Can I cancel my subscription?</h3>
              <p className="text-muted-foreground">
                Yes, you can cancel your subscription at any time from your account dashboard.
                You'll continue to have access to your paid features until the end of your billing period.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">What happens to my projects if I downgrade?</h3>
              <p className="text-muted-foreground">
                If you downgrade to a plan that allows fewer projects, you'll need to delete projects to get
                below your new limit. Any deployed sites will become inactive if you downgrade from a
                paid plan to the free tier.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">Do you offer refunds?</h3>
              <p className="text-muted-foreground">
                We offer a 7-day money-back guarantee on all paid plans. If you're not satisfied with
                your subscription, contact our support team within the first 7 days for a full refund.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">What are the limitations of the free plan?</h3>
              <p className="text-muted-foreground">
                The free plan allows you to create and save up to 3 projects, but you cannot deploy
                your landing pages to a live URL. You're also limited to a single page per project.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}