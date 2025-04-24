// Premium E-Commerce Template with modern design elements
// Inspired by top e-commerce sites like Shopify

import React from "react";
import { Button } from "@/components/ui/button";
import { 
  ShoppingBag, 
  Search, 
  User, 
  Heart, 
  ChevronRight, 
  Star, 
  Truck, 
  ShieldCheck, 
  RefreshCw, 
  MessageCircle 
} from "lucide-react";

export default function EcommerceTemplate() {
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
                <Search className="h-4 w-4 mr-1" />
                Search
              </button>
              <a href="#" className="hidden md:flex items-center text-sm text-gray-700 hover:text-violet-600">
                <User className="h-4 w-4 mr-1" />
                Account
              </a>
              <a href="#" className="hidden md:flex items-center text-sm text-gray-700 hover:text-violet-600">
                <Heart className="h-4 w-4 mr-1" />
                Wishlist
              </a>
              <a href="#" className="flex items-center text-sm font-medium">
                <ShoppingBag className="h-5 w-5 text-violet-600" />
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
                <Button size="lg" className="rounded-md bg-violet-600 hover:bg-violet-700">
                  Shop Women
                </Button>
                <Button size="lg" variant="outline" className="rounded-md border-gray-300">
                  Shop Men
                </Button>
              </div>
              <div className="mt-8 flex items-center text-sm text-gray-500">
                <Truck className="h-4 w-4 mr-2 text-gray-400" />
                <span>Free shipping on orders over $50</span>
              </div>
            </div>
            <div className="relative">
              <div className="relative h-[500px] w-full overflow-hidden rounded-xl bg-gray-100">
                {/* Ideally replace with an actual image */}
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
                    Shop Now <ChevronRight className="h-4 w-4 ml-1 transition group-hover:translate-x-1" />
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
              View All <ChevronRight className="h-4 w-4 ml-1" />
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
                    <Heart className="h-4 w-4 text-gray-600 hover:text-red-500 transition-colors" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent h-1/3 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute inset-x-0 bottom-4 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0">
                    <Button className="bg-white text-gray-900 hover:bg-gray-100">Add to Cart</Button>
                  </div>
                </div>
                <h3 className="font-medium text-gray-900">{product.name}</h3>
                <div className="flex items-center mt-1 mb-1">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
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

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">What Our Customers Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Thousands of satisfied customers trust ShopWave for their fashion needs. See what they have to say about our products and service.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                review: "The quality of the clothes is amazing. I've ordered multiple times and have always been impressed with both the products and service.",
                rating: 5
              },
              {
                name: "Michael Chang",
                review: "Fast shipping and the fit is perfect! The size guide is very accurate which makes online shopping so much easier.",
                rating: 5
              },
              {
                name: "Emma Wilson",
                review: "Love the summer collection! The fabrics are lightweight and perfect for warm weather. Will definitely be ordering more.",
                rating: 4
              }
            ].map((testimonial, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-6 shadow-sm">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className={`h-4 w-4 ${j < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"{testimonial.review}"</p>
                <p className="font-medium text-gray-900">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Banner */}
      <section className="py-12 bg-gray-50 border-y border-gray-200">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: <Truck className="h-6 w-6" />, title: "Free Shipping", text: "On orders over $50" },
              { icon: <RefreshCw className="h-6 w-6" />, title: "Easy Returns", text: "30 day return policy" },
              { icon: <ShieldCheck className="h-6 w-6" />, title: "Secure Payments", text: "Protected by Stripe" },
              { icon: <MessageCircle className="h-6 w-6" />, title: "24/7 Support", text: "Chat with our team" }
            ].map((feature, i) => (
              <div key={i} className="flex items-center">
                <div className="mr-4 text-violet-600">{feature.icon}</div>
                <div>
                  <h3 className="font-medium text-gray-900">{feature.title}</h3>
                  <p className="text-sm text-gray-500">{feature.text}</p>
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
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
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
}