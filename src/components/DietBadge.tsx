import { Leaf, Drumstick } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DietBadgeProps {
  dietTags: string[];
  className?: string;
}

export const DietBadge = ({ dietTags, className }: DietBadgeProps) => {
  const isVeg = dietTags.includes("veg") || dietTags.includes("vegan");
  const isNonVeg = dietTags.includes("non_veg");

  if (!isVeg && !isNonVeg) return null;

  return (
    <Badge
      variant={isVeg ? "default" : "destructive"}
      className={`flex items-center gap-1 ${
        isVeg ? "bg-success text-success-foreground" : ""
      } ${className}`}
    >
      {isVeg ? <Leaf className="h-3 w-3" /> : <Drumstick className="h-3 w-3" />}
      {isVeg ? "Veg" : "Non-Veg"}
    </Badge>
  );
};
