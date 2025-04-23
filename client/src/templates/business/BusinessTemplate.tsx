// Redesigned Business Template using Tailwind CSS and modern layout

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export default function BusinessTemplate() {
  return (
    <div className="font-sans text-gray-800">
      {/* Hero Section */}
      <section className="bg-gray-50 py-24 px-6 text-center">
        <h1 className="text-5xl font-extrabold mb-4 text-gray-900">
          Build a Stunning Business Presence
        </h1>
        <p className="text-lg mb-8 max-w-2xl mx-auto text-gray-600">
          Launch your business website with pre-built sections, clean design, and fast performance.
        </p>
        <Button className="px-6 py-3 text-lg">Get Started</Button>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {["Responsive Design", "Easy Customization", "SEO Friendly"].map((feature, i) => (
            <Card key={i} className="shadow-md">
              <CardContent className="p-6">
                <Star className="text-blue-500 mb-4" size={32} />
                <h3 className="text-xl font-semibold mb-2">{feature}</h3>
                <p className="text-gray-600 text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio.
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="bg-gray-100 py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-xl italic mb-4">
            "LaunchPlate helped us go from zero to live in a day. Super intuitive and beautiful design."
          </p>
          <div className="font-semibold">— Happy Founder, Acme Inc.</div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-8 text-center border-t">
        <p className="text-sm text-gray-500">© 2025 LaunchPlate. All rights reserved.</p>
      </footer>
    </div>
  );
}