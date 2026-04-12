import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Play, Pause, ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { fetchLikedBeats } from "@/api/likes";
import { usePlayer } from "@/context/PlayerContext";
import { useCart } from "@/context/CartContext";
import { useLikes } from "@/context/LikesContext";
import LicensePickerDialog from "@/components/LicensePickerDialog";
import type { Beat } from "@/api/types";
import { useNavigate } from "react-router-dom";
import { pluralize } from "@/lib/pluralize";

export default function Favorites() {
  const navigate = useNavigate();
  const { play, isPlaying, isActive } = usePlayer();
  const { addToCart, isInCart } = useCart();
  const { isLiked, toggle } = useLikes();
  const [pickerBeat, setPickerBeat] = useState<Beat | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

  const { data: beats = [], isLoading } = useQuery<Beat[]>({
    queryKey: ["liked-beats"],
    queryFn: fetchLikedBeats,
    enabled: !!token,
  });

  const getBasePrice = (beat: Beat) => {
    const base = beat.licenses?.find((l) => l.code === "base");
    return base ? `${base.price} ₽` : "—";
  };

  if (!token) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-background text-foreground">
        <Heart className="w-16 h-16 text-muted-foreground" />
        <p className="font-black uppercase italic text-muted-foreground tracking-widest">
          Войдите, чтобы видеть избранное
        </p>
        <Button onClick={() => navigate("/auth")} className="rounded-none border-2 border-foreground font-black uppercase text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          Войти
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="font-black uppercase tracking-widest text-xs">Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-32">
      <div className="max-w-screen-2xl mx-auto px-6 pt-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-primary border-2 border-foreground flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Heart className="w-6 h-6 fill-background text-background" />
          </div>
          <div>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter">Избранное</h1>
            {beats.length > 0 && (
              <p className="text-xs font-bold uppercase text-muted-foreground tracking-widest mt-0.5">
                {beats.length} {pluralize(beats.length, "бит", "бита", "битов")}
              </p>
            )}
          </div>
        </div>

        {beats.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-foreground/20">
            <Heart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="font-black uppercase italic text-muted-foreground tracking-widest mb-2">
              Пока ничего нет
            </p>
            <p className="text-xs font-bold text-muted-foreground mb-6">
              Нажмите ❤ на любом бите, чтобы сохранить
            </p>
            <Button onClick={() => navigate("/")} className="rounded-none border-2 border-foreground font-black uppercase text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              Смотреть биты
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {beats.map((beat, i) => (
              <motion.div
                key={beat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Card className="group relative rounded-none border-2 border-foreground bg-elevate-1 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0px_0px_rgba(255,51,102,0.3)] transition-all cursor-pointer overflow-hidden">
                  <div className="aspect-square relative overflow-hidden bg-muted">
                    {beat.cover_url && (
                      <img src={beat.cover_url} alt={beat.name} className="absolute inset-0 w-full h-full object-cover" />
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent z-10" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                      <Button
                        size="icon"
                        className="rounded-full w-12 h-12 bg-primary border-2 border-foreground scale-90 group-hover:scale-100 transition-transform"
                        onClick={() => play(beat)}
                      >
                        {isActive(beat.id) && isPlaying
                          ? <Pause className="w-6 h-6 fill-current" />
                          : <Play  className="w-6 h-6 fill-current ml-0.5" />
                        }
                      </Button>
                    </div>
                    {/* Remove from favorites */}
                    <button
                      onClick={(e) => { e.stopPropagation(); toggle(beat.id); }}
                      className="absolute top-2 left-2 z-20 w-7 h-7 flex items-center justify-center bg-background/70 hover:bg-primary/90 transition-colors"
                    >
                      <Heart className={`w-4 h-4 transition-colors ${isLiked(beat.id) ? "fill-primary text-primary" : "text-foreground"}`} />
                    </button>
                    <div className="absolute top-2 right-2 z-20 flex flex-col gap-1">
                      {beat.genre && (
                        <Badge className="rounded-none border border-foreground bg-white text-black font-black uppercase text-[8px]">{beat.genre.name}</Badge>
                      )}
                      {beat.bpm && (
                        <Badge className="rounded-none border border-foreground bg-primary font-black uppercase text-[8px]">{beat.bpm} BPM</Badge>
                      )}
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 z-20">
                      <h3 className="text-sm font-black text-white uppercase italic tracking-tight truncate">{beat.name}</h3>
                      <p className="text-white/70 text-[10px] font-bold uppercase tracking-wider truncate">{beat.user?.name ?? "—"}</p>
                    </div>
                  </div>
                  <div className="p-2.5 flex items-center justify-between bg-white text-black border-t-2 border-foreground">
                    <span className="text-sm font-black">{getBasePrice(beat)}</span>
                    <Button
                      size="sm"
                      className="rounded-none font-bold uppercase text-[9px] h-7 px-3"
                      onClick={(e) => { e.stopPropagation(); setPickerBeat(beat); }}
                      disabled={isInCart(beat.id)}
                    >
                      {isInCart(beat.id) ? <Check className="w-3 h-3" /> : <ShoppingCart className="w-3 h-3" />}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <LicensePickerDialog
        beat={pickerBeat}
        open={!!pickerBeat}
        onOpenChange={(open) => !open && setPickerBeat(null)}
        onSelect={(beat, license) => addToCart(beat, license)}
      />
    </div>
  );
}
