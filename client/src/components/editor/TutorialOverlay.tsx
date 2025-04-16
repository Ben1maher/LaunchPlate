import React, { useState } from 'react';
import { useEditor } from '@/context/EditorContext';
import { Button } from '@/components/ui/button';
import { X, Rocket, ArrowRight, Palette, Users, Play, Check } from 'lucide-react';

export default function TutorialOverlay() {
  const { setTutorialActive, setTourStep } = useEditor();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to LaunchPlate",
      description: "Let's get you started with creating your professional landing page in minutes.",
      image: "rocket"
    },
    {
      title: "Adding Components",
      description: "Drag and drop components from the left panel to build your page.",
      image: "drag"
    },
    {
      title: "Customize Everything",
      description: "Change colors, fonts, text and images to match your brand.",
      image: "customize"
    },
    {
      title: "Generate Leads",
      description: "Add forms and call-to-action elements to convert visitors.",
      image: "leads"
    },
    {
      title: "Publish Your Page",
      description: "Preview and publish your landing page with one click.",
      image: "publish"
    }
  ];

  const handleSkipTutorial = () => {
    setTutorialActive(false);
  };

  const handleWatchVideo = () => {
    // In a real app, this would open a video tutorial
    window.open('https://youtube.com', '_blank');
  };

  const handleStartBuilding = () => {
    setTutorialActive(false);
    setTourStep(0); // Start the interactive tour
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 0 && step < steps.length) {
      setCurrentStep(step);
    }
  };

  // Render content based on current step
  const renderContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="bg-primary-50 p-5 rounded-lg border border-primary-100 flex items-start">
            <div className="bg-primary-100 rounded-full p-3 mr-4 flex-shrink-0">
              <Rocket className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h4 className="font-medium text-primary-900 mb-2">Let's Build Your Landing Page</h4>
              <p className="text-primary-800 text-sm">LaunchPlate makes it easy to create professional-looking landing pages in minutes. Follow this quick tutorial to learn the basics.</p>
            </div>
          </div>
        );
      case 1:
        return (
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
              <ArrowRight className="h-10 w-10 text-gray-400" />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-800 mb-3">Customize Your Design:</h4>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center p-3 bg-white rounded border border-gray-200">
                <div className="w-8 h-8 flex items-center justify-center mr-3 text-primary-500">
                  <Palette className="h-5 w-5" />
                </div>
                <p className="text-sm text-gray-600">Change colors, fonts, and styles in the properties panel</p>
              </div>
              <div className="flex items-center p-3 bg-white rounded border border-gray-200">
                <div className="w-8 h-8 flex items-center justify-center mr-3 text-primary-500">
                  <span className="text-xl font-bold">T</span>
                </div>
                <p className="text-sm text-gray-600">Edit text directly on the canvas</p>
              </div>
              <div className="flex items-center p-3 bg-white rounded border border-gray-200">
                <div className="w-8 h-8 flex items-center justify-center mr-3 text-primary-500">
                  <ArrowRight className="h-5 w-5" />
                </div>
                <p className="text-sm text-gray-600">Upload your own images or use our stock photos</p>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-800 mb-3">Lead Generation Tips:</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="mt-0.5 mr-2 text-green-500">
                  <Check className="h-4 w-4" />
                </div>
                <p className="text-sm text-gray-600">Use compelling headlines that address your visitor's pain points</p>
              </li>
              <li className="flex items-start">
                <div className="mt-0.5 mr-2 text-green-500">
                  <Check className="h-4 w-4" />
                </div>
                <p className="text-sm text-gray-600">Add forms with minimal fields to maximize completion rates</p>
              </li>
              <li className="flex items-start">
                <div className="mt-0.5 mr-2 text-green-500">
                  <Check className="h-4 w-4" />
                </div>
                <p className="text-sm text-gray-600">Include clear and compelling call-to-action buttons</p>
              </li>
              <li className="flex items-start">
                <div className="mt-0.5 mr-2 text-green-500">
                  <Check className="h-4 w-4" />
                </div>
                <p className="text-sm text-gray-600">Add social proof elements like testimonials or logos</p>
              </li>
            </ul>
          </div>
        );
      case 4:
        return (
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
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" id="tutorialOverlay">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        <div className="p-5 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Welcome to the Landing Page Generator</h2>
          <Button variant="ghost" size="icon" onClick={handleSkipTutorial}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-auto p-6">
          <div className="flex flex-col h-full">
            {/* Step Icon and Title */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="h-20 w-20 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                {steps[currentStep].image === "rocket" && <Rocket className="h-10 w-10 text-primary-500" />}
                {steps[currentStep].image === "drag" && <ArrowRight className="h-10 w-10 text-primary-500" />}
                {steps[currentStep].image === "customize" && <Palette className="h-10 w-10 text-primary-500" />}
                {steps[currentStep].image === "leads" && <Users className="h-10 w-10 text-primary-500" />}
                {steps[currentStep].image === "publish" && <Rocket className="h-10 w-10 text-primary-500" />}
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                {steps[currentStep].title}
              </h3>
              <p className="text-gray-600 max-w-md">
                {steps[currentStep].description}
              </p>
            </div>
            
            {/* Step Content */}
            <div className="flex-1 mb-6">
              {renderContent()}
            </div>
            
            {/* Step Indicators */}
            <div className="flex justify-center items-center space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full cursor-pointer ${index === currentStep ? 'bg-primary-500' : 'bg-gray-300'}`}
                  onClick={() => goToStep(index)}
                />
              ))}
            </div>
          </div>
        </div>
        
        <div className="p-5 border-t border-gray-200 flex justify-between items-center">
          <Button variant="ghost" onClick={handleSkipTutorial}>
            Skip Tutorial
          </Button>
          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <Button variant="outline" onClick={prevStep}>
                Previous
              </Button>
            )}
            
            {currentStep < steps.length - 1 ? (
              <Button variant="default" onClick={nextStep}>
                Next
              </Button>
            ) : (
              <div className="flex space-x-3">
                <Button variant="outline" className="gap-2" onClick={handleWatchVideo}>
                  <Play className="h-4 w-4" />
                  Watch Video
                </Button>
                <Button variant="default" className="gap-2" onClick={handleStartBuilding}>
                  <Rocket className="h-4 w-4 mr-1" />
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