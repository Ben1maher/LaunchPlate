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
  // Log content to debug what's passed in from the template editor
  console.log("🔍 HeaderComponent content:", component.content);

  const { content = {}, style = {}, type } = component;

  // Safe defaults for debugging
  const logo = content.logo || "LaunchPlate";
  const menuItems = Array.isArray(content.menuItems)
    ? content.menuItems
    : [
        { text: "Home", url: "#" },
        { text: "Features", url: "#" },
        { text: "Pricing", url: "#" },
      ];

  const ctaText = content.ctaText || "Sign Up";
  const ctaUrl = content.ctaUrl || "#";
  const showCta = type === "header-1";

  return (
    <NavBar
      logo={logo}
      items={menuItems}
      ctaButton={
        showCta
          ? {
              text: ctaText,
              url: ctaUrl,
              className: "bg-primary text-white",
            }
          : undefined
      }
      style={style}
    />
  );
}
