import React from 'react';
import { Component } from '@shared/schema';

interface FooterComponentProps {
  component: Component;
}

export default function FooterComponent({ component }: FooterComponentProps) {
  const currentYear = new Date().getFullYear();
  
  switch (component.type) {
    case 'footer-simple':
      const defaultLinks = [
        { label: 'Home', url: '#' },
        { label: 'About', url: '#' },
        { label: 'Services', url: '#' },
        { label: 'Blog', url: '#' },
        { label: 'Contact', url: '#' },
      ];
      
      const links = component.content.links || defaultLinks;
      const companyName = component.content.companyName || 'LaunchPlate';
      
      return (
        <footer className="w-full bg-gray-900 text-white py-8" style={component.style}>
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="text-center md:text-left mb-4 md:mb-0">
                <h3 className="text-xl font-bold mb-2">{companyName}</h3>
                <p className="text-gray-400 text-sm">
                  {component.content.tagline || 'Building better solutions for a digital world.'}
                </p>
              </div>
              
              <div className="flex justify-center md:justify-end space-x-6">
                {links.map((link, index) => (
                  <a 
                    key={index}
                    href={link.url}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-8 pt-6 text-center md:text-left text-sm text-gray-400">
              <p>&copy; {currentYear} {companyName}. All rights reserved.</p>
            </div>
          </div>
        </footer>
      );
    
    case 'footer-columns':
      const defaultSocials = [
        { icon: 'ri-facebook-fill', url: '#' },
        { icon: 'ri-twitter-fill', url: '#' },
        { icon: 'ri-instagram-line', url: '#' },
        { icon: 'ri-linkedin-fill', url: '#' },
      ];
      
      const defaultColumns = [
        {
          title: 'Company',
          links: [
            { label: 'About', url: '#' },
            { label: 'Careers', url: '#' },
            { label: 'Press', url: '#' },
            { label: 'Blog', url: '#' },
          ]
        },
        {
          title: 'Products',
          links: [
            { label: 'Features', url: '#' },
            { label: 'Pricing', url: '#' },
            { label: 'Use Cases', url: '#' },
            { label: 'Integrations', url: '#' },
          ]
        },
        {
          title: 'Resources',
          links: [
            { label: 'Documentation', url: '#' },
            { label: 'Guides', url: '#' },
            { label: 'Support', url: '#' },
            { label: 'API', url: '#' },
          ]
        },
        {
          title: 'Legal',
          links: [
            { label: 'Privacy', url: '#' },
            { label: 'Terms', url: '#' },
            { label: 'Security', url: '#' },
          ]
        }
      ];
      
      const columns = component.content.columns || defaultColumns;
      const socials = component.content.socials || defaultSocials;
      const company = component.content.companyName || 'LaunchPlate';
      
      return (
        <footer className="w-full bg-gray-900 text-white pt-16 pb-8" style={component.style}>
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
              <div className="col-span-2">
                <h3 className="text-2xl font-bold mb-4">{company}</h3>
                <p className="text-gray-400 mb-6 max-w-md">
                  {component.content.description || 
                    'We help businesses of all sizes build stunning landing pages that convert visitors into customers.'}
                </p>
                <div className="flex space-x-4">
                  {socials.map((social, index) => (
                    <a 
                      key={index}
                      href={social.url}
                      className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors"
                    >
                      <i className={social.icon}></i>
                    </a>
                  ))}
                </div>
              </div>
              
              {columns.map((column, index) => (
                <div key={index}>
                  <h4 className="font-semibold text-lg mb-4">{column.title}</h4>
                  <ul className="space-y-2">
                    {column.links.map((link, idx) => (
                      <li key={idx}>
                        <a 
                          href={link.url} 
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-400">
              <p>&copy; {currentYear} {company}. All rights reserved.</p>
            </div>
          </div>
        </footer>
      );
      
    default:
      return (
        <footer className="w-full bg-gray-900 text-white py-8" style={component.style}>
          <div className="container mx-auto px-4 text-center">
            <p>&copy; {currentYear} Your Company. All rights reserved.</p>
          </div>
        </footer>
      );
  }
}