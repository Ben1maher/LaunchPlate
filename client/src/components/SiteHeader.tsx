import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  LayoutGrid,
  BookOpen,
  PlusCircle,
  Menu,
  X
} from "lucide-react";

export default function SiteHeader() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Don't show header on editor page
  if (location.startsWith('/editor')) {
    return null;
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <LayoutGrid className="h-6 w-6 text-primary" />
          <span className="font-semibold text-xl">LaunchPlate</span>
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
        
        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          <Link href="/">
            <Button variant="ghost" className={`px-3 py-2 h-auto ${
              location === '/' ? 'text-primary font-medium' : 'text-gray-600 hover:text-gray-900'
            }`}>
              Home
            </Button>
          </Link>
          <Link href="/guide">
            <Button variant="ghost" className={`px-3 py-2 h-auto ${
              location === '/guide' ? 'text-primary font-medium' : 'text-gray-600 hover:text-gray-900'
            }`}>
              Guides
            </Button>
          </Link>
          <Link href="/editor">
            <Button className="ml-4">
              <PlusCircle className="h-4 w-4 mr-2" />
              New Landing Page
            </Button>
          </Link>
        </nav>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3">
          <nav className="flex flex-col space-y-2">
            <Link href="/">
              <Button variant="ghost" className={`justify-start px-3 py-2 h-auto w-full ${
                location === '/' ? 'text-primary font-medium' : 'text-gray-600 hover:text-gray-900'
              }`}>
                Home
              </Button>
            </Link>
            <Link href="/guide">
              <Button variant="ghost" className={`justify-start px-3 py-2 h-auto w-full ${
                location === '/guide' ? 'text-primary font-medium' : 'text-gray-600 hover:text-gray-900'
              }`}>
                Guides
              </Button>
            </Link>
            <Link href="/editor">
              <Button className="w-full justify-center mt-2">
                <PlusCircle className="h-4 w-4 mr-2" />
                New Landing Page
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
