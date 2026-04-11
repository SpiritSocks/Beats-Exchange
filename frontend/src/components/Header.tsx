import { Search, User, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useNavigate, useLocation } from "react-router-dom";
import { logout as apiLogout } from "@/api/auth";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

const HIDDEN_ROUTES = ["/auth", "/profile", "/settings"];

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const { items } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(
    typeof window !== "undefined" && !!localStorage.getItem("authToken"),
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  const handleAuthButtonClick = async () => {
    if (!isLoggedIn) {
      navigate("/auth");
      return;
    }

    try { await apiLogout(); } catch {}

    localStorage.removeItem("authToken");
    queryClient.clear();
    setIsLoggedIn(false);
    navigate("/");
  };

  const isHidden = HIDDEN_ROUTES.includes(location.pathname) ||
    location.pathname.startsWith("/genre/") ||
    location.pathname.startsWith("/producers/");

  if (isHidden) return null;

  return (
    <header className="border-b border-border bg-background/50 backdrop-blur-xl">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-xl font-black italic text-background">B</span>
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tighter italic">Beat Exchange</h1>
        </div>

        <form onSubmit={handleSearch} className="flex-1 max-w-lg mx-8">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Try searching trap or sad or juice wr..."
              className="pl-10 bg-elevate-1 border-2 border-transparent focus:border-primary focus:ring-0 rounded-none transition-all uppercase text-xs font-bold"
            />
          </div>
        </form>

        <nav className="flex items-center gap-6">
          <ThemeToggle />
          <div className="relative cursor-pointer" onClick={() => navigate("/cart")}>
            <ShoppingCart className="w-6 h-6 hover:text-primary transition-colors" />
            {items.length > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-background text-[10px] font-black flex items-center justify-center border border-foreground">
                {items.length}
              </span>
            )}
          </div>
          {isLoggedIn && <User onClick={() => navigate("/profile")} className="w-6 h-6 hover:text-primary cursor-pointer" />}
          <Button
            onClick={handleAuthButtonClick}
            className="font-bold uppercase text-xs tracking-widest px-6 rounded-none border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all hover:bg-primary hover:text-primary-foreground hover:border-background"
          >
            {isLoggedIn ? "Log out" : "Sign in"}
          </Button>
        </nav>
      </div>
    </header>
  );
}
