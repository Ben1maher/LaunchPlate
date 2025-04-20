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
      },
      {
        type: "header-transparent",
        label: "Transparent Header",
        icon: "ri-layout-top-fill",
        description: "Transparent header that overlays content",
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
      },
      {
        type: "hero-video",
        label: "Video Hero",
        icon: "ri-movie-line",
        description: "Hero section with background video",
      },
      {
        type: "hero-gradient",
        label: "Gradient Hero",
        icon: "ri-gradient-line",
        description: "Hero with modern gradient background",
      }
    ]
  },
  {
    name: "Text Elements",
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
        type: "list-item",
        label: "List",
        icon: "ri-list-check",
        description: "Bulleted or numbered list",
      },
      {
        type: "blockquote",
        label: "Blockquote",
        icon: "ri-double-quotes-l",
        description: "Highlighted quote or testimonial",
      }
    ]
  },
  {
    name: "Media",
    items: [
      {
        type: "image",
        label: "Image",
        icon: "ri-image-line",
        description: "Single image with optional caption",
      },
      {
        type: "gallery",
        label: "Gallery",
        icon: "ri-gallery-line",
        description: "Grid of multiple images",
      },
      {
        type: "video",
        label: "Video",
        icon: "ri-video-line",
        description: "Embedded video player",
      },
      {
        type: "carousel",
        label: "Carousel",
        icon: "ri-slideshow-line",
        description: "Scrolling slideshow of images",
      }
    ]
  },
  {
    name: "Layout",
    items: [
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
      },
      {
        type: "columns-2",
        label: "2 Columns",
        icon: "ri-layout-column-2-line",
        description: "Two-column layout section",
      },
      {
        type: "columns-3",
        label: "3 Columns",
        icon: "ri-layout-column-3-line",
        description: "Three-column layout section",
      },
      {
        type: "columns-4",
        label: "4 Columns",
        icon: "ri-layout-column-4-line",
        description: "Four-column layout section",
      }
    ]
  },
  {
    name: "Forms & CTAs",
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
      },
      {
        type: "contact-details",
        label: "Contact Details",
        icon: "ri-contacts-line",
        description: "Contact information with icons",
      }
    ]
  },
  {
    name: "Features",
    items: [
      {
        type: "feature-grid",
        label: "Feature Grid",
        icon: "ri-layout-grid-line",
        description: "Grid of features with icons",
      },
      {
        type: "feature-list",
        label: "Feature List",
        icon: "ri-list-check-2",
        description: "List of features with descriptions",
      },
      {
        type: "feature-cards",
        label: "Feature Cards",
        icon: "ri-layout-masonry-line",
        description: "Card-based feature showcase",
      }
    ]
  },
  {
    name: "Testimonials",
    items: [
      {
        type: "testimonial-single",
        label: "Single Testimonial",
        icon: "ri-chat-quote-line",
        description: "Featured quote with author info",
      },
      {
        type: "testimonial-carousel",
        label: "Testimonial Carousel",
        icon: "ri-slideshow-3-line",
        description: "Rotating carousel of testimonials",
      }
    ]
  },
  {
    name: "Marketing",
    items: [
      {
        type: "stats-bar",
        label: "Statistics Bar",
        icon: "ri-bar-chart-box-line",
        description: "Key metrics or statistics bar",
      },
      {
        type: "pricing-cards",
        label: "Pricing Cards",
        icon: "ri-price-tag-3-line",
        description: "Pricing plans comparison",
      }
    ]
  },
  {
    name: "Footers",
    items: [
      {
        type: "footer-simple",
        label: "Simple Footer",
        icon: "ri-layout-bottom-line",
        description: "Simple footer with copyright and links",
      },
      {
        type: "footer-columns",
        label: "Footer with Columns",
        icon: "ri-layout-bottom-2-line",
        description: "Comprehensive footer with multiple columns",
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
