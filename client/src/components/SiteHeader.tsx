import { useLocation } from "wouter";
import { Link } from "wouter";
import { useState } from "react";
import { LayoutGrid, PlusCircle, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SiteHeader() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
  // Don't show header on editor page
  if (location.startsWith('/editor')) {
    return null;
  }
  
  // Logo component
  const Logo = (
    <div className="flex items-center space-x-2">
      <LayoutGrid className="h-6 w-6 text-primary" />
      <span className="font-semibold text-xl">LaunchPlate</span>
    </div>
  );
  
  // Navigation items
  const navItems = [
    { text: "Home", url: "/" },
    { text: "Guides", url: "/guide" }
  ];
  
  // Toggle mobile menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 cursor-pointer">
            {Logo}
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item, index) => (
              <Link 
                key={index} 
                href={item.url}
                className={`font-medium hover:text-primary ${
                  location === item.url ? 'text-primary' : 'text-gray-700'
                }`}
              >
                {item.text}
              </Link>
            ))}
            
            {/* Desktop CTA button */}
            <Link href="/editor">
              <Button className="bg-primary text-white">
                <PlusCircle className="h-4 w-4 mr-2" />
                New Landing Page
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-3 border-t border-gray-100">
          {navItems.map((item, index) => (
            <Link 
              key={index} 
              href={item.url}
              className={`block py-2 font-medium hover:text-primary ${
                location === item.url ? 'text-primary' : 'text-gray-700'
              }`}
              onClick={() => setIsOpen(false)}
            >
              {item.text}
            </Link>
          ))}
          
          {/* Mobile CTA button */}
          <div className="pt-2">
            <Link href="/editor">
              <Button className="w-full bg-primary text-white">
                <PlusCircle className="h-4 w-4 mr-2" />
                New Landing Page
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
