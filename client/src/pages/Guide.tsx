import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { 
  BookOpen, 
  Play, 
  PlusCircle, 
  MousePointerClick, 
  Palette, 
  Check, 
  ChevronRight,
  Rocket,
  Users,
  BarChart,
  ArrowRightLeft,
  Globe,
  Code 
} from "lucide-react";

export default function Guide() {
  const [activeTab, setActiveTab] = useState("getting-started");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Landing Page Generator Guide</h1>
        <p className="text-gray-600">
          Learn how to create, customize, and publish high-converting landing pages with our step-by-step guides.
        </p>
      </div>

      <Tabs defaultValue="getting-started" value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-transparent h-auto p-0">
          <TabsTrigger 
            value="getting-started" 
            className="data-[state=active]:bg-primary-50 data-[state=active]:text-primary-900 flex items-center gap-2 py-3 h-auto"
          >
            <Play className="h-4 w-4" />
            <span>Getting Started</span>
          </TabsTrigger>
          <TabsTrigger 
            value="design-tips" 
            className="data-[state=active]:bg-primary-50 data-[state=active]:text-primary-900 flex items-center gap-2 py-3 h-auto"
          >
            <Palette className="h-4 w-4" />
            <span>Design Tips</span>
          </TabsTrigger>
          <TabsTrigger 
            value="lead-generation" 
            className="data-[state=active]:bg-primary-50 data-[state=active]:text-primary-900 flex items-center gap-2 py-3 h-auto"
          >
            <Users className="h-4 w-4" />
            <span>Lead Generation</span>
          </TabsTrigger>
          <TabsTrigger 
            value="deployment" 
            className="data-[state=active]:bg-primary-50 data-[state=active]:text-primary-900 flex items-center gap-2 py-3 h-auto"
          >
            <Rocket className="h-4 w-4" />
            <span>Deployment</span>
          </TabsTrigger>
        </TabsList>

        {/* Getting Started Tab */}
        <TabsContent value="getting-started">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Getting Started with the Landing Page Generator</CardTitle>
                  <CardDescription>
                    Learn the basics of creating your first landing page
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="text-base font-medium">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary-100 text-primary-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold">1</div>
                          Getting to Know the Editor
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pl-11 text-gray-600 leading-relaxed space-y-4">
                        <p>
                          The editor consists of three main panels:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                          <li><strong>Component Library (Left):</strong> Contains all the building blocks you can use to create your landing page.</li>
                          <li><strong>Canvas (Center):</strong> This is where you build your landing page by dropping components.</li>
                          <li><strong>Properties Panel (Right):</strong> Customize the selected component's appearance and content.</li>
                        </ul>
                        <p>
                          Use the top toolbar to undo/redo changes, preview your page, and save your work.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-2">
                      <AccordionTrigger className="text-base font-medium">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary-100 text-primary-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold">2</div>
                          Creating Your First Page
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pl-11 text-gray-600 leading-relaxed space-y-4">
                        <p>
                          Start by choosing a template or building from scratch:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                          <li><strong>Using a Template:</strong> Select a template from the home page to start with a pre-designed layout.</li>
                          <li><strong>Starting from Scratch:</strong> Click "New Landing Page" and begin adding components.</li>
                        </ul>
                        <p>
                          To add components to your page:
                        </p>
                        <ol className="list-decimal pl-5 space-y-2">
                          <li>Locate the desired component in the left panel.</li>
                          <li>Drag it onto the canvas and drop it where you want it to appear.</li>
                          <li>Click on the component to select it and edit its properties in the right panel.</li>
                        </ol>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-3">
                      <AccordionTrigger className="text-base font-medium">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary-100 text-primary-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold">3</div>
                          Customizing Your Components
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pl-11 text-gray-600 leading-relaxed space-y-4">
                        <p>
                          After adding components, you'll want to customize them to match your brand:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                          <li><strong>Text Editing:</strong> Click on any text to edit its content directly on the canvas.</li>
                          <li><strong>Style Changes:</strong> Select a component and use the Properties panel to adjust colors, fonts, spacing, and more.</li>
                          <li><strong>Images:</strong> Upload your own images or use placeholders until you have final assets.</li>
                        </ul>
                        <p>
                          Remember to save your work frequently using the Save button in the top toolbar.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-4">
                      <AccordionTrigger className="text-base font-medium">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary-100 text-primary-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold">4</div>
                          Previewing and Testing
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pl-11 text-gray-600 leading-relaxed space-y-4">
                        <p>
                          Before publishing, preview and test your landing page:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                          <li><strong>Preview Mode:</strong> Click the "Preview" button to see how your page will look to visitors.</li>
                          <li><strong>Responsive Testing:</strong> Use the device toggle in the canvas controls to check how your page looks on different screen sizes.</li>
                          <li><strong>Test Forms:</strong> Make sure any forms or interactive elements work correctly.</li>
                        </ul>
                        <p>
                          If you find issues, return to the editor to make adjustments.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  
                  <div className="pt-4">
                    <Link href="/editor">
                      <Button className="gap-2">
                        <PlusCircle className="h-4 w-4" />
                        Create Your First Landing Page
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Start Video</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-100 aspect-video rounded flex items-center justify-center">
                    <Play className="h-12 w-12 text-gray-400" />
                  </div>
                  <Button variant="outline" className="w-full mt-4 gap-2">
                    <Play className="h-4 w-4" />
                    Watch Tutorial
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Helpful Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li>
                      <Button variant="link" className="p-0 h-auto flex items-center gap-2 text-primary-600">
                        <BookOpen className="h-4 w-4" />
                        Landing Page Best Practices
                      </Button>
                    </li>
                    <li>
                      <Button variant="link" className="p-0 h-auto flex items-center gap-2 text-primary-600">
                        <MousePointerClick className="h-4 w-4" />
                        Component Library Overview
                      </Button>
                    </li>
                    <li>
                      <Button variant="link" className="p-0 h-auto flex items-center gap-2 text-primary-600">
                        <Palette className="h-4 w-4" />
                        Design Guidelines
                      </Button>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Design Tips Tab */}
        <TabsContent value="design-tips">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Design Tips for Effective Landing Pages</CardTitle>
                  <CardDescription>
                    Learn how to design landing pages that engage visitors and drive conversions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-3 mb-1">
                          <Check className="h-5 w-5 text-primary-500" />
                          <CardTitle className="text-lg">Clear Visual Hierarchy</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="text-gray-600">
                        <p>Guide visitors' attention by using size, color, and spacing to emphasize important elements. Your main headline should be the largest text, followed by subheadings and body text.</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-3 mb-1">
                          <Check className="h-5 w-5 text-primary-500" />
                          <CardTitle className="text-lg">Consistent Branding</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="text-gray-600">
                        <p>Use your brand colors, fonts, and logo consistently throughout the page. This builds recognition and trust with your audience.</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-3 mb-1">
                          <Check className="h-5 w-5 text-primary-500" />
                          <CardTitle className="text-lg">White Space</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="text-gray-600">
                        <p>Don't crowd your page with too many elements. Use white space (empty space) to create breathing room and make your content more readable.</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-3 mb-1">
                          <Check className="h-5 w-5 text-primary-500" />
                          <CardTitle className="text-lg">Compelling CTA Buttons</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="text-gray-600">
                        <p>Make your call-to-action buttons stand out with contrasting colors. Use action-oriented text like "Get Started" or "Sign Up Now" instead of generic "Submit".</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-3 mb-1">
                          <Check className="h-5 w-5 text-primary-500" />
                          <CardTitle className="text-lg">Mobile Responsiveness</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="text-gray-600">
                        <p>Test your landing page on various devices. Ensure text is readable, buttons are easy to tap, and images display correctly on all screen sizes.</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-3 mb-1">
                          <Check className="h-5 w-5 text-primary-500" />
                          <CardTitle className="text-lg">Relevant Imagery</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="text-gray-600">
                        <p>Use high-quality images that relate to your offer. People are drawn to faces, so consider using images of people interacting with your product.</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="pt-4">
                    <Link href="/editor">
                      <Button className="gap-2">
                        <Palette className="h-4 w-4" />
                        Apply These Design Tips
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Color Psychology</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">Different colors evoke different emotions and responses:</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-600 rounded"></div>
                      <span className="text-sm"><strong>Blue:</strong> Trust, security, calm</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-green-600 rounded"></div>
                      <span className="text-sm"><strong>Green:</strong> Growth, health, wealth</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-red-600 rounded"></div>
                      <span className="text-sm"><strong>Red:</strong> Urgency, passion, excitement</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-orange-500 rounded"></div>
                      <span className="text-sm"><strong>Orange:</strong> Enthusiasm, creativity</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-purple-600 rounded"></div>
                      <span className="text-sm"><strong>Purple:</strong> Luxury, wisdom, creativity</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm">Choose colors that align with your brand and the emotional response you want to evoke from visitors.</p>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Font Pairing Guide</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Effective font combinations for landing pages:</p>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-serif text-lg mb-1">Serif + Sans-serif</h4>
                      <p className="text-sm text-gray-600">Classic combination with serif for headings and sans-serif for body text.</p>
                    </div>
                    
                    <div>
                      <h4 className="font-sans text-lg font-bold mb-1">Bold Sans + Light Sans</h4>
                      <p className="text-sm text-gray-600">Modern approach using the same font family with different weights.</p>
                    </div>
                    
                    <div>
                      <h4 className="font-mono text-lg mb-1">Monospace for Tech</h4>
                      <p className="text-sm text-gray-600">Great for tech products or to create a minimalist, technical feel.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Lead Generation Tab */}
        <TabsContent value="lead-generation">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Lead Generation Strategies</CardTitle>
                  <CardDescription>
                    Maximize conversions with effective lead generation techniques
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="lead-1">
                      <AccordionTrigger className="text-base font-medium">
                        <div className="flex items-center gap-3">
                          <Users className="h-5 w-5 text-primary-500" />
                          Creating Effective Lead Capture Forms
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pl-8 text-gray-600 leading-relaxed space-y-4">
                        <p>
                          Forms are the primary way to capture lead information. Follow these best practices:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                          <li><strong>Keep it simple:</strong> Only ask for essential information. Each additional field reduces conversion rates.</li>
                          <li><strong>Clear labels:</strong> Use descriptive labels for each form field.</li>
                          <li><strong>Show progress:</strong> For multi-step forms, show users where they are in the process.</li>
                          <li><strong>Mobile-friendly:</strong> Ensure forms are easy to complete on mobile devices.</li>
                          <li><strong>Error handling:</strong> Provide clear error messages if users enter invalid information.</li>
                        </ul>
                        <p>
                          The most effective forms typically have 3-5 fields and include a compelling call-to-action button.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="lead-2">
                      <AccordionTrigger className="text-base font-medium">
                        <div className="flex items-center gap-3">
                          <ArrowRightLeft className="h-5 w-5 text-primary-500" />
                          Crafting Compelling CTAs
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pl-8 text-gray-600 leading-relaxed space-y-4">
                        <p>
                          Your call-to-action (CTA) is arguably the most important element on your landing page:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                          <li><strong>Action-oriented language:</strong> Use verbs that inspire action (Get, Start, Join, Discover).</li>
                          <li><strong>Create urgency:</strong> Words like "Now," "Today," or "Limited Time" can increase conversions.</li>
                          <li><strong>Make it stand out:</strong> Use contrasting colors and sufficient size to make your CTA button visible.</li>
                          <li><strong>Be specific:</strong> "Get My Free E-book" is better than "Submit" or "Click Here".</li>
                          <li><strong>Position strategically:</strong> Place CTAs after you've established value, and consider multiple placements for long pages.</li>
                        </ul>
                        <p>
                          Test different CTA variations to see which performs best with your specific audience.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="lead-3">
                      <AccordionTrigger className="text-base font-medium">
                        <div className="flex items-center gap-3">
                          <BarChart className="h-5 w-5 text-primary-500" />
                          Using Social Proof
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pl-8 text-gray-600 leading-relaxed space-y-4">
                        <p>
                          Social proof reduces uncertainty and builds trust with potential leads:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                          <li><strong>Testimonials:</strong> Include authentic testimonials from satisfied customers. Include photos and full names when possible.</li>
                          <li><strong>Case studies:</strong> Showcase detailed success stories that demonstrate the value of your offering.</li>
                          <li><strong>Statistics:</strong> Share impressive numbers like "Join 10,000+ satisfied customers" or "98% satisfaction rate".</li>
                          <li><strong>Trust badges:</strong> Display logos of well-known clients, certifications, or security measures.</li>
                          <li><strong>Reviews:</strong> Include star ratings or review snippets from third-party platforms.</li>
                        </ul>
                        <p>
                          Place social proof elements strategically near your CTAs to maximize their impact on conversion.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="lead-4">
                      <AccordionTrigger className="text-base font-medium">
                        <div className="flex items-center gap-3">
                          <Code className="h-5 w-5 text-primary-500" />
                          Integrating with CRM Systems
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pl-8 text-gray-600 leading-relaxed space-y-4">
                        <p>
                          To effectively manage and follow up with leads, integrate your landing page with a CRM system:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                          <li><strong>Automatic data transfer:</strong> Ensure form submissions are automatically added to your CRM.</li>
                          <li><strong>Lead scoring:</strong> Set up criteria to identify high-quality leads based on the information collected.</li>
                          <li><strong>Segmentation:</strong> Organize leads into different categories for targeted follow-up.</li>
                          <li><strong>Automated responses:</strong> Set up immediate email confirmations to acknowledge form submissions.</li>
                          <li><strong>Analytics tracking:</strong> Monitor which channels are bringing in the most valuable leads.</li>
                        </ul>
                        <p>
                          Popular CRM options include HubSpot, Salesforce, Zoho CRM, and ActiveCampaign.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  
                  <div className="pt-4">
                    <Link href="/editor">
                      <Button className="gap-2">
                        <Users className="h-4 w-4" />
                        Implement Lead Generation Elements
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Lead Magnet Ideas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Valuable offers to encourage sign-ups:</p>
                  
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <ChevronRight className="h-5 w-5 text-primary-500 flex-shrink-0 mt-0.5" />
                      <span><strong>E-books/Guides</strong>: Comprehensive resources on topics relevant to your audience.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="h-5 w-5 text-primary-500 flex-shrink-0 mt-0.5" />
                      <span><strong>Checklists/Templates</strong>: Ready-to-use resources that save time.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="h-5 w-5 text-primary-500 flex-shrink-0 mt-0.5" />
                      <span><strong>Free Trials</strong>: Limited-time access to your product or service.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="h-5 w-5 text-primary-500 flex-shrink-0 mt-0.5" />
                      <span><strong>Webinars</strong>: Educational video content with expert insights.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="h-5 w-5 text-primary-500 flex-shrink-0 mt-0.5" />
                      <span><strong>Quizzes/Assessments</strong>: Interactive content with personalized results.</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Conversion Rate Checklist</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <div className="h-5 w-5 border border-gray-300 rounded flex items-center justify-center">
                        <Check className="h-3 w-3 text-primary-500" />
                      </div>
                      <span className="text-sm">Clear, compelling headline</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-5 w-5 border border-gray-300 rounded flex items-center justify-center">
                        <Check className="h-3 w-3 text-primary-500" />
                      </div>
                      <span className="text-sm">Subheading explaining benefits</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-5 w-5 border border-gray-300 rounded flex items-center justify-center">
                        <Check className="h-3 w-3 text-primary-500" />
                      </div>
                      <span className="text-sm">Focused, distraction-free design</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-5 w-5 border border-gray-300 rounded flex items-center justify-center">
                        <Check className="h-3 w-3 text-primary-500" />
                      </div>
                      <span className="text-sm">Visible, compelling CTA</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-5 w-5 border border-gray-300 rounded flex items-center justify-center">
                        <Check className="h-3 w-3 text-primary-500" />
                      </div>
                      <span className="text-sm">Social proof elements</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-5 w-5 border border-gray-300 rounded flex items-center justify-center">
                        <Check className="h-3 w-3 text-primary-500" />
                      </div>
                      <span className="text-sm">Benefit-focused content</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-5 w-5 border border-gray-300 rounded flex items-center justify-center">
                        <Check className="h-3 w-3 text-primary-500" />
                      </div>
                      <span className="text-sm">Short, simple form</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-5 w-5 border border-gray-300 rounded flex items-center justify-center">
                        <Check className="h-3 w-3 text-primary-500" />
                      </div>
                      <span className="text-sm">Mobile responsiveness</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-5 w-5 border border-gray-300 rounded flex items-center justify-center">
                        <Check className="h-3 w-3 text-primary-500" />
                      </div>
                      <span className="text-sm">Fast loading speed</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Deployment Tab */}
        <TabsContent value="deployment">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Publishing and Promoting Your Landing Page</CardTitle>
                  <CardDescription>
                    Learn how to deploy your landing page and drive traffic to it
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="deploy-1">
                      <AccordionTrigger className="text-base font-medium">
                        <div className="flex items-center gap-3">
                          <Globe className="h-5 w-5 text-primary-500" />
                          Domain and Hosting Options
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pl-8 text-gray-600 leading-relaxed space-y-4">
                        <p>
                          Choose the right hosting solution for your landing page:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                          <li><strong>Dedicated domain:</strong> For maximum professionalism, host your landing page on your own domain (e.g., yourbrand.com/offer).</li>
                          <li><strong>Subdomain:</strong> Create a subdomain specifically for your campaign (e.g., offer.yourbrand.com).</li>
                          <li><strong>Landing page platforms:</strong> Services like Unbounce, Instapage, or HubSpot offer integrated hosting.</li>
                          <li><strong>Website builders:</strong> Platforms like Wix, Squarespace, or WordPress provide easy hosting options.</li>
                          <li><strong>Web hosting:</strong> Traditional web hosting services like Bluehost, SiteGround, or HostGator allow you to upload your landing page files.</li>
                        </ul>
                        <p>
                          When choosing a domain name, keep it short, relevant to your offer, and easy to remember.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="deploy-2">
                      <AccordionTrigger className="text-base font-medium">
                        <div className="flex items-center gap-3">
                          <Rocket className="h-5 w-5 text-primary-500" />
                          Publishing Process
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pl-8 text-gray-600 leading-relaxed space-y-4">
                        <p>
                          Follow these steps to publish your landing page:
                        </p>
                        <ol className="list-decimal pl-5 space-y-2">
                          <li><strong>Final review:</strong> Check all content, links, and forms to ensure everything works correctly.</li>
                          <li><strong>Export your page:</strong> Click the "Publish" button in the editor to generate your landing page files.</li>
                          <li><strong>Choose deployment method:</strong> Select where you want to host your landing page.</li>
                          <li><strong>Upload files:</strong> If using traditional web hosting, upload the files via FTP or the hosting control panel.</li>
                          <li><strong>Set up domain/URL:</strong> Configure your domain or subdomain to point to your landing page.</li>
                          <li><strong>Test after deployment:</strong> Verify all functionality works correctly on the live page.</li>
                        </ol>
                        <p>
                          Always test your forms and tracking on the live page before driving traffic to it.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="deploy-3">
                      <AccordionTrigger className="text-base font-medium">
                        <div className="flex items-center gap-3">
                          <Users className="h-5 w-5 text-primary-500" />
                          Driving Traffic to Your Landing Page
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pl-8 text-gray-600 leading-relaxed space-y-4">
                        <p>
                          Use these channels to attract visitors to your landing page:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                          <li><strong>Paid advertising:</strong> Google Ads, Facebook/Instagram Ads, LinkedIn Ads, etc. targeting specific demographics.</li>
                          <li><strong>Email marketing:</strong> Send dedicated emails to your existing subscriber list.</li>
                          <li><strong>Social media:</strong> Share your landing page on your social platforms and consider creating specific content to promote it.</li>
                          <li><strong>Content marketing:</strong> Create blog posts, videos, or podcasts that lead to your landing page.</li>
                          <li><strong>Partnerships:</strong> Collaborate with complementary businesses or influencers who can promote your landing page.</li>
                          <li><strong>SEO:</strong> Optimize your landing page for relevant keywords to attract organic traffic.</li>
                        </ul>
                        <p>
                          Use UTM parameters to track which traffic sources are most effective at generating conversions.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="deploy-4">
                      <AccordionTrigger className="text-base font-medium">
                        <div className="flex items-center gap-3">
                          <BarChart className="h-5 w-5 text-primary-500" />
                          Measuring Performance
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pl-8 text-gray-600 leading-relaxed space-y-4">
                        <p>
                          Track these key metrics to evaluate your landing page's performance:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                          <li><strong>Conversion rate:</strong> The percentage of visitors who complete your desired action.</li>
                          <li><strong>Bounce rate:</strong> The percentage of visitors who leave without interacting with your page.</li>
                          <li><strong>Time on page:</strong> How long visitors spend on your landing page.</li>
                          <li><strong>Traffic sources:</strong> Which channels are bringing visitors to your page.</li>
                          <li><strong>Cost per acquisition (CPA):</strong> How much you're spending to acquire each lead or customer.</li>
                          <li><strong>Form completion rate:</strong> The percentage of visitors who start filling out your form and actually submit it.</li>
                        </ul>
                        <p>
                          Use tools like Google Analytics, Google Tag Manager, and heatmap tools like Hotjar to gain insights into user behavior.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  
                  <div className="pt-4">
                    <Link href="/editor">
                      <Button className="gap-2">
                        <Rocket className="h-4 w-4" />
                        Create and Publish Your Landing Page
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>SEO Checklist</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Optimize your landing page for search engines:</p>
                  
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 border border-gray-300 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="h-3 w-3 text-primary-500" />
                      </div>
                      <span className="text-sm"><strong>Page Title:</strong> Include your main keyword in an engaging title (under 60 characters).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 border border-gray-300 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="h-3 w-3 text-primary-500" />
                      </div>
                      <span className="text-sm"><strong>Meta Description:</strong> Write a compelling description (under 160 characters) with your keyword.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 border border-gray-300 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="h-3 w-3 text-primary-500" />
                      </div>
                      <span className="text-sm"><strong>URL Structure:</strong> Use a clean, keyword-rich URL.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 border border-gray-300 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="h-3 w-3 text-primary-500" />
                      </div>
                      <span className="text-sm"><strong>Header Tags:</strong> Use H1, H2, H3 tags appropriately with keywords.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 border border-gray-300 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="h-3 w-3 text-primary-500" />
                      </div>
                      <span className="text-sm"><strong>Image Alt Text:</strong> Add descriptive alt text to all images.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 border border-gray-300 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="h-3 w-3 text-primary-500" />
                      </div>
                      <span className="text-sm"><strong>Mobile-Friendly:</strong> Ensure your page passes Google's mobile-friendly test.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 border border-gray-300 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="h-3 w-3 text-primary-500" />
                      </div>
                      <span className="text-sm"><strong>Page Speed:</strong> Optimize loading speed for better rankings.</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Analytics Setup Guide</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Essential tracking for your landing page:</p>
                  
                  <ol className="space-y-3 list-decimal pl-5">
                    <li className="text-sm">
                      <strong>Google Analytics:</strong> Install tracking code to monitor traffic, behavior, and conversions.
                    </li>
                    <li className="text-sm">
                      <strong>Conversion Tracking:</strong> Set up goals to measure form submissions and other key actions.
                    </li>
                    <li className="text-sm">
                      <strong>Google Tag Manager:</strong> Implement for easier management of various tracking scripts.
                    </li>
                    <li className="text-sm">
                      <strong>Heatmaps:</strong> Add tools like Hotjar to visualize user interactions.
                    </li>
                    <li className="text-sm">
                      <strong>A/B Testing:</strong> Set up tools like Google Optimize to test different versions.
                    </li>
                  </ol>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
