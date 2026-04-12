import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

const tabs = [
  { label: "Биты", path: "/" },
  { label: "Жанры", path: "/explore" },
  { label: "Продюсеры", path: "/producers" },
];

const VISIBLE_ROUTES = ["/", "/explore", "/producers", "/search"];

export function SubNav() {
  const navigate = useNavigate();
  const location = useLocation();

  if (!VISIBLE_ROUTES.includes(location.pathname)) return null;

  return (
    <div className="px-6 py-2 flex items-center justify-center gap-8 border-b border-border bg-background/50 backdrop-blur-xl">
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path;
        return (
          <Button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            variant="ghost"
            className={`font-black uppercase text-xs tracking-widest rounded-none px-4 py-1.5 h-auto hover:bg-primary hover:text-primary-foreground ${
              isActive ? "border-2 border-primary text-primary" : ""
            }`}
          >
            {tab.label}
          </Button>
        );
      })}
    </div>
  );
}
