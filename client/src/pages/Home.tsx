import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Template } from "@shared/schema";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  PlusCircle, 
  Layout, 
  GanttChart,
  Rocket,
  Laptop
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const { data: templates, isLoading } = useQuery<Template[]>({
    queryKey: ['/api/templates'],
  });

  // Animation variants for swipe effect
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { x: -100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const buttonVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 150,
        damping: 15,
        delay: 0.8
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="py-12 md:py-20 overflow-hidden">
        <motion.div 
          className="max-w-3xl mx-auto text-center"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h1 
            className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight"
            variants={itemVariants}
          >
            <motion.span 
              className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent inline-block"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              LaunchPlate
            </motion.span>: Create Landing Pages Without Code
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-600 mb-8"
            variants={itemVariants}
          >
            Build, customize, and publish high-converting landing pages with our intuitive drag and drop editor. Perfect for marketing campaigns and lead generation.
          </motion.p>
          
          <motion.div 
            className="flex flex-wrap gap-4 justify-center"
            variants={buttonVariants}
          >
            <a href="#templates-section" onClick={(e) => {
              e.preventDefault();
              document.getElementById('templates-section')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              <Button size="lg" className="text-base relative overflow-hidden group">
                <span className="relative z-10">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 inline-block group-hover:translate-x-1 transition-transform" />
                </span>
                <motion.span 
                  className="absolute inset-0 bg-blue-600 z-0"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
                />
              </Button>
            </a>
            <Link href="/guide">
              <Button variant="outline" size="lg" className="text-base hover:bg-primary/10">
                View Guides
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white rounded-xl shadow-sm mb-12">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            Why Choose Our Landing Page Generator
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-all">
                <CardHeader>
                  <motion.div 
                    className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4"
                    whileHover={{ 
                      scale: 1.1, 
                      backgroundColor: "rgba(var(--primary), 0.2)"
                    }}
                  >
                    <Layout className="h-6 w-6 text-primary" />
                  </motion.div>
                  <CardTitle>Drag & Drop Editor</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Easily build your landing page by dragging and dropping pre-designed components. No coding required.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="h-full hover:shadow-lg transition-all">
                <CardHeader>
                  <motion.div 
                    className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4"
                    whileHover={{ 
                      scale: 1.1, 
                      backgroundColor: "rgba(var(--primary), 0.2)"
                    }}
                  >
                    <GanttChart className="h-6 w-6 text-primary" />
                  </motion.div>
                  <CardTitle>Customizable Templates</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Choose from a variety of professional templates and customize them to match your brand.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="h-full hover:shadow-lg transition-all">
                <CardHeader>
                  <motion.div 
                    className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4"
                    whileHover={{ 
                      scale: 1.1, 
                      backgroundColor: "rgba(var(--primary), 0.2)"
                    }}
                  >
                    <Rocket className="h-6 w-6 text-primary" />
                  </motion.div>
                  <CardTitle>Lead Generation Tools</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Built-in forms and conversion elements to help you capture leads effectively.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section id="templates-section" className="py-12 scroll-mt-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Start with a Template</h2>
            <Link href="/editor">
              <Button variant="outline" className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Create from Scratch
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="h-48 bg-gray-200 animate-pulse"></div>
                  <CardHeader>
                    <div className="h-6 w-2/3 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-4 w-full bg-gray-100 animate-pulse rounded mt-2"></div>
                  </CardHeader>
                  <CardFooter>
                    <div className="h-9 w-full bg-gray-200 animate-pulse rounded"></div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : templates && templates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => {
                // Generate a preview style based on the template name
                let previewStyle: React.CSSProperties = { position: 'relative' };
                let iconColor = "text-gray-400";
                let tagColor = "bg-gray-100 text-gray-600";
                let tagText = "General";
                let previewIcon = <Laptop className={`h-12 w-12 ${iconColor}`} />;
                
                // Customize preview based on template type
                if (template.name.includes("Business")) {
                  previewStyle = { 
                    background: 'linear-gradient(to bottom, #1e3a8a, #3b82f6)',
                    position: 'relative'
                  };
                  iconColor = "text-white";
                  tagColor = "bg-blue-700 text-white";
                  tagText = "Business";
                  previewIcon = <GanttChart className={`h-12 w-12 ${iconColor}`} />;
                } else if (template.name.includes("Startup")) {
                  previewStyle = { 
                    background: 'linear-gradient(to right, #7c3aed, #ec4899)',
                    position: 'relative'
                  };
                  iconColor = "text-white";
                  tagColor = "bg-purple-700 text-white";
                  tagText = "Startup";
                  previewIcon = <Rocket className={`h-12 w-12 ${iconColor}`} />;
                } else if (template.name.includes("Portfolio")) {
                  previewStyle = { 
                    background: '#f3f4f6',
                    position: 'relative',
                    fontFamily: 'Georgia, serif'
                  };
                  iconColor = "text-gray-700";
                  tagColor = "bg-gray-700 text-white";
                  tagText = "Portfolio";
                  previewIcon = <Laptop className={`h-12 w-12 ${iconColor}`} />;
                }
                
                return (
                  <Card key={template.id} className="overflow-hidden group hover:shadow-lg transition-all">
                    <div 
                      className="h-60 flex items-center justify-center" 
                      style={previewStyle}
                    >
                      <span className={`absolute top-3 left-3 px-2 py-1 text-xs font-medium rounded ${tagColor}`}>
                        {tagText}
                      </span>
                      
                      {/* Template preview */}
                      <div className="flex flex-col items-center">
                        <div className="h-16 mb-4 flex items-center justify-center">
                          {previewIcon}
                        </div>
                        <div className={`text-center ${template.name.includes("Business") || template.name.includes("Startup") ? "text-white" : "text-gray-700"}`}>
                          <p className="font-bold text-lg">{template.name.replace(" Template", "")}</p>
                          <p className={`text-sm mt-2 px-6 opacity-80 ${template.name.includes("Business") || template.name.includes("Startup") ? "text-white/70" : "text-gray-500"}`}>
                            {template.description ? template.description.substring(0, 60) + '...' : 'A customizable template for your landing page'}
                          </p>
                        </div>
                      </div>
                      
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="text-white text-center p-5">
                          <p className="font-bold text-xl mb-2">{template.name}</p>
                          <p className="text-sm mb-4 text-white/80">{template.description || 'A customizable template for your landing page'}</p>
                          <Link href={`/editor?template=${template.id}`}>
                            <Button variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                              Use Template
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                    <CardFooter className="flex justify-between items-center py-4">
                      <div>
                        <p className="font-semibold">{template.name}</p>
                      </div>
                      <Link href={`/editor?template=${template.id}`}>
                        <Button variant="outline" size="sm">
                          Use Template
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8">
                <div className="text-center">
                  <p className="text-gray-600">No templates available. Create one from scratch!</p>
                  <Link href="/editor">
                    <Button className="mt-4">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      New Landing Page
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <motion.section 
        className="py-12 my-12 bg-gradient-to-r from-primary to-blue-600 rounded-xl text-white overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 text-center relative z-10">
          {/* Animated background elements */}
          <motion.div 
            className="absolute top-0 left-0 w-64 h-64 rounded-full bg-blue-400 opacity-20 z-0" 
            style={{ filter: "blur(80px)" }}
            animate={{ 
              x: [0, 30, 0], 
              y: [0, 20, 0] 
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 8,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-indigo-500 opacity-20 z-0" 
            style={{ filter: "blur(80px)" }}
            animate={{ 
              x: [0, -40, 0], 
              y: [0, -20, 0] 
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 10,
              ease: "easeInOut",
              delay: 1
            }}
          />
          
          <motion.h2 
            className="text-3xl font-bold mb-4 relative z-10"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Ready to create your landing page?
          </motion.h2>
          <motion.p 
            className="text-white/80 text-lg mb-8 max-w-2xl mx-auto relative z-10"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Start building your professional landing page today and convert more visitors into customers.
          </motion.p>
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link href="/editor">
              <Button 
                size="lg" 
                variant="secondary" 
                className="bg-white text-primary hover:bg-gray-100 relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center">
                  Build Your Landing Page
                  <motion.span 
                    className="ml-2 flex items-center"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 1.5,
                      repeatType: "reverse",
                      ease: "easeInOut"
                    }}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.span>
                </span>
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
