import { ReactNode } from "react";
import SiteHeader from "./SiteHeader";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SiteHeader />
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
}
