import { motion } from "framer-motion";
import { ArrowLeft, LayoutGrid, TrendingUp, Star, Flame } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

const GENRES = [
  "Phonk", "Drill", "Trap", "Lo-fi", "Boom Bap",
  "R&B", "Afrobeat", "G-House", "Techno", "Hyperpop",
  "Detroit", "Jersey Club", "Reggaeton", "Synthwave", "Grime"
];

const FEATURED_BEATS = [
  { id: 101, title: "NIGHTCRAWLER", producer: "Vampire", price: "$29.99", tags: ["HOT"] },
  { id: 102, title: "BLOOD MOON", producer: "Xiu", price: "$34.99", tags: ["FEATURED"] },
  { id: 103, title: "STATIC", producer: "Digi", price: "$19.99", tags: ["NEW"] },
  { id: 104, title: "GLITCH", producer: "Vinyl", price: "$49.99", tags: ["TRENDING"] },
];

export default function Explore() {

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground p-8 pb-32 overflow-y-auto">
      <header className="mb-12 flex items-center gap-6">
        <Button onClick={() => navigate("/")} variant='ghost' size="icon" className="rounded-none border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all bg-background">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <div>
          <h1 className="text-6xl font-black uppercase italic tracking-tighter mb-2">Explore</h1>
          <p className="text-muted-foreground font-bold tracking-widest text-xs">FIND YOUR SOUND BY CATEGORY OR CURATION</p>
        </div>
      </header>

      {/* Genres Grid: 3 rows of 5 */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-black uppercase italic tracking-tight">Categories</h2>
          </div>
          <Button onClick={() => navigate("/categories")} variant="link" className="font-black uppercase text-xs hover:text-primary transition-colors">View All Categories</Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {GENRES.map((genre, i) => (
            <motion.div
              key={genre}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card 
                className="group relative h-24 flex items-center justify-center border-2 border-foreground bg-elevate-1 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(255,51,102,1)] hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer overflow-hidden"
                data-testid={`card-genre-${genre}`}
              >
                <span className="text-sm font-black uppercase tracking-widest z-10">{genre}</span>
                <div className="absolute top-0 right-0 w-8 h-8 bg-foreground/10 group-hover:bg-white/20 -rotate-45 translate-x-4 -translate-y-4" />
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Beats Section */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-black uppercase italic tracking-tight">Featured Beats</h2>
          </div>
          <Button variant="link" className="font-black uppercase text-xs">View All</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_BEATS.map((beat, i) => (
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
                  <h3 className="font-black uppercase italic truncate text-sm">{beat.title}</h3>
                  <p className="text-[10px] font-bold text-muted-foreground truncate uppercase">{beat.producer}</p>
                </div>
                <div className="text-right">
                  <span className="block text-xs font-black">{beat.price}</span>
                  <Badge className="text-[8px] h-4 rounded-none bg-primary text-primary-foreground px-1">{beat.tags[0]}</Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Hot Section */}
      <section>
        <div className="flex items-center gap-2 mb-8">
          <Flame className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-black uppercase italic tracking-tight">Hot Right Now</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex items-center gap-4 p-4 border-2 border-foreground bg-elevate-1 relative overflow-hidden group">
               <span className="text-4xl font-black italic opacity-20 group-hover:opacity-100 transition-opacity">0{n}</span>
               <div className="flex-1">
                 <h4 className="font-black uppercase italic tracking-tight">VIBE CHECK</h4>
                 <p className="text-[10px] font-bold text-muted-foreground uppercase">KILLA PROD</p>
               </div>
               <TrendingUp className="w-4 h-4 text-primary" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
