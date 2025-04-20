import React from 'react';
import { Component } from '@shared/schema';

interface MarketingComponentProps {
  component: Component;
}

export default function MarketingComponent({ component }: MarketingComponentProps) {
  switch (component.type) {
    case 'stats-bar':
      // Default stats for demonstration
      const defaultStats = [
        { label: 'Active Users', value: '10,000+', icon: 'ri-user-line' },
        { label: 'Countries', value: '50+', icon: 'ri-global-line' },
        { label: 'Companies', value: '200+', icon: 'ri-building-line' },
        { label: 'Satisfaction', value: '99%', icon: 'ri-emotion-happy-line' },
      ];
      
      const stats = component.content.stats || defaultStats;
      
      return (
        <div className="w-full py-12 bg-gray-50" style={component.style}>
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-6 bg-white rounded-lg shadow-sm">
                  <div className="inline-block p-3 bg-primary/10 text-primary rounded-full mb-4">
                    <i className={stat.icon || 'ri-bar-chart-line'} style={{ fontSize: '1.5rem' }}></i>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case 'pricing-cards':
      // Default pricing plans for demonstration
      const defaultPlans = [
        {
          name: 'Basic',
          price: '$9',
          period: 'per month',
          description: 'Perfect for individuals and small projects',
          features: [
            'Feature 1',
            'Feature 2',
            'Feature 3',
          ],
          cta: 'Get Started',
          popular: false
        },
        {
          name: 'Pro',
          price: '$29',
          period: 'per month',
          description: 'Ideal for growing businesses',
          features: [
            'All Basic features',
            'Feature 4',
            'Feature 5',
            'Feature 6',
          ],
          cta: 'Try Pro',
          popular: true
        },
        {
          name: 'Enterprise',
          price: '$99',
          period: 'per month',
          description: 'For large organizations',
          features: [
            'All Pro features',
            'Feature 7',
            'Feature 8',
            'Feature 9',
            'Feature 10',
          ],
          cta: 'Contact Sales',
          popular: false
        }
      ];
      
      const plans = component.content.plans || defaultPlans;
      
      return (
        <div className="w-full py-16" style={component.style}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{component.content.title || 'Choose Your Plan'}</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {component.content.subtitle || 'Select the perfect plan for your needs. All plans include a 14-day free trial.'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {plans.map((plan, index) => (
                <div 
                  key={index} 
                  className={`rounded-lg overflow-hidden shadow-md border ${
                    plan.popular ? 'border-primary' : 'border-gray-200'
                  }`}
                >
                  {plan.popular && (
                    <div className="bg-primary text-white text-center py-2 text-sm font-medium">
                      Most Popular
                    </div>
                  )}
                  <div className="p-6 bg-white">
                    <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                    <div className="flex items-baseline mb-4">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      <span className="text-gray-500 ml-1">{plan.period}</span>
                    </div>
                    <p className="text-gray-600 mb-6">{plan.description}</p>
                    <ul className="mb-6 space-y-2">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center">
                          <i className="ri-check-line text-green-500 mr-2"></i>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      className={`w-full py-2 px-4 rounded-lg transition-colors ${
                        plan.popular 
                          ? 'bg-primary text-white hover:bg-primary/90' 
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {plan.cta}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className="w-full py-12" style={component.style}>
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-6">{component.content.title || 'Marketing Section'}</h2>
            <p className="text-center text-gray-600">Please select a specific marketing component type.</p>
          </div>
        </div>
      );
  }
}