// Collection of high-quality premium templates 
// Each template is built as a standalone React component

import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

// Modern Business Pro Template (Stripe-Inspired)
export const PremiumBusinessTemplate = () => {
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
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white"></div>
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
                Schedule Demo <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 ml-1"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </Button>
            </div>
            <p className="mt-4 text-sm text-gray-500">No credit card required. 14-day free trial.</p>
          </div>
        </div>

        {/* Logos section */}
        <div className="container pb-16">
          <div className="flex flex-col items-center">
            <p className="text-sm text-gray-500 mb-8 uppercase tracking-wide">Trusted by leading companies</p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 grayscale opacity-70">
              <div className="h-8 w-32 bg-gray-200 rounded"></div>
              <div className="h-8 w-32 bg-gray-200 rounded"></div>
              <div className="h-8 w-32 bg-gray-200 rounded"></div>
              <div className="h-8 w-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-20">
        <div className="grid gap-8 lg:grid-cols-3 md:gap-12">
          <div className="relative overflow-hidden rounded-lg border bg-gradient-to-b from-blue-50 to-white p-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-blue-600"><path d="M20 11.08V8l-6-6H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h6"></path><path d="M14 2v6h6"></path><path d="M18 16v2"></path><path d="M18 22v-2"></path><path d="M22 18h-2"></path><path d="M16 18h2"></path><circle cx="17" cy="18" r="5"></circle></svg>
            </div>
            <h3 className="mb-3 text-xl font-bold">Enterprise Security</h3>
            <p className="text-gray-500">
              Bank-level encryption and comprehensive compliance standards keep your data secure and your business protected.
            </p>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-gradient-to-b from-blue-50 to-white p-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-blue-600"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
            </div>
            <h3 className="mb-3 text-xl font-bold">Lightning Performance</h3>
            <p className="text-gray-500">
              Engineered for speed with globally distributed infrastructure and intelligent caching for optimal response times.
            </p>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-gradient-to-b from-blue-50 to-white p-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-blue-600"><path d="M2 20h20"></path><path d="M5 20V8.2a2 2 0 0 1 .59-1.42L10 2.35a2 2 0 0 1 2.82 0l4.3 4.43A2 2 0 0 1 17.7 8.2V20"></path><path d="M12 10v10"></path><path d="M7 15h10"></path></svg>
            </div>
            <h3 className="mb-3 text-xl font-bold">Advanced Analytics</h3>
            <p className="text-gray-500">
              Gain actionable insights with real-time data visualization and customizable reporting dashboards.
            </p>
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
      <footer className="bg-gray-900 text-gray-300 py-16">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
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
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Case Studies</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Reviews</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-sm text-gray-400">
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
};

