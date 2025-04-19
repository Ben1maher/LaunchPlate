import React, { useState, useEffect, useRef } from 'react';
import { HexColorPicker, HexColorInput } from 'react-colorful';
import { Input } from './input';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  className?: string;
  presetColors?: string[];
}

export function ColorPicker({ 
  color, 
  onChange, 
  className = "", 
  presetColors = ['#FFFFFF', '#000000', '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#795548', '#607D8B'] 
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentColor, setCurrentColor] = useState(color || '#FFFFFF');
  const [isValidColor, setIsValidColor] = useState(true);
  
  // Update the current color when the parent component changes the color prop
  useEffect(() => {
    if (color !== currentColor) {
      setCurrentColor(color || '#FFFFFF');
    }
  }, [color]);

  // Handle color change from the picker
  const handleColorChange = (newColor: string) => {
    setCurrentColor(newColor);
    onChange(newColor);
  };

  // Validate and handle color change from the input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCurrentColor(value);
    
    // Check if it's a valid hex color before updating parent
    const isHex = /^#([A-Fa-f0-9]{3,4}){1,2}$/.test(value);
    setIsValidColor(isHex);
    
    if (isHex) {
      onChange(value);
    }
  };

  // Handle clicking a preset color
  const handlePresetClick = (presetColor: string) => {
    setCurrentColor(presetColor);
    onChange(presetColor);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="flex w-full h-9">
            <div 
              className="w-10 h-full bg-gray-50 border border-gray-300 rounded-l flex items-center justify-center cursor-pointer"
              style={{ borderRight: 'none' }}
            >
              <div 
                className="w-6 h-6 rounded-full border border-gray-300"
                style={{ backgroundColor: currentColor }}
              ></div>
            </div>
            <Input
              value={currentColor}
              onChange={handleInputChange}
              className={`rounded-l-none flex-1 ${!isValidColor ? 'border-red-500' : ''}`}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3" align="start">
          <HexColorPicker color={currentColor} onChange={handleColorChange} className="w-full" />
          <div className="mt-3">
            <HexColorInput 
              color={currentColor}
              onChange={handleColorChange}
              prefixed
              className="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>
          
          {presetColors.length > 0 && (
            <div className="mt-3">
              <div className="text-xs text-gray-500 mb-1">Preset Colors</div>
              <div className="grid grid-cols-10 gap-1">
                {presetColors.map((presetColor, index) => (
                  <div
                    key={index}
                    className="w-4 h-4 rounded-sm cursor-pointer border border-gray-300 hover:scale-110 transition-transform"
                    style={{ backgroundColor: presetColor }}
                    onClick={() => handlePresetClick(presetColor)}
                    title={presetColor}
                  ></div>
                ))}
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}