import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { fetchLatestBeats } from "@/api/beats";
import { usePlayer } from "@/context/PlayerContext";
import { useCart } from "@/context/CartContext";
import LicensePickerDialog from "@/components/LicensePickerDialog";
import type { Beat } from "@/api/types";

const Home = () => {
  const { play, isPlaying, isActive } = usePlayer();
  const { addToCart, isInCart } = useCart();

  const [pickerBeat, setPickerBeat] = useState<Beat | null>(null);

  const { data: latestBeats = [] } = useQuery<Beat[]>({
    queryKey: ["beats", "latest"],
    queryFn: fetchLatestBeats,
  });

  const getBasePrice = (beat: Beat) => {
    const base = beat.licenses?.find((l) => l.code === "base");
    return base ? `${base.price} ₽` : "—";
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground font-sans overflow-hidden">
      <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-100 h-100 bg-primary rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-5%] w-125 h-125 bg-primary rounded-full blur-[120px] opacity-30" />
        <div className="absolute top-1/4 left-1/2 w-75 h-75 border-40 border-primary rounded-full opacity-10 animate-spin-slow" />
      </div>

      <div className="relative z-10 flex flex-col pb-24">
        <main className="flex-1 overflow-hidden flex gap-0">
          <section className="flex-1 p-8 overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-4xl font-black uppercase italic tracking-tighter">Новинки</h2>
            </div>

            {latestBeats.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed border-foreground/20">
                <p className="font-black uppercase italic text-muted-foreground tracking-widest">Битов пока нет</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                {latestBeats.map((beat, i) => (
                  <motion.div
                    key={beat.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card className="group relative rounded-none border-2 border-foreground bg-elevate-1 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0px_0px_rgba(255,51,102,0.3)] transition-all cursor-pointer overflow-hidden">
                      <div className="aspect-square relative overflow-hidden bg-muted">
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent z-10" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                          <Button
                            size="icon"
                            className="rounded-full w-12 h-12 bg-primary border-2 border-foreground scale-90 group-hover:scale-100 transition-transform"
                            onClick={() => play(beat)}
                          >
                            {isActive(beat.id) && isPlaying ? (
                              <Pause className="w-6 h-6 fill-current ml-0.5" />
                            ) : (
                              <Play className="w-6 h-6 fill-current ml-0.5" />
                            )}
                          </Button>
                        </div>
                        <div className="absolute top-2 right-2 z-20 flex flex-col gap-1">
                          {beat.genre && (
                            <Badge className="rounded-none border border-foreground bg-white text-black font-black uppercase text-[8px] flex justify-center">{beat.genre.name}</Badge>
                          )}
                          {beat.bpm && (
                            <Badge className="rounded-none border border-foreground bg-primary font-black uppercase text-[8px]">{beat.bpm} BPM</Badge>
                          )}
                        </div>
                        <div className="absolute bottom-2 left-2 right-2 z-20">
                          <h3 className="text-sm font-black text-white uppercase italic tracking-tight truncate">{beat.name}</h3>
                          <p className="text-white/70 text-[10px] font-bold uppercase tracking-wider truncate">{beat.user?.name ?? "Unknown"}</p>
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
          </section>
        </main>
      </div>

      <LicensePickerDialog
        beat={pickerBeat}
        open={!!pickerBeat}
        onOpenChange={(open) => !open && setPickerBeat(null)}
        onSelect={(beat, license) => addToCart(beat, license)}
      />

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default Home;
