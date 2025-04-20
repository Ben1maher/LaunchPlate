import React from 'react';
import { Component } from '@shared/schema';

interface TestimonialComponentProps {
  component: Component;
}

export default function TestimonialComponent({ component }: TestimonialComponentProps) {
  // Default testimonials for demonstration
  const defaultTestimonials = [
    {
      quote: "This product has completely transformed our business. I cannot recommend it enough!",
      author: "Jane Smith",
      title: "CEO, Example Corp",
      avatar: "https://randomuser.me/api/portraits/women/17.jpg"
    },
    {
      quote: "The best solution we've found on the market. Simple, effective, and affordable.",
      author: "John Davis",
      title: "Marketing Director, Tech Inc",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      quote: "Outstanding service and an incredible product. Will definitely be a repeat customer.",
      author: "Sarah Johnson",
      title: "Founder, StartupXYZ",
      avatar: "https://randomuser.me/api/portraits/women/28.jpg"
    }
  ];

  // Get testimonials from component content or use defaults
  const testimonials = component.content.testimonials || defaultTestimonials;

  switch (component.type) {
    case 'testimonial-single':
      // Get the first testimonial or a default one
      const testimonial = testimonials[0] || defaultTestimonials[0];

      return (
        <div className="w-full py-16 bg-gray-50" style={component.style}>
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="text-4xl text-primary font-serif mb-6">"</div>
              <p className="text-xl md:text-2xl font-medium text-gray-800 mb-8">
                {testimonial.quote}
              </p>
              <div className="flex items-center justify-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.author}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://via.placeholder.com/100';
                    }}
                  />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-gray-900">{testimonial.author}</h4>
                  <p className="text-sm text-gray-600">{testimonial.title}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'testimonial-carousel':
      return (
        <div className="w-full py-16 bg-gray-50" style={component.style}>
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">{component.content.title || 'What Our Clients Say'}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((item, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <div className="text-2xl text-primary font-serif mb-4">"</div>
                  <p className="text-gray-800 mb-6">{item.quote}</p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                      <img 
                        src={item.avatar} 
                        alt={item.author}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = 'https://via.placeholder.com/100';
                        }}
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.author}</h4>
                      <p className="text-xs text-gray-600">{item.title}</p>
                    </div>
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
            <h2 className="text-3xl font-bold text-center mb-12">{component.content.title || 'Testimonials'}</h2>
            <p className="text-center text-gray-600">Please select a specific testimonial component type.</p>
          </div>
        </div>
      );
  }
}