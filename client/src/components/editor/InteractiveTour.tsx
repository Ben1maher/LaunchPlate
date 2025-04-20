import { useState, useEffect } from "react";
import { useEditor } from "../../context/EditorContext";
import { X, ArrowRight, ArrowLeft, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface TourStep {
  title: string;
  content: string;
  target: string;
  position: "top" | "right" | "bottom" | "left";
}

export default function InteractiveTour() {
  const { tutorialActive, setTutorialActive, tourStep, setTourStep } = useEditor();
  const [targetElement, setTargetElement] = useState<DOMRect | null>(null);
  
  const tourSteps: TourStep[] = [
    {
      title: "Welcome to LaunchPlate!",
      content: "Let's take a quick tour to help you get started building your landing page.",
      target: "#welcomeHeader",
      position: "bottom"
    },
    {
      title: "Component Library",
      content: "Browse and add components from our library. Just drag and drop elements onto your canvas.",
      target: "#componentLibrary",
      position: "right"
    },
    {
      title: "Canvas",
      content: "This is your canvas where you'll build your landing page by adding components.",
      target: "#mainCanvas",
      position: "left"
    },
    {
      title: "Properties Panel",
      content: "Select any component to edit its properties in this panel.",
      target: "#propertiesPanel",
      position: "left"
    },
    {
      title: "Component Categories",
      content: "Components are organized by type. Try adding headers, hero sections, features, and more!",
      target: "#componentCategories",
      position: "right"
    },
    {
      title: "View Modes",
      content: "Preview your page in desktop, tablet, or mobile view to ensure it looks great on all devices.",
      target: "#viewModes",
      position: "bottom"
    },
    {
      title: "Ready to go!",
      content: "That's it! You're ready to start building your landing page. You can access this tour anytime from the help menu.",
      target: "#welcomeHeader",
      position: "bottom"
    }
  ];

  useEffect(() => {
    if (tutorialActive && tourStep < tourSteps.length) {
      const targetId = tourSteps[tourStep].target;
      const element = document.querySelector(targetId);
      if (element) {
        const rect = element.getBoundingClientRect();
        setTargetElement(rect);
        
        // Scroll element into view if needed
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Add highlight effect
        element.classList.add('tour-highlight');
        
        return () => {
          element.classList.remove('tour-highlight');
        };
      }
    }
  }, [tutorialActive, tourStep, tourSteps]);

  const handleNext = () => {
    if (tourStep < tourSteps.length - 1) {
      setTourStep(tourStep + 1);
    } else {
      // End of tour
      setTutorialActive(false);
      setTourStep(0);
    }
  };

  const handlePrevious = () => {
    if (tourStep > 0) {
      setTourStep(tourStep - 1);
    }
  };

  const handleClose = () => {
    setTutorialActive(false);
    setTourStep(0);
  };

  if (!tutorialActive || !targetElement) {
    return null;
  }

  // Calculate tooltip position based on target element position
  const getTooltipPosition = () => {
    const position = tourSteps[tourStep].position;
    const margin = 15; // margin from target element
    
    switch (position) {
      case "top":
        return {
          top: targetElement.top - margin - 180,
          left: targetElement.left + targetElement.width / 2 - 150
        };
      case "right":
        return {
          top: targetElement.top + targetElement.height / 2 - 90,
          left: targetElement.right + margin
        };
      case "bottom":
        return {
          top: targetElement.bottom + margin,
          left: targetElement.left + targetElement.width / 2 - 150
        };
      case "left":
        return {
          top: targetElement.top + targetElement.height / 2 - 90,
          left: targetElement.left - margin - 300
        };
      default:
        return {
          top: targetElement.bottom + margin,
          left: targetElement.left + targetElement.width / 2 - 150
        };
    }
  };

  const tooltipPosition = getTooltipPosition();
  const currentStep = tourSteps[tourStep];
  const isLastStep = tourStep === tourSteps.length - 1;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/30 z-50 pointer-events-none">
        {/* This is the modal overlay, but clicks should pass through */}
        <motion.div
          className="absolute z-[60] bg-background border border-border shadow-lg rounded-lg w-[300px] pointer-events-auto"
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
        >
          <div className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">{currentStep.title}</h3>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{currentStep.content}</p>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground">
                  {tourStep + 1} of {tourSteps.length}
                </span>
              </div>
              <div className="flex gap-2">
                {tourStep > 0 && (
                  <Button variant="outline" size="sm" onClick={handlePrevious}>
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back
                  </Button>
                )}
                <Button size="sm" onClick={handleNext}>
                  {isLastStep ? "Finish" : "Next"}
                  {!isLastStep && <ArrowRight className="h-4 w-4 ml-1" />}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}