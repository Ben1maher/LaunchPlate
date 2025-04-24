// Premium Business Template with enhanced design and components
// Inspired by modern SaaS websites like Stripe

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChevronRight,
  Shield,
  Zap,
  BarChart,
  Globe,
  Code,
  CheckCircle,
  ArrowRight,
  Star
} from "lucide-react";

export default function BusinessTemplate() {
  return (
    <div className="font-sans antialiased">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6 md:gap-10">
            <div className="font-bold text-xl text-blue-600">Business<span className="text-gray-800">Pro</span></div>
            <nav className="hidden md:flex gap-6">
              <a href="#" className="text-sm font-medium transition-colors hover:text-blue-600">Features</a>
              <a href="#" className="text-sm font-medium transition-colors hover:text-blue-600">Solutions</a>
              <a href="#" className="text-sm font-medium transition-colors hover:text-blue-600">Pricing</a>
              <a href="#" className="text-sm font-medium transition-colors hover:text-blue-600">Resources</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="text-sm font-medium hover:underline underline-offset-4">Sign In</a>
            <Button className="rounded-full" size="sm">Get Started</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-gray-100/50 bg-[center_top_-1px] border-b"></div>
        <div className="absolute top-0 right-0 -z-10 h-full w-full bg-gradient-to-b from-white via-white/90 to-white"></div>
        
        <div className="container relative pt-24 pb-20 md:pt-32 md:pb-24">
          <div className="flex flex-col gap-4 items-center text-center">
            <Badge className="mb-4 rounded-full px-4 py-1 text-sm" variant="outline">Launching Q2 2025</Badge>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tighter text-gray-900 md:text-center">
              Elevate Your Business<br />With <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Professional</span> Solutions
            </h1>
            <p className="mt-4 text-xl text-muted-foreground max-w-2xl md:text-center leading-relaxed">
              Streamline operations, enhance customer experiences, and drive growth with our enterprise-grade platform designed for modern businesses.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button size="lg" className="rounded-full px-8">Start Free Trial</Button>
              <Button size="lg" variant="outline" className="rounded-full px-8 gap-2">
                Schedule Demo <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">No credit card required. 14-day free trial.</p>
          </div>
        </div>

        {/* Logos section */}
        <div className="container pb-16">
          <div className="flex flex-col items-center">
            <p className="text-sm text-gray-500 mb-8">TRUSTED BY LEADING COMPANIES</p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 grayscale opacity-70">
              <div className="h-8 w-auto">
                <svg width="120" height="30" viewBox="0 0 120 30" className="text-gray-800" fill="currentColor">
                  <path d="M20.55 5.78c-4.3 0-7.75 3.43-7.75 7.72 0 4.26 3.45 7.7 7.75 7.7 4.32 0 7.75-3.44 7.75-7.7 0-4.29-3.43-7.72-7.75-7.72z"></path>
                  <path d="M46.2 14.47c0-2.35-1.52-4.7-4.5-4.7-3 0-4.5 2.36-4.5 4.7 0 2.37 1.5 4.69 4.5 4.69 3 0 4.5-2.32 4.5-4.7zm-15.84 0c0-6.32 4.67-10.82 11.33-10.82 6.63 0 11.25 4.5 11.25 10.82 0 6.34-4.62 10.83-11.25 10.83-6.66 0-11.33-4.5-11.33-10.83z"></path>
                  <path d="M59.58 8.4v-4c0-.2.12-.34.34-.34h5.23c.19 0 .3.1.3.34v20.73c0 .18-.11.34-.3.34h-5.23c-.22 0-.34-.12-.34-.34v-3.97c-.94 2.88-3.67 4.75-7.04 4.75-5.7 0-9.92-4.39-9.92-10.83C42.62 8.6 46.84 4 52.54 4c3.37 0 6.1 1.75 7.04 4.4z"></path>
                  <path d="M68.3 14.47c0-6.34 4.2-10.82 10.75-10.82 5.8 0 10.34 3.65 10.34 10.26v1.88c0 .22-.13.37-.35.37H74.55a4.53 4.53 0 0 0 4.65 3.52c1.75 0 3.17-.73 3.93-2 .2-.31.44-.4.75-.2l3.68 2.1c.18.11.3.24.22.5-1.3 2.89-4.8 4.75-8.65 4.75-6.55-.03-10.82-4.5-10.82-10.36zm10.65-6.26c-2.35 0-3.68 1.38-4.27 3.4h8.64c-.55-2.16-2-3.4-4.37-3.4z"></path>
                  <path d="M90.32 3.99h5.3c.18 0 .35.12.35.34v20.8c0 .22-.17.34-.36.34h-5.3c-.21 0-.34-.12-.34-.35V4.33c0-.22.13-.34.35-.34z"></path>
                </svg>
              </div>
              <div className="h-8 w-auto">
                <svg width="120" height="30" viewBox="0 0 120 30" className="text-gray-800" fill="currentColor">
                  <path d="M39.33 16.55c0-.82.24-1.24.87-1.24.62 0 .87.42.87 1.24v7.57c0 .82-.25 1.25-.87 1.25-.63 0-.87-.43-.87-1.25v-7.57zM30.97 16.55c0-.82.24-1.24.87-1.24.62 0 .87.42.87 1.24v7.57c0 .82-.25 1.25-.87 1.25-.63 0-.87-.43-.87-1.25v-7.57z"></path>
                  <path d="M37.98 5.75c1.6 0 2.8 1.25 2.8 2.73 0 1.47-1.2 2.71-2.8 2.71-1.6 0-2.8-1.25-2.8-2.71 0-1.48 1.2-2.73 2.8-2.73zM29.61 5.75c1.6 0 2.8 1.25 2.8 2.73 0 1.47-1.2 2.71-2.8 2.71-1.6 0-2.8-1.25-2.8-2.71 0-1.48 1.2-2.73 2.8-2.73z"></path>
                  <path d="M52.99 11.64c4.62 0 7.3 3.14 7.3 7.35v5.59c0 .51-.37.87-.87.87h-2.34c-.5 0-.87-.36-.87-.87v-5.59c0-2.17-1.37-3.7-3.34-3.7-2.11 0-3.46 1.53-3.46 3.7v5.6c0 .5-.38.86-.87.86h-2.3c-.5 0-.88-.36-.88-.87V12.5c0-.5.38-.87.87-.87h2.31c.5 0 .87.36.87.87v.75c.87-.99 2.24-1.62 3.58-1.62zM85.48 11.64c3.11 0 6.29 2.15 6.29 7.23v5.72c0 .5-.38.87-.88.87h-2.2c-.5 0-.88-.36-.88-.87V18.7c0-2.52-1.24-3.7-3.1-3.7-1.87 0-3.1 1.18-3.1 3.7v5.9c0 .5-.39.86-.88.86h-2.3c-.5 0-.88-.36-.88-.87V12.5c0-.5.38-.87.87-.87h2.31c.5 0 .88.36.88.87v.63c.74-.88 2.09-1.5 3.87-1.5zM106.31 25.71h-2.43c-.5 0-.87-.36-.87-.87v-.62c-.75.87-2.09 1.48-3.84 1.48-3.04 0-6.17-2.14-6.17-7.22V12.5c0-.5.38-.87.87-.87h2.3c.5 0 .88.36.88.87v5.9c0 2.53 1.24 3.7 3.1 3.7 1.87 0 3.1-1.17 3.1-3.7v-5.9c0-.5.38-.87.88-.87h2.3c.5 0 .88.36.88.87v12.34c0 .5-.38.87-.88.87z"></path>
                  <path d="M65.73 11.64c4.44 0 7.3 3.32 7.3 7.47 0 .39-.12.75-.37.99-.25.26-.5.38-.87.38h-10.4v.24c.25 1.78 1.84 3.33 3.83 3.33 1.25 0 2.48-.63 3.1-1.5.25-.38.75-.5 1.24-.25l1.74.87c.5.26.62.75.37 1.25-.99 1.78-3.21 3.33-6.43 3.33-4.58 0-7.8-3.33-7.8-7.97 0-4.4 3.1-7.73 7.67-8.1h.62zm3.16 6.23c-.5-1.95-2.07-2.73-3.4-2.73-1.38 0-2.72.73-3.2 2.73h6.6z"></path>
                </svg>
              </div>
              <div className="h-8 w-auto">
                <svg width="120" height="30" viewBox="0 0 120 30" className="text-gray-800" fill="currentColor">
                  <path d="M28.55 11.49c-1.79 0-3.39.73-4.65 1.89V6.41c0-.23-.19-.41-.41-.41h-3.29c-.23 0-.41.18-.41.41v18.36c0 .23.18.41.41.41h3.28c.23 0 .42-.18.42-.41v-6.21c0-2.33 1.66-4.05 3.78-4.05 2.13 0 3.79 1.72 3.79 4.05v6.21c0 .23.18.41.41.41h3.28c.23 0 .42-.18.42-.41v-6.21c0-4.65-3.31-7.97-7.03-7.97zm13.3 12.88c-2.34 0-4.2-1.12-4.2-3.77V7.42c0-.23-.19-.41-.41-.41h-3.29c-.23 0-.41.18-.41.41v13.59c0 5.07 3.96 7.59 7.95 7.59.23 0 .36-.17.36-.4v-2.94c0-.24-.14-.4-.36-.4h.36v-.01zm15.17-11.96h-3.31c-.23 0-.42.18-.42.41v.71c-.95-1-2.4-1.62-4.03-1.62-3.44 0-6.63 2.85-6.63 7.29s3.19 7.29 6.63 7.29c1.63 0 3.08-.61 4.03-1.62v.71c0 .23.19.41.42.41h3.31c.23 0 .41-.18.41-.41V12.82c0-.23-.18-.41-.41-.41zm-7.33 10.35c-1.95 0-3.54-1.57-3.54-3.56 0-1.99 1.59-3.56 3.54-3.56s3.54 1.57 3.54 3.56c0 1.99-1.59 3.56-3.54 3.56zm29.17-10.76c-.96-1.43-2.54-2.09-4.29-2.09-1.73 0-3.26.6-4.22 1.83v-1.01c0-.23-.19-.41-.42-.41h-3.3c-.23 0-.42.18-.42.41v12.96c0 .23.19.41.42.41h3.3c.23 0 .42-.18.42-.41v-6.52c0-2.09 1.19-3.47 3.02-3.47 1.85 0 2.91 1.15 2.91 3.24v6.75c0 .23.18.41.41.41h3.29c.23 0 .42-.18.42-.41v-7.88c0-1.51-.53-2.95-1.54-3.81zm-27.42 2.3h-3.1v-3.05c0-.23-.19-.41-.41-.41h-3.27c-.23 0-.42.18-.42.41v3.05h-1.55c-.23 0-.41.18-.41.41v2.47c0 .23.18.41.41.41h1.55v5.27c0 3.13 1.84 4.75 4.74 4.75 1.26 0 2.38-.25 3.27-.85.12-.08.19-.21.19-.36v-2.34c0-.23-.17-.35-.35-.35-.06 0-.12.01-.17.04-.49.26-1.24.48-1.86.48-1.01 0-1.56-.45-1.56-1.43v-5.21h3.1c.23 0 .42-.18.42-.41v-2.47c0-.23-.2-.41-.42-.41h.14zm83.21-1.49c-1.75 0-3.27.61-4.24 1.84v-1.02c0-.23-.19-.41-.41-.41h-3.28c-.23 0-.41.18-.41.41v12.96c0 .23.18.41.41.41h3.28c.22 0 .41-.18.41-.41v-6.52c0-2.09 1.2-3.47 3.02-3.47 1.84 0 2.9 1.15 2.9 3.24v6.75c0 .23.19.41.42.41h3.28c.23 0 .41-.18.41-.41v-7.88c0-1.51-.52-2.95-1.53-3.81-.95-1.43-2.51-2.09-4.26-2.09zm-16.95 0c-1.64 0-3.09.63-4.04 1.62v-.71c0-.23-.19-.41-.41-.41h-3.27c-.23 0-.42.18-.42.41v12.96c0 .23.19.41.42.41h3.27c.22 0 .41-.18.41-.41v-6.58c0-1.99 1.64-3.56 3.6-3.56.94 0 1.71.28 2.49.8.09.06.19.09.31.09.1 0 .23-.04.3-.13l1.99-2.47c.15-.18.13-.47-.07-.63-1.27-.96-2.84-1.39-4.58-1.39zm-20.7 12.16c-1.95 0-3.54-1.57-3.54-3.56 0-1.99 1.59-3.56 3.54-3.56s3.54 1.57 3.54 3.56c0 1.99-1.59 3.56-3.54 3.56zm.43-10.65c-1.64 0-3.09.62-4.04 1.62v-6.21c0-.23-.18-.41-.41-.41h-3.28c-.23 0-.41.18-.41.41v18.36c0 .23.18.41.41.41h3.28c.23 0 .41-.18.41-.41v-.71c.95 1 2.4 1.62 4.04 1.62 3.44 0 6.63-2.85 6.63-7.29s-3.19-7.39-6.63-7.39zm-22.17 9.74c-.15-.19-.39-.21-.59-.11-.69.38-1.31.57-2.13.57-1.33 0-2.08-.62-2.08-2.52v-5.33h4.19c.23 0 .41-.18.41-.41v-2.49c0-.23-.18-.41-.41-.41h-4.19V6.41c0-.23-.19-.41-.42-.41h-3.28c-.23 0-.41.18-.41.41v3.05H74.8c-.23 0-.42.18-.42.41v2.49c0 .23.19.41.42.41h1.55v5.88c0 3.77 2.15 5.78 5.88 5.78 1.69 0 3.32-.41 4.51-1.38.16-.13.21-.36.12-.53l-1.28-2.3z"></path>
                </svg>
              </div>
              <div className="h-8 w-auto">
                <svg width="120" height="30" viewBox="0 0 120 30" className="text-gray-800" fill="currentColor">
                  <path d="M89.09 17.17c0-4.38 3.58-7.97 7.94-7.97 4.37 0 7.94 3.6 7.94 7.98 0 4.4-3.57 7.98-7.94 7.98-4.36 0-7.94-3.6-7.94-7.99zm-28.29 0c0-4.38 3.56-7.97 7.94-7.97 4.38 0 7.95 3.6 7.95 7.98 0 4.4-3.57 7.98-7.95 7.98s-7.94-3.6-7.94-7.99zm54.86-1c-.89-.65-1.46-.46-1.85.44-.38.87-.8 1.69-1.23 2.48-3.27-1.41-6.54-2.82-9.95-4.3.27.57.45 1.21.49 1.87.05.7-.05 1.42-.29 2.1 2.29 1.06 4.56 2.14 6.83 3.21-.35.44-.73.86-1.15 1.24-1.14.97-2.6 1.48-4.31 1.52-.23.01-.45.01-.68 0-1.76-.07-3.35-.89-4.58-2.16a7.16 7.16 0 0 1-1.92-3.98c-.23-1.68.11-3.24.93-4.55a7.13 7.13 0 0 1 3.83-3.2c1.87-.67 3.8-.28 4.67-.11-1.97-1.32-4.22-1.75-6.64-1.22-2.26.49-4.15 1.84-5.35 3.82-1.12 1.85-1.53 3.95-1.16 6.32.75-1.11 1.83-1.98 3.14-2.5 1.41-.55 2.92-.48 4.54.22-1.54-2.74-3.9-3.77-6.89-3.15-1.68.35-3.17 1.58-3.75 3.01-.69 1.72-.09 3.82 1.55 5.27 1.84 1.63 4.1 1.68 6.81.12 1.02-.59 2.03-1.17 3.04-1.75.1 1.3.68 2.3 1.76 3.02 1.2.8 2.85.78 4.18-.07.86-.54 1.57-1.3 2.14-2.28-1.85-.73-3.59-1.37-5.3-1.82 1.05-1.5 1.71-3.16 2.02-4.95.48.2.94.39 1.41.59.8.34 1.61.67 2.41 1.01.6.26 1.21.52 1.81.77 2.32.98 4.63 1.96 6.95 2.95.33.14.61.32.85.57-1.89-3.59-1.63-3.04-3.52-6.63z"></path>
                  <path d="M60.16 12.62c-1.43-.45-2.89-.33-4.26.37-1.8.92-2.95 2.59-3.02 4.43-.05 1.27.41 2.5 1.31 3.47.78.84 1.82 1.42 2.93 1.62 1.43.25 2.82-.01 4.09-.78 1.98-1.18 3.03-3.7 2.07-6.18-.54-1.37-1.67-2.47-3.12-2.93zm-29.12.61c-1.07-1.2-2.58-1.9-4.16-1.9-3.75 0-6.8 3.42-6.8 7.63 0 4.2 3.05 7.63 6.8 7.63 1.53 0 3.06-.66 4.13-1.9v1.42h3.48V11.76h-3.45v1.47zm0 9.54c-.5.56-1.67 1.32-2.94 1.32-2.54 0-4.6-2.24-4.6-5.03 0-2.8 2.06-5.03 4.6-5.03 1.31 0 2.51.79 2.94 1.32v7.42z"></path>
                  <path d="M67.59 11.76V26.8h3.45v-1.47c1.07 1.19 2.59 1.9 4.16 1.9 3.75 0 6.8-3.43 6.8-7.63s-3.05-7.64-6.8-7.64c-1.57 0-3.09.66-4.15 1.9v-1.46h-3.46v-.64zm3.46 10c-.5.57-1.65 1.32-2.94 1.32-2.54 0-4.6-2.24-4.6-5.03 0-2.8 2.06-5.03 4.6-5.03 1.3 0 2.5.79 2.94 1.32v7.42zm54-17.03c2.01 0 3.7 1.57 3.86 3.57h-7.72c.15-2 1.85-3.57 3.86-3.57zm-27.42 0c2.01 0 3.7 1.57 3.86 3.57h-7.72c.15-2 1.84-3.57 3.86-3.57zm-61.4 8.72c0-1.47.55-2.87 1.53-3.93 1.03-1.11 2.46-1.78 3.97-1.85 3.08-.15 5.73 2.3 5.94 5.5.04.62.01 1.19-.08 1.72H36.1v.46c.19 1.32.79 2.23 1.79 2.7.61.29 1.28.36 1.99.23.43-.08.84-.3 1.09-.6.24-.28.4-.65.48-1.11h3.39c-.27 1.55-1.1 2.82-2.27 3.55-1.06.66-2.36.92-3.72.77-2.21-.25-4.23-1.95-4.98-4.2-.29-.87-.39-1.79-.33-2.67.02-.19.04-.37.06-.57zm.37-2.33c.9-1.88 2.92-2.55 4.86-2.35 1.12.12 2.13.66 2.9 1.53.65.73 1.05 1.67 1.16 2.7h-7.9c-.13-1.06.4-1.38 1-1.88h-1-1.02zM20.52 12.2v5.62c0 1.76 0 3.41 1.18 4.94 1.15 1.44 2.58 2.35 4.86 2.47 2.8.14 6.24-1.47 7.13-4.86h-3.4c-.65 1.49-1.96 1.93-3.24 1.93-2.43 0-3.36-2.3-3.36-4.38v-5.72h6.2V9h-6.2V4h-3.17V9h-3.01v3.2h2.99l.02-.01zM15.5 9.15l-2.15-1.28-8.12 4.58v-9.3H2.25v22.86h2.98V14.97L14.6 21.5l.9-1.73-8.32-4.8L15.5 9.15z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-20">
        <div className="grid gap-8 lg:grid-cols-3 md:gap-12">
          <div className="relative overflow-hidden rounded-lg border bg-gradient-to-b from-blue-50 to-white p-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="mb-3 text-xl font-bold">Enterprise Security</h3>
            <p className="text-muted-foreground">
              Bank-level encryption and comprehensive compliance standards keep your data secure and your business protected.
            </p>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-gradient-to-b from-blue-50 to-white p-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <Zap className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="mb-3 text-xl font-bold">Lightning Performance</h3>
            <p className="text-muted-foreground">
              Engineered for speed with globally distributed infrastructure and intelligent caching for optimal response times.
            </p>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-gradient-to-b from-blue-50 to-white p-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <BarChart className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="mb-3 text-xl font-bold">Advanced Analytics</h3>
            <p className="text-muted-foreground">
              Gain actionable insights with real-time data visualization and customizable reporting dashboards.
            </p>
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-24">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">All-in-One Business Platform</h2>
            <p className="mt-4 text-lg text-muted-foreground mx-auto max-w-3xl">
              Our comprehensive suite of tools empowers your team to work smarter, not harder.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <Globe className="h-5 w-5" />,
                title: "Global Infrastructure",
                description: "Serve customers worldwide with our distributed network architecture"
              },
              {
                icon: <Code className="h-5 w-5" />,
                title: "Developer Friendly",
                description: "Extensive API documentation and SDKs for seamless integration"
              },
              {
                icon: <Shield className="h-5 w-5" />,
                title: "Compliance Ready",
                description: "GDPR, HIPAA, and SOC 2 compliant for stringent security needs"
              },
              {
                icon: <Zap className="h-5 w-5" />,
                title: "Automation Tools",
                description: "Streamline workflows with intelligent process automation"
              },
              {
                icon: <BarChart className="h-5 w-5" />,
                title: "Performance Metrics",
                description: "Track KPIs and business performance with custom dashboards"
              },
              {
                icon: <CheckCircle className="h-5 w-5" />,
                title: "24/7 Support",
                description: "Expert assistance available around the clock when you need it"
              }
            ].map((feature, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Trusted by Industry Leaders</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              See why thousands of businesses choose our platform for their critical operations.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                content: "The platform has revolutionized how we manage operations across our global offices. The analytics tools are particularly impressive.",
                name: "Sarah Johnson",
                title: "CTO, Acme Industries",
                rating: 5
              },
              {
                content: "Implementation was smooth and the ROI was evident within the first quarter. Our team productivity has increased by 37%.",
                name: "Michael Chen",
                title: "Operations Director, TechCorp",
                rating: 5
              },
              {
                content: "Customer support is exceptional. Any issues we've encountered were resolved quickly and professionally.",
                name: "Emily Rodriguez",
                title: "VP of Sales, Quantum Retail",
                rating: 4
              }
            ].map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-sm h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex mb-4">
                    {Array(testimonial.rating).fill(0).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="italic text-gray-600 flex-grow">{testimonial.content}</p>
                  <div className="mt-6">
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-20 text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Ready to Transform Your Business?</h2>
          <p className="mx-auto max-w-2xl text-lg mb-8">
            Join thousands of companies that are streamlining operations and driving growth with our platform.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="col-span-2">
              <div className="font-bold text-xl text-white mb-4">Business<span className="text-blue-400">Pro</span></div>
              <p className="text-sm text-gray-400 mb-4 max-w-md">
                Comprehensive business solutions designed to streamline operations, enhance customer experiences, and drive sustainable growth.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-3">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Case Studies</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Reviews</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Updates</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-3">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Partners</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-3">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Webinars</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800 text-sm text-gray-400">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p>© 2025 BusinessPro. All rights reserved.</p>
              <div className="flex gap-6 mt-4 md:mt-0">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}