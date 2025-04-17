import { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { Template } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Laptop, Rocket, GanttChart, PlusCircle } from "lucide-react";

interface TemplateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TemplateModal({ open, onOpenChange }: TemplateModalProps) {
  // Fetch templates data
  const { data: templates, isLoading: templatesLoading } = useQuery<Template[]>({
    queryKey: ['/api/templates'],
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-2xl">Choose a Template</DialogTitle>
          <DialogDescription>
            Select one of our professionally designed templates to quickly create your landing page.
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-6 pt-2 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
          {templatesLoading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-64 bg-gray-100 rounded-lg animate-pulse"></div>
            ))
          ) : templates && templates.length > 0 ? (
            templates.map((template) => {
              // Generate a preview style based on the template name
              let previewStyle: React.CSSProperties = { 
                position: 'relative', 
                background: '#f9fafb'
              };
              let iconColor = "text-gray-400";
              let tagColor = "bg-gray-100 text-gray-600";
              let tagText = "General";
              let previewIcon = <Laptop className={`h-8 w-8 ${iconColor}`} />;
              
              // Customize preview based on template type
              if (template.name.includes("Business")) {
                previewStyle = { 
                  background: 'linear-gradient(to bottom, #1e3a8a, #3b82f6)',
                  position: 'relative'
                };
                iconColor = "text-white";
                tagColor = "bg-blue-700 text-white";
                tagText = "Business";
                previewIcon = <GanttChart className={`h-8 w-8 ${iconColor}`} />;
              } else if (template.name.includes("Startup")) {
                previewStyle = { 
                  background: 'linear-gradient(to right, #7c3aed, #ec4899)',
                  position: 'relative'
                };
                iconColor = "text-white";
                tagColor = "bg-purple-700 text-white";
                tagText = "Startup";
                previewIcon = <Rocket className={`h-8 w-8 ${iconColor}`} />;
              } else if (template.name.includes("Portfolio")) {
                previewStyle = { 
                  background: '#f3f4f6',
                  position: 'relative',
                  fontFamily: 'Georgia, serif'
                };
                iconColor = "text-gray-700";
                tagColor = "bg-gray-700 text-white";
                tagText = "Portfolio";
                previewIcon = <Laptop className={`h-8 w-8 ${iconColor}`} />;
              }
              
              return (
                <div 
                  key={template.id} 
                  className="flex flex-col rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                  onClick={() => window.location.href = `/editor?template=${template.id}`}
                >
                  <div 
                    className="h-40 flex items-center justify-center" 
                    style={previewStyle}
                  >
                    <span className={`absolute top-2 left-2 px-2 py-0.5 text-xs font-medium rounded ${tagColor}`}>
                      {tagText}
                    </span>
                    
                    <div className="flex flex-col items-center">
                      <div className="h-10 mb-2 flex items-center justify-center">
                        {previewIcon}
                      </div>
                      <div className={`text-center ${template.name.includes("Business") || template.name.includes("Startup") ? "text-white" : "text-gray-700"}`}>
                        <p className="font-bold text-base">{template.name}</p>
                      </div>
                    </div>
                    
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                        Use Template
                      </Button>
                    </div>
                  </div>
                  <div className="p-4 bg-white">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {template.description || 'A customizable template for your landing page.'}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-2 text-center p-8">
              <p className="text-gray-600 mb-4">No templates available. Create one from scratch!</p>
              <Button onClick={() => onOpenChange(false)}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Create from Scratch
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}