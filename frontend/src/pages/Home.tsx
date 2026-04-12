import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, ShoppingCart, Check, ChevronLeft, ChevronRight, Flame, Sparkles, Star, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { fetchLatestBeats, fetchHotBeats } from "@/api/beats";
import { fetchProducers } from "@/api/producers";
import { usePlayer } from "@/context/PlayerContext";
import { useCart } from "@/context/CartContext";
import { useLikes } from "@/context/LikesContext";
import LicensePickerDialog from "@/components/LicensePickerDialog";
import type { Beat, Producer, PaginatedResponse } from "@/api/types";
import { useNavigate } from "react-router-dom";

// ── Beat card (reused in all beat sections) ──────────────────────────────────
function BeatCard({ beat, onPick }: { beat: Beat; onPick: (b: Beat) => void }) {
  const { play, isPlaying, isActive } = usePlayer();
  const { isInCart } = useCart();
  const { isLiked, toggle: toggleLike } = useLikes();

  const base = beat.licenses?.find((l) => l.code === "base");
  const price = base ? `${base.price} ₽` : "—";

  return (
    <Card className="group relative rounded-none border-2 border-foreground bg-elevate-1 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0px_0px_rgba(255,51,102,0.3)] transition-all cursor-pointer overflow-hidden w-44 shrink-0">
      <div className="aspect-square relative overflow-hidden bg-muted">
        {beat.cover_url && (
          <img src={beat.cover_url} alt={beat.name} className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent z-10" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
          <Button
            size="icon"
            className="rounded-full w-12 h-12 bg-primary border-2 border-foreground scale-90 group-hover:scale-100 transition-transform"
            onClick={(e) => { e.stopPropagation(); play(beat); }}
          >
            {isActive(beat.id) && isPlaying
              ? <Pause className="w-6 h-6 fill-current ml-0.5" />
              : <Play  className="w-6 h-6 fill-current ml-0.5" />
            }
          </Button>
        </div>
        {/* Like button */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleLike(beat.id); }}
          className="absolute top-2 left-2 z-20 w-7 h-7 flex items-center justify-center bg-background/60 hover:bg-primary/90 transition-colors opacity-0 group-hover:opacity-100"
        >
          <Heart className={`w-4 h-4 transition-colors ${isLiked(beat.id) ? "fill-primary text-primary" : "text-foreground"}`} />
        </button>
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
          <h3 className="text-sm font-black text-white uppercase italic tracking-tight truncate">{beat.name}</h3>
          <p className="text-white/70 text-[10px] font-bold uppercase tracking-wider truncate">{beat.user?.name ?? "—"}</p>
        </div>
      </div>
      <div className="p-2.5 flex items-center justify-between bg-white text-black border-t-2 border-foreground">
        <span className="text-sm font-black">{price}</span>
        <Button
          size="sm"
          className="rounded-none font-bold uppercase text-[9px] h-7 px-3"
          onClick={(e) => { e.stopPropagation(); onPick(beat); }}
          disabled={isInCart(beat.id)}
        >
          {isInCart(beat.id) ? <Check className="w-3 h-3" /> : <ShoppingCart className="w-3 h-3" />}
        </Button>
      </div>
    </Card>
  );
}

// ── Horizontal scroll row ────────────────────────────────────────────────────
function ScrollRow({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: -1 | 1) => {
    ref.current?.scrollBy({ left: dir * 600, behavior: "smooth" });
  };

  return (
    <div className="relative group/row">
      <button
        onClick={() => scroll(-1)}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-8 h-8 bg-background border-2 border-foreground flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity hover:bg-primary hover:text-background shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <div ref={ref} className="flex gap-4 overflow-x-auto pb-2 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {children}
      </div>
      <button
        onClick={() => scroll(1)}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-8 h-8 bg-background border-2 border-foreground flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity hover:bg-primary hover:text-background shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// ── Section header ────────────────────────────────────────────────────────────
function SectionHeader({ icon, title, accent }: { icon: React.ReactNode; title: string; accent?: boolean }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className={`w-10 h-10 border-2 border-foreground flex items-center justify-center shrink-0 ${accent ? "bg-primary text-background" : "bg-background"}`}>
        {icon}
      </div>
      <h2 className="text-3xl font-black uppercase italic tracking-tighter">{title}</h2>
      <div className="flex-1 h-0.5 bg-foreground/10 ml-2" />
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
const Home = () => {
  const [pickerBeat, setPickerBeat] = useState<Beat | null>(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const { data: hotBeats = [] } = useQuery<Beat[]>({
    queryKey: ["beats", "hot"],
    queryFn: fetchHotBeats,
  });

  const { data: latestBeats = [] } = useQuery<Beat[]>({
    queryKey: ["beats", "latest"],
    queryFn: fetchLatestBeats,
  });

  const { data: producersData } = useQuery<PaginatedResponse<Producer>>({
    queryKey: ["producers", 1],
    queryFn: () => fetchProducers(1),
  });
  const producers = producersData?.data ?? [];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-32">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-100 h-100 bg-primary rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-5%] w-125 h-125 bg-primary rounded-full blur-[120px] opacity-30" />
      </div>

      <div className="relative z-10 max-w-screen-2xl mx-auto px-8 pt-10 space-y-16">

        {/* ── Hot This Week ── */}
        <section>
          <SectionHeader icon={<Flame className="w-5 h-5" />} title="Hot This Week" accent />
          {hotBeats.length === 0 ? (
            <p className="font-black uppercase italic text-muted-foreground tracking-widest text-sm py-8 border-2 border-dashed border-foreground/20 text-center">
              Пока нет горячих треков
            </p>
          ) : (
            <ScrollRow>
              {hotBeats.map((beat, i) => (
                <motion.div key={beat.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                  <BeatCard beat={beat} onPick={setPickerBeat} />
                </motion.div>
              ))}
            </ScrollRow>
          )}
        </section>

        {/* ── New Releases ── */}
        <section>
          <SectionHeader icon={<Sparkles className="w-5 h-5" />} title="New Releases" />
          {latestBeats.length === 0 ? (
            <p className="font-black uppercase italic text-muted-foreground tracking-widest text-sm py-8 border-2 border-dashed border-foreground/20 text-center">
              Сегодня новинок ещё нет
            </p>
          ) : (
            <ScrollRow>
              {latestBeats.map((beat, i) => (
                <motion.div key={beat.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                  <BeatCard beat={beat} onPick={setPickerBeat} />
                </motion.div>
              ))}
            </ScrollRow>
          )}
        </section>

        {/* ── Featured Producers ── */}
        <section>
          <SectionHeader icon={<Star className="w-5 h-5" />} title="Featured Producers" />
          {producers.length === 0 ? (
            <p className="font-black uppercase italic text-muted-foreground tracking-widest text-sm py-8 border-2 border-dashed border-foreground/20 text-center">
              Продюсеров пока нет
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {producers.slice(0, 6).map((producer, i) => (
                <motion.div
                  key={producer.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => navigate(`/producers/${producer.id}`)}
                  className="group border-2 border-foreground bg-card p-4 flex flex-col items-center gap-3 cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(255,51,102,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                >
                  <div className="w-16 h-16 bg-primary border-2 border-foreground flex items-center justify-center text-3xl font-black italic text-background group-hover:scale-105 transition-transform">
                    {producer.name[0]}
                  </div>
                  <div className="text-center">
                    <p className="font-black uppercase italic tracking-tight text-sm truncate w-full">{producer.name}</p>
                    <p className="text-[9px] font-bold uppercase text-muted-foreground tracking-widest mt-0.5">Продюсер</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

      </div>

      <LicensePickerDialog
        beat={pickerBeat}
        open={!!pickerBeat}
        onOpenChange={(open) => !open && setPickerBeat(null)}
        onSelect={(beat, license) => addToCart(beat, license)}
      />

      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 12s linear infinite; }
      `}</style>
    </div>
  );
};

export default Home;
