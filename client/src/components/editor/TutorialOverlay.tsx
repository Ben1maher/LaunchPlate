import { useState } from "react";
import { useEditor } from "../../context/EditorContext";
import { Button } from "@/components/ui/button";
import { X, Play, Rocket, ArrowLeft, ArrowRight, Check, Image, Palette, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TutorialOverlay() {
  const { setTutorialActive, setTourStep } = useEditor();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to the Landing Page Generator",
      description: "Our step-by-step guide will help you build, customize, and publish your landing page with ease.",
      image: "rocket",
    },
    {
      title: "Drag & Drop Components",
      description: "Choose from our library of pre-designed components and drag them onto your page canvas.",
      image: "drag",
    },
    {
      title: "Customize Your Design",
      description: "Personalize colors, fonts, images, and content to match your brand identity.",
      image: "customize",
    },
    {
      title: "Optimize for Lead Generation",
      description: "Add forms, CTAs, and other lead-capturing elements to maximize conversions.",
      image: "leads",
    },
    {
      title: "Publish & Share",
      description: "Deploy your landing page with one click and start driving traffic to it.",
      image: "publish",
    },
  ];

  const handleSkipTutorial = () => {
    setTutorialActive(false);
  };

  const handleStartBuilding = () => {
    setTutorialActive(false);
    setTourStep(1);
  };

  const handleWatchVideo = () => {
    // In a real app, this would open a video tutorial
    window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
  };

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleStartBuilding();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Slide animation variants for swiping across
  const slideVariants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0
      };
    },
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => {
      return {
        x: direction < 0 ? 1000 : -1000,
        opacity: 0
      };
    }
  };

  // For animating the step indicators
  const indicatorVariants = {
    inactive: { scale: 1, backgroundColor: "#e5e7eb" },
    active: { scale: 1.1, backgroundColor: "#6366f1" }
  };

  // Animation settings
  const swipeTransition = {
    x: { type: "spring", stiffness: 300, damping: 30 },
    opacity: { duration: 0.3 }
  };

  // Track the swipe direction (1 for right, -1 for left)
  const [[page, direction], setPage] = useState([0, 0]);

  // Update both the page and currentStep
  const paginate = (newDirection: number) => {
    const newPage = page + newDirection;
    if (newPage >= 0 && newPage < steps.length) {
      setPage([newPage, newDirection]);
      setCurrentStep(newPage);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" id="tutorialOverlay">
      <motion.div 
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="p-5 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Welcome to the Landing Page Generator</h2>
          <Button variant="ghost" size="icon" onClick={handleSkipTutorial}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={page}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={swipeTransition}
              className="absolute inset-0 p-6"
            >
              <div className="flex flex-col h-full">
                {/* Step Icon and Title */}
                <div className="flex flex-col items-center text-center mb-6">
                  <motion.div 
                    className="h-20 w-20 bg-primary-100 rounded-full flex items-center justify-center mb-4"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {steps[page].image === "rocket" && <Rocket className="h-10 w-10 text-primary-500" />}
                    {steps[page].image === "drag" && <ArrowRight className="h-10 w-10 text-primary-500" />}
                    {steps[page].image === "customize" && <Palette className="h-10 w-10 text-primary-500" />}
                    {steps[page].image === "leads" && <Users className="h-10 w-10 text-primary-500" />}
                    {steps[page].image === "publish" && <Rocket className="h-10 w-10 text-primary-500" />}
                  </motion.div>
                  <motion.h3 
                    className="text-2xl font-semibold text-gray-800 mb-2"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {steps[page].title}
                  </motion.h3>
                  <motion.p 
                    className="text-gray-600 max-w-md"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {steps[page].description}
                  </motion.p>
                </div>
                
                {/* Step Content - Customized for each step */}
                <motion.div 
                  className="flex-1 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {page === 0 && (
                    <div className="bg-primary-50 p-5 rounded-lg border border-primary-100 flex items-start">
                      <div className="bg-primary-100 rounded-full p-3 mr-4 flex-shrink-0">
                        <Rocket className="h-6 w-6 text-primary-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-primary-900 mb-2">Let's Build Your Landing Page</h4>
                        <p className="text-primary-800 text-sm">LaunchPlate makes it easy to create professional-looking landing pages in minutes. Follow this quick tutorial to learn the basics.</p>
                      </div>
                    </div>
                  )}
                  
                  {page === 1 && (
                    <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                      <h4 className="font-medium text-gray-800 mb-3">How to Add Components:</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center bg-white p-3 rounded border border-gray-200">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 text-blue-600 font-bold">1</div>
                          <p className="text-sm text-gray-600">Locate a component in the left sidebar library</p>
                        </div>
                        <div className="flex items-center bg-white p-3 rounded border border-gray-200">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 text-blue-600 font-bold">2</div>
                          <p className="text-sm text-gray-600">Drag and drop it to your desired position</p>
                        </div>
                      </div>
                      <div className="mt-4 p-3 bg-gray-100 rounded-md flex items-center justify-center h-32">
                        <i className="ri-drag-drop-line text-5xl text-gray-400"></i>
                      </div>
                    </div>
                  )}
                  
                  {page === 2 && (
                    <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                      <h4 className="font-medium text-gray-800 mb-3">Customize Your Design:</h4>
                      <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center p-3 bg-white rounded border border-gray-200">
                          <div className="w-8 h-8 flex items-center justify-center mr-3 text-primary-500">
                            <i className="ri-palette-line text-xl"></i>
                          </div>
                          <p className="text-sm text-gray-600">Change colors, fonts, and styles in the properties panel</p>
                        </div>
                        <div className="flex items-center p-3 bg-white rounded border border-gray-200">
                          <div className="w-8 h-8 flex items-center justify-center mr-3 text-primary-500">
                            <i className="ri-text"></i>
                          </div>
                          <p className="text-sm text-gray-600">Edit text directly on the canvas</p>
                        </div>
                        <div className="flex items-center p-3 bg-white rounded border border-gray-200">
                          <div className="w-8 h-8 flex items-center justify-center mr-3 text-primary-500">
                            <i className="ri-image-2-line text-xl"></i>
                          </div>
                          <p className="text-sm text-gray-600">Upload your own images or use our stock photos</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {page === 3 && (
                    <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                      <h4 className="font-medium text-gray-800 mb-3">Lead Generation Tips:</h4>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <div className="mt-0.5 mr-2 text-green-500">
                            <i className="ri-check-line text-lg"></i>
                          </div>
                          <p className="text-sm text-gray-600">Use compelling headlines that address your visitor's pain points</p>
                        </li>
                        <li className="flex items-start">
                          <div className="mt-0.5 mr-2 text-green-500">
                            <i className="ri-check-line text-lg"></i>
                          </div>
                          <p className="text-sm text-gray-600">Add forms with minimal fields to maximize completion rates</p>
                        </li>
                        <li className="flex items-start">
                          <div className="mt-0.5 mr-2 text-green-500">
                            <i className="ri-check-line text-lg"></i>
                          </div>
                          <p className="text-sm text-gray-600">Include clear and compelling call-to-action buttons</p>
                        </li>
                        <li className="flex items-start">
                          <div className="mt-0.5 mr-2 text-green-500">
                            <i className="ri-check-line text-lg"></i>
                          </div>
                          <p className="text-sm text-gray-600">Add social proof elements like testimonials or logos</p>
                        </li>
                      </ul>
                    </div>
                  )}
                  
                  {page === 4 && (
                    <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                      <h4 className="font-medium text-gray-800 mb-3">Ready to Launch:</h4>
                      <p className="text-sm text-gray-600 mb-4">Once you've built your perfect landing page, it's time to publish!</p>
                      <div className="bg-white p-4 rounded border border-gray-200">
                        <h5 className="font-medium text-gray-700 mb-2">Simple Publishing Process:</h5>
                        <ol className="space-y-2">
                          <li className="flex items-center">
                            <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center mr-2 text-primary-600 text-xs font-bold">1</div>
                            <p className="text-sm text-gray-600">Preview your page to check everything looks perfect</p>
                          </li>
                          <li className="flex items-center">
                            <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center mr-2 text-primary-600 text-xs font-bold">2</div>
                            <p className="text-sm text-gray-600">Click the "Publish" button in the top toolbar</p>
                          </li>
                          <li className="flex items-center">
                            <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center mr-2 text-primary-600 text-xs font-bold">3</div>
                            <p className="text-sm text-gray-600">Share your new landing page with the world!</p>
                          </li>
                        </ol>
                      </div>
                    </div>
                  )}
                </motion.div>
                
                {/* Step Indicators */}
                <div className="flex justify-center items-center space-x-2">
                  {steps.map((_, index) => (
                    <motion.div
                      key={index}
                      className={`w-3 h-3 rounded-full cursor-pointer ${index === page ? 'bg-primary-500' : 'bg-gray-300'}`}
                      variants={indicatorVariants}
                      animate={index === page ? "active" : "inactive"}
                      onClick={() => {
                        const dir = index > page ? 1 : -1;
                        setPage([index, dir]);
                        setCurrentStep(index);
                      }}
                      whileHover={{ scale: 1.2 }}
                      transition={{ duration: 0.2 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        
        <div className="p-5 border-t border-gray-200 flex justify-between items-center">
          <Button variant="ghost" onClick={handleSkipTutorial}>
            Skip Tutorial
          </Button>
          <div className="flex items-center gap-2">
            {page > 0 && (
              <Button variant="outline" onClick={() => paginate(-1)}>
                Previous
              </Button>
            )}
            
            {page < steps.length - 1 ? (
              <Button variant="default" onClick={() => paginate(1)}>
                Next
              </Button>
            ) : (
              <div className="flex space-x-3">
                <Button variant="outline" className="gap-2" onClick={handleWatchVideo}>
                  <Play className="h-4 w-4" />
                  Watch Video
                </Button>
                <Button variant="default" className="gap-2" onClick={handleStartBuilding}>
                  <i className="ri-rocket-line mr-1"></i>
                  Start Building
                </Button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
