import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Clock } from "lucide-react";
import { DietBadge } from "./DietBadge";

interface MenuCardProps {
  id: string;
  name: string;
  description?: string;
  price: number;
  dietTags: string[];
  imageUrl?: string;
  prepTime?: number;
  onAddToCart: (id: string) => void;
}

export const MenuCard = ({
  id,
  name,
  description,
  price,
  dietTags,
  imageUrl,
  prepTime,
  onAddToCart,
}: MenuCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <span className="text-4xl">🍽️</span>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <DietBadge dietTags={dietTags} />
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{name}</h3>
          <span className="font-bold text-primary text-lg">₹{price}</span>
        </div>
        {description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {description}
          </p>
        )}
        <div className="flex items-center justify-between">
          {prepTime && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{prepTime} min</span>
            </div>
          )}
          <Button
            onClick={() => onAddToCart(id)}
            size="sm"
            className="ml-auto"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
