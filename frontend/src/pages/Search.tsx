import { motion } from "framer-motion";
import { Play, Pause, ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { searchBeats } from "@/api/beats";
import { usePlayer } from "@/context/PlayerContext";
import type { Beat, PaginatedResponse } from "@/api/types";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

export default function Search() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const { play, isPlaying, isActive } = usePlayer();
  const { addToCart, isInCart } = useCart();
  const [page, setPage] = useState(1);

  const { data } = useQuery<PaginatedResponse<Beat>>({
    queryKey: ["beats", "search", q, page],
    queryFn: () => searchBeats({ q, page }),
    enabled: !!q,
  });

  const beats = data?.data ?? [];

  const getBasePrice = (beat: Beat) => {
    const base = beat.licenses?.find((l) => l.code === "base");
    return base ? `$${base.price}` : "\u2014";
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8 pb-32">
      <div className="mb-8">
        <h2 className="text-4xl font-black uppercase italic tracking-tighter">
          Results for "{q}"
        </h2>
        {data && (
          <p className="text-muted-foreground font-bold uppercase text-xs tracking-widest mt-2">
            {data.total} {data.total === 1 ? "result" : "results"} found
          </p>
        )}
      </div>

      {beats.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-foreground/20">
          <p className="font-black uppercase italic text-muted-foreground tracking-widest">
            No beats found for "{q}"
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {beats.map((beat, i) => (
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
                      <Badge className="rounded-none border border-foreground bg-white text-black font-black uppercase text-[8px] flex justify-center">
                        {beat.genre.name}
                      </Badge>
                    )}
                    {beat.bpm && (
                      <Badge className="rounded-none border border-foreground bg-primary font-black uppercase text-[8px]">
                        {beat.bpm} BPM
                      </Badge>
                    )}
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 z-20">
                    <h3 className="text-sm font-black text-white uppercase italic tracking-tight truncate">
                      {beat.name}
                    </h3>
                    <p className="text-white/70 text-[10px] font-bold uppercase tracking-wider truncate">
                      {beat.user?.name ?? "Unknown"}
                    </p>
                  </div>
                </div>
                <div className="p-2.5 flex items-center justify-between bg-white text-black border-t-2 border-foreground">
                  <span className="text-sm font-black">{getBasePrice(beat)}</span>
                  <Button
                    size="sm"
                    className="rounded-none font-bold uppercase text-[9px] h-7 px-3"
                    onClick={(e) => { e.stopPropagation(); addToCart(beat); }}
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

      {data && data.last_page > 1 && (
        <div className="flex justify-center gap-4 mt-12">
          <Button
            variant="outline"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-none border-2 border-foreground font-black uppercase text-xs"
          >
            Previous
          </Button>
          <span className="flex items-center font-black uppercase text-xs tracking-widest">
            Page {data.current_page} of {data.last_page}
          </span>
          <Button
            variant="outline"
            disabled={page >= data.last_page}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-none border-2 border-foreground font-black uppercase text-xs"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
