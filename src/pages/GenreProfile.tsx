import { motion } from "framer-motion";
import { ArrowLeft, Music, Play, Pause } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchGenre } from "@/api/genres";
import type { Beat } from "@/api/types";
import { usePlayer } from "@/context/PlayerContext";

const GenreProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { play, isPlaying, isActive } = usePlayer();

  const { data, isLoading } = useQuery({
    queryKey: ["genre", id],
    queryFn: () => fetchGenre(Number(id)),
    enabled: !!id,
  });

  const genre = data?.genre;
  const beats = data?.beats ?? [];

  const getBasePrice = (beat: Beat) => {
    const base = beat.licenses?.find((l) => l.code === "base");
    return base ? `$${base.price}` : "—";
  };

  if (isLoading || !genre) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="font-black uppercase tracking-widest text-xs">Loading genre...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-32">
      {/* Hero Header */}
      <div className="h-64 bg-foreground relative overflow-hidden border-b-4 border-primary">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-full h-full border-40 border-primary rounded-full scale-150 translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>

        <div className="max-w-7xl mx-auto px-6 h-full flex items-end pb-8 relative z-10">
          <Button onClick={() => navigate("/explore")} variant="outline" className="absolute top-6 left-6 rounded-none border-2 border-primary bg-background text-primary shadow-[4px_4px_0px_0px_rgba(255,51,102,1)] hover:shadow-none transition-all">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Explore
          </Button>
          <div className="flex items-center gap-8">
            <div className="w-32 h-32 bg-background border-4 border-foreground flex items-center justify-center text-6xl font-black italic shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-foreground">
              {genre.name[0]}
            </div>
            <div className="flex flex-col">
              <h1 className="text-6xl font-black uppercase italic tracking-tighter text-background bg-primary px-4 inline-block shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-2">
                {genre.name}
              </h1>
              <div className="flex items-center gap-4 text-primary font-black uppercase text-xs tracking-widest bg-background/80 backdrop-blur-sm p-1">
                <span className="flex items-center gap-1"><Music className="w-3 h-3" /> {beats.length} Beats</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-350 mx-auto px-6 py-12">
        <div className="flex flex-col gap-12">
          <div className="flex items-center justify-between pb-6 border-b-2 border-foreground/10">
            <Badge className="rounded-none bg-primary text-background font-black uppercase text-[10px] h-10 px-6 flex items-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              {beats.length} Results
            </Badge>
          </div>

          {beats.length === 0 ? (
            <div className="py-20 text-center border-2 border-dashed border-foreground/20">
              <p className="font-black uppercase italic text-muted-foreground tracking-widest">No beats found in this genre</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {beats.map((beat, index) => (
                <motion.div
                  key={beat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="group relative rounded-none border-2 border-foreground bg-card shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(255,51,102,1)] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all cursor-pointer overflow-hidden flex flex-col h-full">
                    <div className="aspect-square relative overflow-hidden bg-muted">
                      <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent z-10" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                        <Button
                          size="icon"
                          className="rounded-full w-12 h-12 bg-primary border-2 border-foreground scale-90 group-hover:scale-100 transition-transform text-foreground"
                          onClick={() => play(beat)}
                        >
                          {isActive(beat.id) && isPlaying ? (
                            <Pause className="w-6 h-6 fill-current ml-1" />
                          ) : (
                            <Play className="w-6 h-6 fill-current ml-1" />
                          )}
                        </Button>
                      </div>
                      {beat.bpm && (
                        <div className="absolute top-2 right-2 z-20">
                          <Badge className="rounded-none border-2 border-foreground bg-primary text-foreground font-black uppercase text-[8px] px-1.5 py-0.5">
                            {beat.bpm} BPM
                          </Badge>
                        </div>
                      )}
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-black uppercase italic tracking-tight text-sm mb-1 truncate group-hover:text-primary transition-colors">{beat.name}</h3>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1 truncate">{beat.user?.name ?? "Unknown"}</p>
                      </div>

                      <div className="mt-4 flex items-center justify-between pt-3 border-t border-foreground/10">
                        <span className="font-black text-sm">{getBasePrice(beat)}</span>
                        <Button size="sm" className="rounded-none h-8 font-black uppercase text-[9px] border-2 border-foreground bg-primary text-foreground hover:bg-foreground hover:text-primary px-3">
                          Buy
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default GenreProfile;
