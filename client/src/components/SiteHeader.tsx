import { useLocation } from "wouter";
import { Link } from "wouter";
import { useState } from "react";
import { LayoutGrid, PlusCircle, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/shared/UserMenu";
import { useAuth } from "@/hooks/use-auth";

export default function SiteHeader() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  
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
    { text: "Pricing", url: "/pricing" },
    { text: "Guides", url: "/guide" }
  ];
  
  // Extra nav items for authenticated users
  const authenticatedNavItems = [
    { text: "My Projects", url: "/projects" }
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
          <div className="flex-shrink-0 cursor-pointer">
            <Link href="/">
              {Logo}
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item, index) => (
              <div key={index} className="inline-block">
                <Link href={item.url}>
                  <span className={`font-medium hover:text-primary cursor-pointer ${
                    location === item.url ? 'text-primary' : 'text-gray-700'
                  }`}>
                    {item.text}
                  </span>
                </Link>
              </div>
            ))}
            
            {isAuthenticated && authenticatedNavItems.map((item, index) => (
              <div key={`auth-${index}`} className="inline-block">
                <Link href={item.url}>
                  <span className={`font-medium hover:text-primary cursor-pointer ${
                    location === item.url ? 'text-primary' : 'text-gray-700'
                  }`}>
                    {item.text}
                  </span>
                </Link>
              </div>
            ))}
            
            {/* Desktop CTA button */}
            <Link href={isAuthenticated ? "/editor" : "/auth"}>
              <Button className="bg-primary text-white">
                <PlusCircle className="h-4 w-4 mr-2" />
                New Landing Page
              </Button>
            </Link>
            
            {/* User Menu */}
            <UserMenu />
          </div>

          {/* Mobile menu actions */}
          <div className="md:hidden flex items-center space-x-4">
            <UserMenu />
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
            <div key={index} className="block">
              <Link href={item.url}>
                <span 
                  className={`block py-2 font-medium hover:text-primary cursor-pointer ${
                    location === item.url ? 'text-primary' : 'text-gray-700'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.text}
                </span>
              </Link>
            </div>
          ))}
          
          {isAuthenticated && authenticatedNavItems.map((item, index) => (
            <div key={`auth-${index}`} className="block">
              <Link href={item.url}>
                <span 
                  className={`block py-2 font-medium hover:text-primary cursor-pointer ${
                    location === item.url ? 'text-primary' : 'text-gray-700'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.text}
                </span>
              </Link>
            </div>
          ))}
          
          {/* Account link (only for authenticated users) */}
          {isAuthenticated && (
            <div className="block">
              <Link href="/account">
                <span 
                  className={`block py-2 font-medium hover:text-primary cursor-pointer ${
                    location === '/account' ? 'text-primary' : 'text-gray-700'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  My Account
                </span>
              </Link>
            </div>
          )}
          
          {/* Mobile CTA button */}
          <div className="pt-2">
            <Link href={isAuthenticated ? "/editor" : "/auth"}>
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
