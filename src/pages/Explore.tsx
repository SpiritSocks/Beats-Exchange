import { motion } from "framer-motion";
import { ArrowLeft, LayoutGrid, Star, Flame } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchGenres } from "@/api/genres";
import { fetchLatestBeats } from "@/api/beats";
import type { Genre, Beat } from "@/api/types";

export default function Explore() {
  const navigate = useNavigate();

  const { data: genres = [] } = useQuery<Genre[]>({
    queryKey: ["genres"],
    queryFn: fetchGenres,
  });

  const { data: latestBeats = [] } = useQuery<Beat[]>({
    queryKey: ["beats", "latest"],
    queryFn: fetchLatestBeats,
  });

  const featuredBeats = latestBeats.slice(0, 4);

  const getBasePrice = (beat: Beat) => {
    const base = beat.licenses?.find((l) => l.code === "base");
    return base ? `$${base.price}` : "—";
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8 pb-32 overflow-y-auto">
      <header className="mb-12 flex items-center gap-6">
        <Button onClick={() => navigate("/")} variant='ghost' size="icon" className="rounded-none border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all bg-background">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <div>
          <h1 className="text-6xl font-black uppercase italic tracking-tighter mb-2">Explore</h1>
        </div>
      </header>

      {/* Genres Grid */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-black uppercase italic tracking-tight">Genres</h2>
          </div>
          <Button onClick={() => navigate("/categories")} variant="link" className="font-black uppercase text-xs hover:text-primary transition-colors">View All Genres</Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {genres.map((genre, i) => (
            <motion.div
              key={genre.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card onClick={() => navigate(`/genre/${genre.id}`)}
                className="group relative h-24 flex items-center justify-center border-2 border-foreground bg-elevate-1 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(255,51,102,1)] hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer overflow-hidden"
                data-testid={`card-genre-${genre.name}`}
              >
                <span className="text-sm font-black uppercase tracking-widest z-10">{genre.name}</span>
                <div className="absolute top-0 right-0 w-8 h-8 bg-foreground/10 group-hover:bg-white/20 -rotate-45 translate-x-4 -translate-y-4" />
              </Card>
            </motion.div>
          ))}
          {genres.length === 0 && (
            <p className="col-span-full text-center text-muted-foreground font-bold uppercase text-xs tracking-widest py-8">No genres found</p>
          )}
        </div>
      </section>

      {/* Featured Beats Section */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-black uppercase italic tracking-tight">Latest Beats</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredBeats.map((beat) => (
            <Card
              key={beat.id}
              className="rounded-none border-2 border-foreground bg-card p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all"
              data-testid={`card-featured-${beat.id}`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary border-2 border-foreground flex items-center justify-center shrink-0">
                  <Play className="w-6 h-6 fill-current" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-black uppercase italic truncate text-sm">{beat.name}</h3>
                  <p className="text-[10px] font-bold text-muted-foreground truncate uppercase">{beat.user?.name ?? "Unknown"}</p>
                </div>
                <div className="text-right">
                  <span className="block text-xs font-black">{getBasePrice(beat)}</span>
                  {beat.genre && (
                    <Badge className="text-[8px] h-4 rounded-none bg-primary text-primary-foreground px-1">{beat.genre.name}</Badge>
                  )}
                </div>
              </div>
            </Card>
          ))}
          {featuredBeats.length === 0 && (
            <p className="col-span-full text-center text-muted-foreground font-bold uppercase text-xs tracking-widest py-8">No beats available yet</p>
          )}
        </div>
      </section>

      {/* Hot Section */}
      <section>
        <div className="flex items-center gap-2 mb-8">
          <Flame className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-black uppercase italic tracking-tight">Hot Right Now</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestBeats.slice(0, 3).map((beat, n) => (
            <div key={beat.id} className="flex items-center gap-4 p-4 border-2 border-foreground bg-elevate-1 relative overflow-hidden group">
               <span className="text-4xl font-black italic opacity-20 group-hover:opacity-100 transition-opacity">0{n + 1}</span>
               <div className="flex-1">
                 <h4 className="font-black uppercase italic tracking-tight">{beat.name}</h4>
                 <p className="text-[10px] font-bold text-muted-foreground uppercase">{beat.user?.name ?? "Unknown"}</p>
               </div>
            </div>
          ))}
          {latestBeats.length === 0 && (
            <p className="col-span-full text-center text-muted-foreground font-bold uppercase text-xs tracking-widest py-8">No beats yet</p>
          )}
        </div>
      </section>
    </div>
  );
}
