import NavBar from "@/components/shared/NavBar";

interface Component {
  id: string;
  type: string;
  content: Record<string, any>;
  style: Record<string, any>;
}

interface HeaderComponentProps {
  component: Component;
}

export default function HeaderComponent({ component }: HeaderComponentProps) {
  const { type, content, style } = component;

  const logo = content.logo || "Your Logo";
  const menuItems = content.menuItems || [];

  const ctaButton =
    type === "header-1" && content.ctaText
      ? {
          text: content.ctaText,
          url: content.ctaUrl || "#",
          className: "bg-primary text-white",
          style: {
            backgroundColor: style?.buttonColor,
            color: style?.buttonTextColor,
          },
        }
      : undefined;

  return (
    <NavBar
      logo={logo}
      items={menuItems}
      ctaButton={ctaButton}
      style={{
        backgroundColor: style?.backgroundColor || "#ffffff",
        borderBottom: style?.borderBottom || "1px solid #e5e7eb",
        fontFamily: style?.fontFamily,
        color: style?.color || "#000000",
      }}
    />
  );
}
