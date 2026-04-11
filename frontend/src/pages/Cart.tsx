import { motion } from "framer-motion";
import { Trash2, ShoppingCart, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";
import { usePlayer } from "@/context/PlayerContext";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const { items, removeFromCart, clearCart, totalPrice } = useCart();
  const { play, isPlaying, isActive } = usePlayer();
  const navigate = useNavigate();

  const getPrice = (item: (typeof items)[0]) => {
    const license = item.beat.licenses?.find((l) => l.code === item.licenseCode);
    return license ? `$${license.price}` : "—";
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8 pb-32">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl font-black uppercase italic tracking-tighter flex items-center gap-3">
            <ShoppingCart className="w-8 h-8" />
            Cart
          </h2>
          {items.length > 0 && (
            <Button
              variant="outline"
              onClick={clearCart}
              className="rounded-none border-2 border-foreground font-black uppercase text-xs"
            >
              Clear All
            </Button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-foreground/20">
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="font-black uppercase italic text-muted-foreground tracking-widest mb-6">
              Your cart is empty
            </p>
            <Button
              onClick={() => navigate("/")}
              className="rounded-none border-2 border-foreground font-black uppercase text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              Browse Beats
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {items.map((item, i) => (
                <motion.div
                  key={item.beat.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="rounded-none border-2 border-foreground p-4 flex items-center gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(255,51,102,1)] transition-all">
                    <Button
                      size="icon"
                      className="w-12 h-12 bg-primary shrink-0 border-2 border-foreground rounded-none"
                      onClick={() => play(item.beat)}
                    >
                      {isActive(item.beat.id) && isPlaying ? (
                        <Pause className="w-6 h-6 fill-background" />
                      ) : (
                        <Play className="w-6 h-6 fill-background" />
                      )}
                    </Button>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-black uppercase italic tracking-tight truncate">
                        {item.beat.name}
                      </h3>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest truncate">
                        {item.beat.user?.name ?? "Unknown"}
                        {item.beat.genre ? ` • ${item.beat.genre.name}` : ""}
                        {item.beat.bpm ? ` • ${item.beat.bpm} BPM` : ""}
                      </p>
                    </div>

                    <Badge className="rounded-none border border-foreground bg-elevate-1 font-black uppercase text-[9px] shrink-0">
                      {item.licenseCode}
                    </Badge>

                    <span className="font-black text-lg shrink-0">{getPrice(item)}</span>

                    <Button
                      size="icon"
                      variant="ghost"
                      className="shrink-0 hover:text-red-500 hover:bg-red-500/10"
                      onClick={() => removeFromCart(item.beat.id)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>

            <Card className="rounded-none border-2 border-foreground p-6 mt-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    {items.length} {items.length === 1 ? "item" : "items"}
                  </p>
                  <p className="text-3xl font-black">${totalPrice.toFixed(2)}</p>
                </div>
                <Button className="rounded-none border-2 border-foreground font-black uppercase text-sm h-12 px-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all">
                  Checkout
                </Button>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
