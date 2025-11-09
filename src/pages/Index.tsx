import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ShoppingCart, User, LogOut, Clock, MapPin } from "lucide-react";
import { CategoryTabs } from "@/components/CategoryTabs";
import { FilterButtons } from "@/components/FilterButtons";
import { MenuCard } from "@/components/MenuCard";
import { toast } from "sonner";
import { Session } from "@supabase/supabase-js";
import heroImage from "@/assets/hero-food.jpg";

const CATEGORIES = ["all", "breakfast", "lunch", "dinner", "snacks", "beverages"];

const MOCK_MENU_ITEMS = [
  {
    id: "1",
    name: "Masala Dosa",
    description: "Crispy rice crepe filled with spiced potato masala",
    price: 50,
    category: "breakfast",
    diet_tags: ["veg"],
    prep_time_minutes: 15,
  },
  {
    id: "2",
    name: "Chicken Biryani",
    description: "Aromatic basmati rice with tender chicken pieces",
    price: 120,
    category: "lunch",
    diet_tags: ["non_veg"],
    prep_time_minutes: 25,
  },
  {
    id: "3",
    name: "Idli Sambar",
    description: "Steamed rice cakes served with lentil sambar",
    price: 40,
    category: "breakfast",
    diet_tags: ["veg", "vegan"],
    prep_time_minutes: 10,
  },
  {
    id: "4",
    name: "Veg Thali",
    description: "Complete meal with rice, roti, dal, and vegetables",
    price: 90,
    category: "lunch",
    diet_tags: ["veg"],
    prep_time_minutes: 20,
  },
  {
    id: "5",
    name: "Samosa",
    description: "Crispy fried pastry with spiced potato filling",
    price: 25,
    category: "snacks",
    diet_tags: ["veg"],
    prep_time_minutes: 5,
  },
  {
    id: "6",
    name: "Filter Coffee",
    description: "Traditional South Indian filter coffee",
    price: 20,
    category: "beverages",
    diet_tags: ["veg"],
    prep_time_minutes: 5,
  },
];

export default function Index() {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [dietFilter, setDietFilter] = useState<"all" | "veg" | "non_veg">("all");
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session?.user) {
      fetchCartCount();
    }
  }, [session]);

  const fetchCartCount = async () => {
    const { count } = await supabase
      .from("cart_items")
      .select("*", { count: "exact", head: true });
    setCartCount(count || 0);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  const handleAddToCart = async (itemId: string) => {
    if (!session) {
      toast.error("Please sign in to add items to cart");
      navigate("/auth");
      return;
    }

    const item = MOCK_MENU_ITEMS.find((i) => i.id === itemId);
    if (!item) return;

    const { error } = await supabase
      .from("cart_items")
      .upsert({
        user_id: session.user.id,
        menu_item_id: itemId,
        quantity: 1,
        unit_price: item.price,
      });

    if (error) {
      toast.error("Failed to add item to cart");
      console.error(error);
    } else {
      toast.success(`${item.name} added to cart!`);
      fetchCartCount();
    }
  };

  const filteredItems = MOCK_MENU_ITEMS.filter((item) => {
    const categoryMatch =
      selectedCategory === "all" || item.category === selectedCategory;
    
    let dietMatch = true;
    if (dietFilter === "veg") {
      dietMatch = item.diet_tags.includes("veg") || item.diet_tags.includes("vegan");
    } else if (dietFilter === "non_veg") {
      dietMatch = item.diet_tags.includes("non_veg");
    }

    return categoryMatch && dietMatch;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Madras Mess
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            {session ? (
              <>
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Button>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleSignOut}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <Button onClick={() => navigate("/auth")}>Sign In</Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[400px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-accent/90 mix-blend-multiply" />
        <img
          src={heroImage}
          alt="Delicious food"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            Order Fresh, Delicious Food
          </h2>
          <p className="text-lg md:text-xl mb-6 text-center max-w-2xl">
            From our kitchen to your table - Fast, tasty, and made with love
          </p>
          <div className="flex flex-wrap gap-6 justify-center">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>15-25 min</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span>Campus Canteen</span>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <CategoryTabs
              categories={CATEGORIES}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
            <FilterButtons filter={dietFilter} onFilterChange={setDietFilter} />
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <MenuCard
                key={item.id}
                id={item.id}
                name={item.name}
                description={item.description}
                price={item.price}
                dietTags={item.diet_tags}
                prepTime={item.prep_time_minutes}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                No items found matching your filters
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
