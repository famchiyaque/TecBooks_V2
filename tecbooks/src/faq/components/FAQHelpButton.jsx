import React from "react";
import { HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/lib/utils";

/**
 * FAQ Help Button Component
 *
 * @param {string} faqSectionId - The FAQ section ID to navigate to (e.g., "accounts", "financial-dashboard")
 * @param {string} faqItemId - Optional specific FAQ item ID to navigate to
 * @param {string} className - Optional additional CSS classes
 * @param {string} variant - Button variant (default: "ghost")
 * @param {string} size - Button size (default: "icon")
 */
function FAQHelpButton({
  faqSectionId,
  faqItemId = null,
  className,
  variant = "ghost",
  size = "icon",
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    // Navigate to FAQ page with section/item pre-selected
    if (faqItemId) {
      // Navigate to specific FAQ item
      navigate(`/faq?section=${faqSectionId}&item=${faqItemId}`);
    } else {
      // Navigate to FAQ section
      navigate(`/faq?section=${faqSectionId}`);
    }
  };

  return (
    <Button
      onClick={handleClick}
      variant={variant}
      size={size}
      className={cn(
        "text-gray-600 hover:text-blue-600 hover:bg-blue-50",
        className
      )}
      title="Get help with this section"
    >
      <HelpCircle className="h-4 w-4" />
    </Button>
  );
}

export default FAQHelpButton;
