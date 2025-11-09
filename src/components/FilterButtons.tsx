import { Button } from "@/components/ui/button";
import { Leaf, Drumstick } from "lucide-react";

interface FilterButtonsProps {
  filter: "all" | "veg" | "non_veg";
  onFilterChange: (filter: "all" | "veg" | "non_veg") => void;
}

export const FilterButtons = ({ filter, onFilterChange }: FilterButtonsProps) => {
  return (
    <div className="flex gap-2">
      <Button
        variant={filter === "all" ? "default" : "outline"}
        size="sm"
        onClick={() => onFilterChange("all")}
      >
        All Items
      </Button>
      <Button
        variant={filter === "veg" ? "default" : "outline"}
        size="sm"
        onClick={() => onFilterChange("veg")}
        className={filter === "veg" ? "bg-success hover:bg-success/90" : ""}
      >
        <Leaf className="h-4 w-4 mr-1" />
        Veg
      </Button>
      <Button
        variant={filter === "non_veg" ? "default" : "outline"}
        size="sm"
        onClick={() => onFilterChange("non_veg")}
        className={filter === "non_veg" ? "bg-destructive hover:bg-destructive/90" : ""}
      >
        <Drumstick className="h-4 w-4 mr-1" />
        Non-Veg
      </Button>
    </div>
  );
};
