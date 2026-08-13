import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DonateButtonProps {
  variant?: "solid" | "outline";
  size?: "default" | "sm" | "lg";
  className?: string;
  label?: string;
  /** Header buttons collapse to icon-only on mobile by default. Hero/CTA
   * usages sitting next to a labeled button (e.g. "Order Now") should keep
   * the label at every width so the two buttons read as a matched pair. */
  alwaysShowLabel?: boolean;
}

/**
 * Consistent Donate CTA used across the app — header, hero sections,
 * footer, and product/about pages. Always routes to /donate.
 */
const DonateButton = ({
  variant = "outline",
  size = "default",
  className = "",
  label = "Donate",
  alwaysShowLabel = false,
}: DonateButtonProps) => {
  const navigate = useNavigate();

  const solidClasses = "bg-orange-500 hover:bg-orange-600 text-white";
  const outlineClasses = "border-orange-500 text-orange-600 hover:bg-orange-50 bg-white";

  return (
    <Button
      onClick={() => navigate("/donate")}
      variant={variant === "outline" ? "outline" : "default"}
      size={size}
      className={`flex items-center gap-2 hover:scale-105 transition-transform duration-200 ${
        variant === "outline" ? outlineClasses : solidClasses
      } ${className}`}
      data-testid="button-donate"
    >
      <Heart className="h-4 w-4" fill="currentColor" />
      <span className={alwaysShowLabel ? "" : "hidden sm:inline"}>{label}</span>
    </Button>
  );
};

export default DonateButton;