// Modern E-Commerce Template (Shopify-Inspired)
export const PremiumEcommerceTemplate = () => {
  return (
    <div className="font-sans antialiased">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-white">
        <div className="container mx-auto">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <a href="#" className="mr-6 flex">
                <span className="text-xl font-bold">Shop<span className="text-violet-600">Wave</span></span>
              </a>
              <nav className="hidden md:flex space-x-6">
                <a href="#" className="text-sm font-medium text-gray-700 hover:text-violet-600 transition-colors">New In</a>
                <a href="#" className="text-sm font-medium text-gray-700 hover:text-violet-600 transition-colors">Women</a>
                <a href="#" className="text-sm font-medium text-gray-700 hover:text-violet-600 transition-colors">Men</a>
                <a href="#" className="text-sm font-medium text-gray-700 hover:text-violet-600 transition-colors">Accessories</a>
                <a href="#" className="text-sm font-medium text-gray-700 hover:text-violet-600 transition-colors">Sale</a>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="hidden md:flex items-center text-sm text-gray-700 hover:text-violet-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                Search
              </button>
              <a href="#" className="hidden md:flex items-center text-sm text-gray-700 hover:text-violet-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                Account
              </a>
              <a href="#" className="hidden md:flex items-center text-sm text-gray-700 hover:text-violet-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
                Wishlist
              </a>
              <a href="#" className="flex items-center text-sm font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-violet-600"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                <span className="ml-2 text-sm font-medium">Cart (3)</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gray-50">
        <div className="container mx-auto py-20 px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-violet-100 text-violet-800 font-medium text-sm px-3 py-1 rounded-full mb-6">New Collection</span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6">
                Discover Summer<br />
                <span className="text-violet-600">Essential Styles</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg">
                Refresh your wardrobe with our latest collection of lightweight, breathable pieces perfect for summer days and warm evenings.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="rounded-md bg-violet-600 hover:bg-violet-700">
                  Shop Women
                </Button>
                <Button variant="outline" className="rounded-md border-gray-300">
                  Shop Men
                </Button>
              </div>
              <div className="mt-8 flex items-center text-sm text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2 text-gray-400"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
                <span>Free shipping on orders over $50</span>
              </div>
            </div>
            <div className="relative">
              <div className="relative h-[500px] w-full overflow-hidden rounded-xl bg-gray-100">
                {/* Placeholder for a product image */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-100 to-violet-50 flex items-center justify-center text-violet-200 text-9xl font-bold">
                  <span className="relative">
                    <span className="absolute inset-0 flex items-center justify-center text-violet-600 text-9xl opacity-10">
                      SUMMER
                    </span>
                    <span className="relative text-xl text-violet-800">Featured Product Image</span>
                  </span>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white p-4 shadow-lg rounded-lg">
                <div className="text-sm font-medium text-gray-500">Limited time</div>
                <div className="text-xl font-bold text-gray-900">20% OFF</div>
                <div className="text-violet-600 text-sm">Use code: SUMMER20</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Shop by Category</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[
              { name: "Dresses", count: "120+ Products" },
              { name: "Tops", count: "85+ Products" },
              { name: "Shoes", count: "64+ Products" },
              { name: "Accessories", count: "38+ Products" }
            ].map((category, i) => (
              <div key={i} className="group relative overflow-hidden rounded-lg bg-gray-100 h-60 cursor-pointer transition duration-300 hover:shadow-md">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/60 group-hover:to-gray-900/70 transition-all"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-end p-6 text-center text-white">
                  <h3 className="text-xl font-semibold mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-200 mb-3">{category.count}</p>
                  <span className="inline-flex items-center text-sm font-medium text-white">
                    Shop Now <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 ml-1 transition group-hover:translate-x-1"><path d="m9 18 6-6-6-6"></path></svg>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Featured Products</h2>
            <a href="#" className="text-sm font-medium text-violet-600 hover:text-violet-700 inline-flex items-center">
              View All <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 ml-1"><path d="m9 18 6-6-6-6"></path></svg>
            </a>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Summer Linen Dress", price: "$89.99", rating: 4.9, originalPrice: "$119.99" },
              { name: "Casual Cotton Shirt", price: "$49.99", rating: 4.7 },
              { name: "Relaxed Fit Trousers", price: "$69.99", rating: 4.8, originalPrice: "$89.99" },
              { name: "Lightweight Jacket", price: "$129.99", rating: 4.6 }
            ].map((product, i) => (
              <div key={i} className="group">
                <div className="relative overflow-hidden rounded-lg bg-gray-100 mb-3">
                  <div className="h-80 bg-gray-200"></div>
                  {product.originalPrice && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">SALE</div>
                  )}
                  <div className="absolute top-2 right-2 bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-gray-600 hover:text-red-500 transition-colors"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent h-1/3 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute inset-x-0 bottom-4 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0">
                    <Button className="bg-white text-gray-900 hover:bg-gray-100">Add to Cart</Button>
                  </div>
                </div>
                <h3 className="font-medium text-gray-900">{product.name}</h3>
                <div className="flex items-center mt-1 mb-1">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, j) => (
                      <svg key={j} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={`h-3 w-3 ${j < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}>
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z"></path>
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 ml-2">{product.rating}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-violet-600 font-semibold">{product.price}</span>
                  {product.originalPrice && (
                    <span className="ml-2 text-sm text-gray-500 line-through">{product.originalPrice}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-violet-600">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Subscribe to Our Newsletter</h2>
            <p className="text-violet-100 mb-6">Be the first to know about new collections, exclusive offers, and style tips.</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-grow px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
              />
              <Button className="bg-white text-violet-600 hover:bg-gray-100 px-6">Subscribe</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 pt-16 pb-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <a href="#" className="text-xl font-bold text-white mb-4 block">Shop<span className="text-violet-400">Wave</span></a>
              <p className="text-gray-400 mb-6">Contemporary fashion with quality materials designed for everyday living.</p>
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
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Shop</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Women</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Men</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Accessories</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Sale</a></li>
                <li><a href="#" className="hover:text-white transition-colors">New Arrivals</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Help</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Customer Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Shipping & Returns</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Size Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Sustainability</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Affiliates</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between text-sm">
            <p>© 2025 ShopWave. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};