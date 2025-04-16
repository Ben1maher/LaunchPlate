import { useState } from "react";
import { useEditor } from "../../context/EditorContext";
import { Button } from "@/components/ui/button";
import { X, Play, Rocket } from "lucide-react";

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" id="tutorialOverlay">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col animate-in slide-in-right">
        <div className="p-5 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Welcome to the Landing Page Generator</h2>
          <Button variant="ghost" size="icon" onClick={handleSkipTutorial}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="overflow-y-auto flex-1 p-6">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="h-20 w-20 bg-primary-100 rounded-full flex items-center justify-center mb-4">
              {steps[currentStep].image === "rocket" && <Rocket className="h-10 w-10 text-primary-500" />}
              {steps[currentStep].image === "drag" && <i className="ri-drag-drop-line text-4xl text-primary-500"></i>}
              {steps[currentStep].image === "customize" && <i className="ri-palette-line text-4xl text-primary-500"></i>}
              {steps[currentStep].image === "leads" && <i className="ri-user-follow-line text-4xl text-primary-500"></i>}
              {steps[currentStep].image === "publish" && <i className="ri-rocket-line text-4xl text-primary-500"></i>}
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">{steps[currentStep].title}</h3>
            <p className="text-gray-600 max-w-md">{steps[currentStep].description}</p>
          </div>
          
          {/* Steps */}
          <div className="space-y-6 mb-8">
            {/* Step 1 */}
            <div className={`bg-gray-50 p-4 rounded-lg border ${currentStep === 0 ? 'border-primary-300' : 'border-gray-200'}`}>
              <div className="flex">
                <div className={`w-8 h-8 ${currentStep >= 0 ? 'bg-primary-500 text-white' : 'bg-gray-300 text-gray-600'} rounded-full flex items-center justify-center mr-3 flex-shrink-0`}>
                  1
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">Drag & Drop Components</h4>
                  <p className="text-gray-600 text-sm mb-2">Choose from our library of pre-designed components and drag them onto your page canvas.</p>
                  <div className="bg-gray-200 h-32 rounded-md flex items-center justify-center">
                    <i className="ri-drag-drop-line text-4xl text-gray-400"></i>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className={`bg-gray-50 p-4 rounded-lg border ${currentStep === 1 ? 'border-primary-300' : 'border-gray-200'}`}>
              <div className="flex">
                <div className={`w-8 h-8 ${currentStep >= 1 ? 'bg-primary-500 text-white' : 'bg-gray-300 text-gray-600'} rounded-full flex items-center justify-center mr-3 flex-shrink-0`}>
                  2
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">Customize Your Design</h4>
                  <p className="text-gray-600 text-sm">Personalize colors, fonts, images, and content to match your brand identity.</p>
                </div>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className={`bg-gray-50 p-4 rounded-lg border ${currentStep === 2 ? 'border-primary-300' : 'border-gray-200'}`}>
              <div className="flex">
                <div className={`w-8 h-8 ${currentStep >= 2 ? 'bg-primary-500 text-white' : 'bg-gray-300 text-gray-600'} rounded-full flex items-center justify-center mr-3 flex-shrink-0`}>
                  3
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">Optimize for Lead Generation</h4>
                  <p className="text-gray-600 text-sm">Add forms, CTAs, and other lead-capturing elements to maximize conversions.</p>
                </div>
              </div>
            </div>
            
            {/* Step 4 */}
            <div className={`bg-gray-50 p-4 rounded-lg border ${currentStep === 3 ? 'border-primary-300' : 'border-gray-200'}`}>
              <div className="flex">
                <div className={`w-8 h-8 ${currentStep >= 3 ? 'bg-primary-500 text-white' : 'bg-gray-300 text-gray-600'} rounded-full flex items-center justify-center mr-3 flex-shrink-0`}>
                  4
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">Publish & Share</h4>
                  <p className="text-gray-600 text-sm">Deploy your landing page with one click and start driving traffic to it.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-primary-50 p-4 rounded-lg border border-primary-100">
            <h4 className="font-medium text-primary-800 mb-2 flex items-center">
              <i className="ri-lightbulb-line text-primary-500 mr-2"></i>
              Pro Tip
            </h4>
            <p className="text-primary-700 text-sm">Start with a template to save time! Our pre-designed templates are optimized for conversions and can be fully customized to match your needs.</p>
          </div>
        </div>
        
        <div className="p-5 border-t border-gray-200 flex justify-between items-center">
          <Button variant="ghost" onClick={handleSkipTutorial}>
            Skip Tutorial
          </Button>
          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <Button variant="outline" onClick={handlePrevStep}>
                Previous
              </Button>
            )}
            
            {currentStep < steps.length - 1 ? (
              <Button variant="default" onClick={handleNextStep}>
                Next
              </Button>
            ) : (
              <div className="flex space-x-3">
                <Button variant="outline" className="gap-2" onClick={handleWatchVideo}>
                  <Play className="h-4 w-4" />
                  Watch Video Tutorial
                </Button>
                <Button variant="default" className="gap-2" onClick={handleStartBuilding}>
                  <i className="ri-rocket-line mr-1"></i>
                  Start Building
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
