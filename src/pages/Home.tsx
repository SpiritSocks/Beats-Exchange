import { motion } from "framer-motion";
import { Search, Play, Pause, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useNavigate } from "react-router-dom";
import { logout as apiLogout } from "@/api/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchLatestBeats } from "@/api/beats";
import { usePlayer } from "@/context/PlayerContext";
import type { Beat } from "@/api/types";
import { useState } from "react";

const Home = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { play, isPlaying, isActive } = usePlayer();

  const [isLoggedIn, setIsLoggedIn] = useState(
    typeof window !== "undefined" && !!localStorage.getItem("authToken"),
  );

  const { data: latestBeats = [] } = useQuery<Beat[]>({
    queryKey: ["beats", "latest"],
    queryFn: fetchLatestBeats,
  });

  const getBasePrice = (beat: Beat) => {
    const base = beat.licenses?.find((l) => l.code === "base");
    return base ? `$${base.price}` : "—";
  };

  const handleAuthButtonClick = async () => {
    if (!isLoggedIn) {
      navigate("/auth");
      return;
    }

    try { await apiLogout(); } catch {}

    localStorage.removeItem("authToken");
    queryClient.removeQueries({ queryKey: ["me"] });
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground font-sans overflow-hidden">
      <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-100 h-100 bg-primary rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-5%] w-125 h-125 bg-primary rounded-full blur-[120px] opacity-30" />
        <div className="absolute top-1/4 left-1/2 w-75 h-75 border-40 border-primary rounded-full opacity-10 animate-spin-slow" />
      </div>

      <div className="relative z-10 flex flex-col h-screen pb-24">
        <header className="px-6 py-4 flex items-center justify-between border-b border-border bg-background/50 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-xl font-black italic text-background">B</span>
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tighter italic">Beat Exchange</h1>
          </div>

          <div className="flex-1 max-w-md mx-8">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search beats, producers, genres..."
                className="pl-10 bg-elevate-1 border-2 border-transparent focus:border-primary focus:ring-0 rounded-none transition-all uppercase text-xs font-bold"
              />
            </div>
          </div>

          <nav className="flex items-center gap-6">
            <ThemeToggle />
            <Button onClick={() => navigate("/explore")} variant="ghost" className="font-bold uppercase text-xs tracking-widest hover:bg-primary hover:text-primary-foreground">
              Explore
            </Button>
            <Button onClick={() => navigate("/producers")} variant="ghost" className="font-bold uppercase text-xs tracking-widest hover:bg-primary hover:text-primary-foreground">
              Producers
            </Button>
            <User onClick={() => navigate("/profile")} className="w-6 h-6 hover:text-primary cursor-pointer" />
            <Button
              onClick={handleAuthButtonClick}
              className="font-bold uppercase text-xs tracking-widest px-6 rounded-none border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all hover:bg-primary hover:text-primary-foreground hover:border-background"
            >
              {isLoggedIn ? "Log out" : "Sign in"}
            </Button>
          </nav>
        </header>

        <main className="flex-1 overflow-hidden flex gap-0">
          <aside className="w-64 border-r border-border p-6 hidden md:flex flex-col gap-8 bg-background/30 backdrop-blur-md">
            <div>
              <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-muted-foreground">Library</h2>
              <div className="flex flex-col gap-2">
                <Button variant="ghost" className="justify-start font-bold uppercase text-xs group hover:bg-primary hover:text-primary-foreground rounded-none transition-all">
                  <span className="w-2 h-2 bg-primary group-hover:bg-white rounded-full mr-3" /> Feed
                </Button>
                <Button variant="ghost" className="justify-start font-bold uppercase text-xs group hover:bg-primary hover:text-primary-foreground rounded-none transition-all">
                  <span className="w-2 h-2 bg-muted-foreground group-hover:bg-white rounded-full mr-3" /> Trending
                </Button>
                <Button variant="ghost" className="justify-start font-bold uppercase text-xs group hover:bg-primary hover:text-primary-foreground rounded-none transition-all">
                  <span className="w-2 h-2 bg-muted-foreground group-hover:bg-white rounded-full mr-3" /> History
                </Button>
              </div>
            </div>
          </aside>

          <section className="flex-1 p-8 overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-4xl font-black uppercase italic tracking-tighter">Newest Releases</h2>
            </div>

            {latestBeats.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed border-foreground/20">
                <p className="font-black uppercase italic text-muted-foreground tracking-widest">No beats available yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {latestBeats.map((beat, i) => (
                  <motion.div
                    key={beat.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="group relative rounded-none border-2 border-foreground bg-elevate-1 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[12px_12px_0px_0px_rgba(255,51,102,0.3)] transition-all cursor-pointer overflow-hidden">
                      <div className="aspect-square relative overflow-hidden bg-muted">
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent z-10" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                          <Button
                            size="icon"
                            className="rounded-full w-16 h-16 bg-primary border-4 border-foreground scale-90 group-hover:scale-100 transition-transform"
                            onClick={() => play(beat)}
                          >
                            {isActive(beat.id) && isPlaying ? (
                              <Pause className="w-8 h-8 fill-current ml-1" />
                            ) : (
                              <Play className="w-8 h-8 fill-current ml-1" />
                            )}
                          </Button>
                        </div>
                        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                          {beat.genre && (
                            <Badge className="rounded-none border-2 border-foreground bg-white text-black font-black uppercase text-[10px] flex justify-center">{beat.genre.name}</Badge>
                          )}
                          {beat.bpm && (
                            <Badge className="rounded-none border-2 border-foreground bg-primary font-black uppercase text-[10px]">{beat.bpm} BPM</Badge>
                          )}
                        </div>
                        <div className="absolute bottom-4 left-4 right-4 z-20">
                          <h3 className="text-xl font-black text-white uppercase italic tracking-tight truncate">{beat.name}</h3>
                          <p className="text-white/70 text-xs font-bold uppercase tracking-wider">{beat.user?.name ?? "Unknown"}</p>
                        </div>
                        <div className="absolute inset-0 opacity-20 group-hover:scale-110 transition-transform duration-700">
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-8 border-white rounded-full animate-pulse" />
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-4 border-primary rounded-full animate-spin-slow" />
                        </div>
                      </div>
                      <div className="p-4 flex items-center justify-between bg-white text-black border-t-2 border-foreground">
                        <span className="text-lg font-black">{getBasePrice(beat)}</span>
                        <Button size="sm" className="rounded-none font-bold uppercase text-[10px] h-8 px-4">Buy</Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>

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
