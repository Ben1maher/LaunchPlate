import { ComponentType } from "@shared/schema";

export interface ComponentCategory {
  name: string;
  items: ComponentData[];
}

export interface ComponentData {
  type: ComponentType;
  label: string;
  icon: string;
  description: string;
  preview?: string;
}

export const componentCategories: ComponentCategory[] = [
  {
    name: "Headers",
    items: [
      {
        type: "header-1",
        label: "Header 1",
        icon: "ri-layout-top-line",
        description: "Traditional header with navigation and CTA",
      },
      {
        type: "header-2",
        label: "Header 2",
        icon: "ri-layout-top-2-line",
        description: "Minimal header with just logo and navigation",
      }
    ]
  },
  {
    name: "Hero Sections",
    items: [
      {
        type: "hero-split",
        label: "Split Hero",
        icon: "ri-layout-left-line",
        description: "Hero section with text on one side and image on the other",
      },
      {
        type: "hero-centered",
        label: "Centered Hero",
        icon: "ri-layout-top-fill",
        description: "Hero section with centered text and CTA",
      }
    ]
  },
  {
    name: "Basic Elements",
    items: [
      {
        type: "heading",
        label: "Heading",
        icon: "ri-heading",
        description: "Section or page heading",
      },
      {
        type: "text-block",
        label: "Text",
        icon: "ri-text",
        description: "Paragraph text block",
      },
      {
        type: "button",
        label: "Button",
        icon: "ri-cursor-fill",
        description: "Call to action button",
      },
      {
        type: "image",
        label: "Image",
        icon: "ri-image-line",
        description: "Image with optional caption",
      },
      {
        type: "spacer",
        label: "Spacer",
        icon: "ri-space",
        description: "Adds vertical space between components",
      },
      {
        type: "divider",
        label: "Divider",
        icon: "ri-separator",
        description: "Horizontal divider line",
      }
    ]
  },
  {
    name: "Form Elements",
    items: [
      {
        type: "form",
        label: "Contact Form",
        icon: "ri-file-list-line",
        description: "Contact form with name, email, and message fields",
      },
      {
        type: "email-signup",
        label: "Email Signup",
        icon: "ri-mail-check-line",
        description: "Email newsletter signup form",
      }
    ]
  }
];

export function getComponentData(type: ComponentType): ComponentData | undefined {
  for (const category of componentCategories) {
    const component = category.items.find(item => item.type === type);
    if (component) {
      return component;
    }
  }
  return undefined;
}
