import { useLocation } from "wouter";
import NavBar from "./shared/NavBar";
import { LayoutGrid, PlusCircle } from "lucide-react";

export default function SiteHeader() {
  const [location] = useLocation();
  
  // Don't show header on editor page
  if (location.startsWith('/editor')) {
    return null;
  }
  
  // Create logo with icon
  const Logo = (
    <div className="flex items-center space-x-2">
      <LayoutGrid className="h-6 w-6 text-primary" />
      <span className="font-semibold text-xl">LaunchPlate</span>
    </div>
  );
  
  // Create navigation items
  const navItems = [
    {
      text: "Home",
      url: "/"
    },
    {
      text: "Guides",
      url: "/guide"
    }
  ];
  
  // CTA button for creating new landing page
  const ctaButton = {
    text: "New Landing Page",
    url: "/editor",
    className: "bg-primary text-white",
    icon: <PlusCircle className="h-4 w-4" />
  };
  
  return (
    <NavBar
      logo={Logo}
      items={navItems}
      ctaButton={ctaButton}
      className="sticky top-0 z-10"
      activeUrl={location}
    />
  );
}
