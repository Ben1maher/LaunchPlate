import { useState, useEffect } from "react";
import { useEditor } from "../../context/EditorContext";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function InteractiveTour() {
  const { tourStep, setTourStep } = useEditor();
  const [isVisible, setIsVisible] = useState(false);

  // Position states for each step
  const [position, setPosition] = useState({
    left: "150px",
    top: "200px",
    arrowPosition: "right"
  });

  useEffect(() => {
    // Only show if a tour step is active
    if (tourStep > 0) {
      setIsVisible(true);
      positionTourPopup(tourStep);
    } else {
      setIsVisible(false);
    }
  }, [tourStep]);

  const positionTourPopup = (step: number) => {
    // Calculate positions based on the step
    // These are approximations - in a real app they would be dynamic based on element positions
    switch (step) {
      case 1: // Component library
        setPosition({
          left: "250px",
          top: "200px",
          arrowPosition: "right"
        });
        break;
      case 2: // Canvas
        setPosition({
          left: "50%",
          top: "300px",
          arrowPosition: "top"
        });
        break;
      case 3: // Properties panel
        setPosition({
          left: "calc(100% - 350px)",
          top: "200px",
          arrowPosition: "left"
        });
        break;
      case 4: // Toolbar
        setPosition({
          left: "50%",
          top: "70px",
          arrowPosition: "bottom"
        });
        break;
      default:
        setPosition({
          left: "150px",
          top: "200px",
          arrowPosition: "right"
        });
    }
  };

  const handleCloseTour = () => {
    setTourStep(0);
  };

  const handleNextStep = () => {
    if (tourStep < 4) {
      setTourStep(tourStep + 1);
    } else {
      handleCloseTour();
    }
  };

  if (!isVisible) {
    return null;
  }

  // Configure content based on the current step
  let tourContent = {
    title: "Select a Component",
    description: "Start by choosing a component from the library on the left. Hero sections are a great first element for any landing page.",
    step: 1,
    totalSteps: 4
  };

  switch (tourStep) {
    case 1:
      tourContent = {
        title: "Select a Component",
        description: "Start by choosing a component from the library on the left. Hero sections are a great first element for any landing page.",
        step: 1,
        totalSteps: 4
      };
      break;
    case 2:
      tourContent = {
        title: "Drop it on the Canvas",
        description: "Drag the component to the canvas and drop it where you want it to appear. You can rearrange components later.",
        step: 2,
        totalSteps: 4
      };
      break;
    case 3:
      tourContent = {
        title: "Customize Properties",
        description: "Select any component to edit its properties in the right panel. Change text, colors, images, and more.",
        step: 3,
        totalSteps: 4
      };
      break;
    case 4:
      tourContent = {
        title: "Save and Preview",
        description: "Use the toolbar buttons to undo/redo changes, preview your page, and save your work when you're done.",
        step: 4,
        totalSteps: 4
      };
      break;
  }

  // Get arrow position class
  const getArrowPositionClass = () => {
    switch (position.arrowPosition) {
      case "right":
        return "right-[-8px] top-[50%] transform-gpu -translate-y-1/2 rotate-45";
      case "left":
        return "left-[-8px] top-[50%] transform-gpu -translate-y-1/2 rotate-45";
      case "top":
        return "top-[-8px] left-[50%] transform-gpu -translate-x-1/2 rotate-45";
      case "bottom":
        return "bottom-[-8px] left-[50%] transform-gpu -translate-x-1/2 rotate-45";
      default:
        return "right-[-8px] top-[50%] transform-gpu -translate-y-1/2 rotate-45";
    }
  };

  return (
    <div className="fixed inset-0 z-50" id="interactiveTour">
      <div className="absolute inset-0 bg-black bg-opacity-30 pointer-events-none"></div>
      
      {/* Tour Popup */}
      <div
        className="absolute z-10 bg-white rounded-lg shadow-xl max-w-xs"
        style={{
          left: position.left,
          top: position.top,
          transform: position.left === "50%" ? "translateX(-50%)" : "none"
        }}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-0.5 rounded">
              Step {tourContent.step} of {tourContent.totalSteps}
            </span>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCloseTour}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <h3 className="font-medium text-gray-800 mb-1">{tourContent.title}</h3>
          <p className="text-gray-600 text-sm mb-3">{tourContent.description}</p>
          <Button 
            variant="default" 
            size="sm" 
            className="w-full"
            onClick={handleNextStep}
          >
            {tourStep < 4 ? "Got it, Next" : "Finish Tour"}
          </Button>
        </div>
        <div className={`absolute w-4 h-4 bg-white ${getArrowPositionClass()}`}></div>
      </div>
    </div>
  );
}
