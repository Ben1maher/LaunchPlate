import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { X, Menu } from "lucide-react";

interface NavItem {
  text: string;
  url: string;
}

interface NavBarProps {
  logo: string | React.ReactNode;
  items: NavItem[];
  ctaButton?: {
    text: string;
    url: string;
    className?: string;
    style?: React.CSSProperties;
    icon?: React.ReactNode;
  };
  style?: React.CSSProperties;
  className?: string;
  activeUrl?: string;
}

export default function NavBar({ 
  logo, 
  items, 
  ctaButton, 
  style, 
  className = "", 
  activeUrl = ""
}: NavBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLElement>(null);
  
  // Close the menu when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);
  
  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMenuOpen]);
  
  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <header 
      className={`bg-white border-b border-gray-200 py-4 px-4 relative z-20 ${className}`}
      style={style}
      ref={menuRef}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="text-xl sm:text-2xl font-bold truncate max-w-[150px] sm:max-w-none flex-shrink-0 z-10">
          {typeof logo === 'string' ? logo : logo}
        </div>
        
        {/* Desktop and Mobile Navigation Section */}
        <div className="flex items-center">
          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-6">
            {items.map((item, index) => (
              <a 
                key={index} 
                href={item.url}
                className={`font-medium hover:text-gray-900 ${
                  activeUrl === item.url ? 'text-primary font-medium' : 'text-gray-600'
                }`}
              >
                {item.text}
              </a>
            ))}
          </nav>
          
          {/* Desktop CTA Button */}
          {ctaButton && (
            <div className="hidden md:block ml-6">
              <Button 
                className={ctaButton.className || "bg-primary text-white"}
                style={ctaButton.style}
                asChild
              >
                <a href={ctaButton.url} className="flex items-center">
                  {ctaButton.icon && <span className="mr-2">{ctaButton.icon}</span>}
                  {ctaButton.text}
                </a>
              </Button>
            </div>
          )}
          
          {/* Mobile menu button */}
          <Button
            variant="outline"
            size="icon"
            className="md:hidden flex ml-4"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
      
      {/* Mobile dropdown menu */}
      <div 
        className={`${isMenuOpen ? 'block' : 'hidden'} 
          md:hidden fixed top-[60px] left-0 right-0 w-full z-50 shadow-md 
          bg-white border-t border-gray-100 transition-all duration-300 ease-in-out
          animate-in fade-in slide-in-from-top-5`}
        style={{ maxHeight: 'calc(100vh - 60px)', overflowY: 'auto' }}
      >
        <div className="px-5 py-4 space-y-3">
          {items.map((item, index) => (
            <a 
              key={index} 
              href={item.url} 
              className={`block font-medium hover:bg-gray-50 rounded-md py-3 px-3 transition-colors text-base
                ${activeUrl === item.url ? 'text-primary font-medium bg-gray-50' : 'text-gray-700'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.text}
            </a>
          ))}
          
          {ctaButton && (
            <div className="pt-4 pb-2">
              <Button 
                className={ctaButton.className || "w-full bg-primary text-white"}
                style={ctaButton.style}
                asChild
              >
                <a href={ctaButton.url} className="flex items-center justify-center">
                  {ctaButton.icon && <span className="mr-2">{ctaButton.icon}</span>}
                  {ctaButton.text}
                </a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}