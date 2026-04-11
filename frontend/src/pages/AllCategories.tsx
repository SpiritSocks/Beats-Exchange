import { motion } from "framer-motion";
import { ArrowLeft, LayoutGrid, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchGenres } from "@/api/genres";
import type { Genre } from "@/api/types";
import { useState } from "react";

export default function AllCategories() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const { data: genres = [] } = useQuery<Genre[]>({
    queryKey: ["genres"],
    queryFn: fetchGenres,
  });

  const filtered = search
    ? genres.filter((g) => g.name.toLowerCase().includes(search.toLowerCase()))
    : genres;

  return (
    <div className="min-h-screen bg-background text-foreground p-8 pb-32 overflow-y-auto font-sans">
      <header className="mb-12 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Button onClick={() => navigate("/explore")} variant="ghost" size="icon" className="rounded-none border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-5xl font-black uppercase italic tracking-tighter">All Genres</h1>
            <p className="text-muted-foreground font-bold tracking-widest text-xs mt-1">BROWSE EVERY GENRE</p>
          </div>
        </div>
        <div className="w-72 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search genres..."
            className="pl-10 rounded-none border-2 border-foreground"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      {filtered.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-foreground/20">
          <p className="font-black uppercase italic text-muted-foreground tracking-widest">No genres found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((genre, i) => (
            <motion.div
              key={genre.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Card
                onClick={() => navigate(`/genre/${genre.id}`)}
                className="rounded-none border-2 border-foreground bg-elevate-1 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black uppercase italic tracking-tight text-primary group-hover:translate-x-2 transition-transform">{genre.name}</h2>
                  <LayoutGrid className="w-5 h-5 opacity-20" />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
