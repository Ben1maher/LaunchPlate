import React from 'react';
import { Component } from '@shared/schema';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface FormComponentProps {
  component: Component;
}

export default function FormComponent({ component }: FormComponentProps) {
  const { type, content, style } = component;
  
  // Generate inline style object with mobile-responsive padding
  const containerStyle = {
    backgroundColor: style.backgroundColor || '#ffffff',
    padding: style.padding || 'clamp(16px, 5vw, 32px)',
    borderRadius: style.borderRadius || '0.5rem',
    boxShadow: style.boxShadow || '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    fontFamily: style.fontFamily,
    color: style.color,
    textAlign: style.textAlign || 'left',
    margin: style.margin || '1rem 0',
    border: style.border || 'none',
    width: '100%',
    maxWidth: '100%',
    ...style
  };

  const headingStyle = {
    fontSize: style.headingFontSize || 'clamp(1.25rem, 3vw, 1.5rem)',
    fontWeight: style.headingFontWeight || 'bold',
    color: style.headingColor || style.color || '#111827',
    marginBottom: '1rem',
    wordWrap: 'break-word' as 'break-word',
    maxWidth: '100%'
  };

  const descriptionStyle = {
    fontSize: style.descriptionFontSize || 'clamp(0.875rem, 2vw, 1rem)',
    color: style.descriptionColor || style.color || '#4b5563',
    marginBottom: '1.5rem',
    wordWrap: 'break-word' as 'break-word',
    maxWidth: '100%'
  };

  const labelStyle = {
    fontSize: style.labelFontSize || '0.875rem',
    fontWeight: style.labelFontWeight || '500',
    color: style.labelColor || style.color || '#374151',
    marginBottom: '0.25rem'
  };

  const buttonStyle = {
    backgroundColor: style.buttonBackgroundColor || '#3b82f6',
    color: style.buttonTextColor || '#ffffff',
    fontWeight: style.buttonFontWeight || '500',
    width: style.buttonFullWidth ? '100%' : 'auto'
  };

  // For standard contact form
  if (type === 'form') {
    const fields = content.fields || [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'message', label: 'Message', type: 'textarea', required: true }
    ];
    
    const formTitle = content.title || 'Contact Us';
    const submitText = content.submitText || 'Send Message';

    return (
      <div style={containerStyle}>
        <h3 style={headingStyle}>{formTitle}</h3>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          {fields.map((field: any, index: number) => (
            <div key={index} className="space-y-2">
              <Label htmlFor={field.name} className="block">
                <span style={labelStyle}>{field.label}</span>
              </Label>
              
              {field.type === 'textarea' ? (
                <Textarea
                  id={field.name}
                  name={field.name}
                  required={field.required}
                  placeholder={`Enter your ${field.label.toLowerCase()}`}
                  rows={4}
                />
              ) : (
                <Input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  required={field.required}
                  placeholder={`Enter your ${field.label.toLowerCase()}`}
                />
              )}
            </div>
          ))}
          
          <Button 
            type="submit" 
            className="mt-2"
            style={buttonStyle}
          >
            {submitText}
          </Button>
        </form>
      </div>
    );
  }
  
  // For email signup form
  const title = content.title || 'Subscribe to our newsletter';
  const description = content.description || 'Get the latest updates and news right to your inbox.';
  const buttonText = content.buttonText || 'Subscribe';

  return (
    <div style={containerStyle}>
      <h3 style={headingStyle}>{title}</h3>
      <p style={descriptionStyle}>{description}</p>
      
      <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="block">
            <span style={labelStyle}>Email address</span>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="Enter your email address"
          />
        </div>
        
        <Button 
          type="submit"
          className="mt-2" 
          style={buttonStyle}
        >
          {buttonText}
        </Button>
      </form>
    </div>
  );
}
