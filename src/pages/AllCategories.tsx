import { motion } from "framer-motion";
import { ArrowLeft, LayoutGrid, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

const ALL_GENRES = [
  { name: "Phonk", subgenres: ["Drift", "Brazilian", "Aggressive"] },
  { name: "Drill", subgenres: ["UK Drill", "NY Drill", "Sample Drill"] },
  { name: "Trap", subgenres: ["Dark Trap", "Melodic Trap", "Hard Trap"] },
  { name: "Lo-fi", subgenres: ["Chillhop", "Jazzhop", "Ambient"] },
  { name: "Boom Bap", subgenres: ["Classic", "Jazz Rap", "East Coast"] },
  { name: "R&B", subgenres: ["Contemporary", "Soul", "Neo-Soul"] },
  { name: "Afrobeat", subgenres: ["Dancehall", "Amapiano", "Highlife"] },
  { name: "G-House", subgenres: ["Bass House", "Deep House", "Slap House"] },
  { name: "Techno", subgenres: ["Hard Techno", "Minimal", "Acid"] },
  { name: "Hyperpop", subgenres: ["Glitchcore", "Bubblegum", "Experimental"] },
  { name: "Detroit", subgenres: ["Scam Rap", "Fast Flow", "Dark"] },
  { name: "Jersey Club", subgenres: ["Hard Dance", "Pop Edit", "Club"] },
  { name: "Reggaeton", subgenres: ["Perreo", "Moombahton", "Pop"] },
  { name: "Synthwave", subgenres: ["Darksynth", "Retrowave", "Outrun"] },
  { name: "Grime", subgenres: ["Old School", "New Wave", "Skepta-style"] },
  { name: "Emo Rap", subgenres: ["Soundcloud", "Melodic", "Sad"] },
  { name: "Cloud Rap", subgenres: ["Ethereal", "Vaporwave", "Vibe"] },
  { name: "Rage", subgenres: ["Yeat-style", "Carti-style", "Electronic"] }
];

export default function AllCategories() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground p-8 pb-32 overflow-y-auto font-sans">
      <header className="mb-12 flex items-center justify-between">
        <div className="flex items-center gap-6"> 
          <Button onClick={() => navigate("/explore")} variant="ghost" size="icon" className="rounded-none border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-5xl font-black uppercase italic tracking-tighter">All Categories</h1>
            <p className="text-muted-foreground font-bold tracking-widest text-xs mt-1">BROWSE EVERY GENRE AND SUBGENRE</p>
          </div>
        </div>
        <div className="w-72 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search genres..." className="pl-10 rounded-none border-2 border-foreground" />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {ALL_GENRES.map((genre, i) => (
          <motion.div
            key={genre.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <Card className="rounded-none border-2 border-foreground bg-elevate-1 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all group">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-black uppercase italic tracking-tight text-primary group-hover:translate-x-2 transition-transform">{genre.name}</h2>
                <LayoutGrid className="w-5 h-5 opacity-20" />
              </div>
              <div className="flex flex-wrap gap-2">
                {genre.subgenres.map(sub => (
                  <span key={sub} className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-foreground text-background">
                    {sub}
                  </span>
                ))}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
