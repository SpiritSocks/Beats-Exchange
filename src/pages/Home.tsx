import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Search, ShoppingCart, Play, Pause, SkipForward, SkipBack, Heart, MoreHorizontal, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { ThemeToggle } from "@/components/ThemeToggle";
import {useNavigate} from "react-router-dom";

const MOCK_BEATS = [
  { id: 1, title: "LUNA ECLIPSE", producer: "Vampire Inside", bpm: 140, key: "Am", genre: "Drill", price: "$29.99", path: "/luna-eclipse.mp3" },
  { id: 2, title: "VOID RUNNER", producer: "Xiu Digital", bpm: 128, key: "Cm", genre: "Phonk", price: "$49.99", path: "/void-runner.mp3" },
  { id: 3, title: "CYBER HEART", producer: "Digi 4", bpm: 160, key: "F#m", genre: "Trap", price: "$34.99" , path: "/cyber-heart.mp3"},
  { id: 4, title: "NEON GHOST", producer: "Vinyl User", bpm: 95, key: "Em", genre: "Lo-fi", price: "$19.99", path: "/neon-ghost.mp3" },
];

export default function Home() {

  const navigate = useNavigate();
  const songAudioRef = useRef<HTMLAudioElement | null>(null);

  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [activeBeatId, setActiveBeatId] = useState<number | null>(null);

  const handlePlay = (beat: (typeof MOCK_BEATS)[number]) => {
    const audio = songAudioRef.current;
    if (!audio) return;

    // toggle pause if clicking the same beat while it's playing
    if (activeBeatId === beat.id && !audio.paused) {
      audio.pause();
      setIsAudioPlaying(false);
      return;
    }

    // if switching tracks, update the src from the beat path
    if (audio.src !== window.location.origin + beat.path) {
      audio.src = beat.path;
      audio.load();
    }

    setActiveBeatId(beat.id);
    audio.currentTime = 0;
    void audio.play();
    setIsAudioPlaying(true);
  };

  useEffect(() => {
    const audio = songAudioRef.current;
    if (!audio) return;

    const handleLoaded = () => {
      setDuration(audio.duration || 0);
    };

    const handleTimeUpdate = () => {
      if (!isSeeking) {
        setCurrentTime(audio.currentTime);
      }
    };

    const handleEnded = () => {
      setIsAudioPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("loadedmetadata", handleLoaded);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoaded);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [isSeeking]);

  const handleSeek = (value: number[]) => {
    const audio = songAudioRef.current;
    if (!audio || !duration) return;

    const [percent] = value;
    const newTime = (percent / 100) * duration;
    setCurrentTime(newTime);
  };

  const handleSeekCommit = (value: number[]) => {
    const audio = songAudioRef.current;
    if (!audio || !duration) return;

    const [percent] = value;
    const newTime = (percent / 100) * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
    setIsSeeking(false);
  };

  const sliderValue =
    duration > 0 ? [(currentTime / duration) * 100] : [0];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground font-sans overflow-hidden">
      <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-primary rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary rounded-full blur-[120px] opacity-30" />
        <div className="absolute top-1/4 left-1/2 w-[300px] h-[300px] border-[40px] border-primary rounded-full opacity-10 animate-spin-slow" />
      </div>

      <div className="relative z-10 flex flex-col h-screen">
        <header className="px-6 py-4 flex items-center justify-between border-b border-border bg-background/50 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-xl font-black italic">B</span>
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tighter italic">Beat Exchange</h1>
          </div>
          
          <div className="flex-1 max-w-md mx-8">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Search beats, producers, genres..." 
                className="pl-10 bg-elevate-1 border-2 border-transparent focus:border-primary focus:ring-0 rounded-none transition-all uppercase text-xs font-bold"
                data-testid="input-search"
              />
            </div>
          </div>

          <nav className="flex items-center gap-6">
            <ThemeToggle />
            <Button onClick={() => navigate("/explore")} variant="ghost" className="font-bold uppercase text-xs tracking-widest hover:text-primary" data-testid="link-explore">Explore</Button>
            <Button variant="ghost" className="font-bold uppercase text-xs tracking-widest hover:text-primary" data-testid="link-producers">Producers</Button>
            <Button className="font-bold uppercase text-xs tracking-widest px-6 rounded-none border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all" data-testid="button-sell">Start Selling</Button>
            <div className="relative">
              <ShoppingCart className="w-6 h-6" />
              <Badge className="absolute -top-2 -right-2 rounded-full w-5 h-5 flex items-center justify-center p-0 text-[10px] bg-primary border-2 border-foreground">3</Badge>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden flex gap-0">
          {/* Sidebar */}
          <aside className="w-64 border-r border-border p-6 hidden md:flex flex-col gap-8 bg-background/30 backdrop-blur-md">
            <div>
              <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-muted-foreground">Library</h2>
              <div className="flex flex-col gap-2">
                <Button variant="ghost" className="justify-start font-bold uppercase text-xs group hover:bg-primary hover:text-primary-foreground rounded-none transition-all" data-testid="nav-feed">
                  <span className="w-2 h-2 bg-primary group-hover:bg-white rounded-full mr-3" /> Feed
                </Button>
                <Button variant="ghost" className="justify-start font-bold uppercase text-xs group hover:bg-primary hover:text-primary-foreground rounded-none transition-all" data-testid="nav-trending">
                  <span className="w-2 h-2 bg-muted-foreground group-hover:bg-white rounded-full mr-3" /> Trending
                </Button>
                <Button variant="ghost" className="justify-start font-bold uppercase text-xs group hover:bg-primary hover:text-primary-foreground rounded-none transition-all" data-testid="nav-history">
                  <span className="w-2 h-2 bg-muted-foreground group-hover:bg-white rounded-full mr-3" /> History
                </Button>
              </div>
            </div>

            <div>
              <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-muted-foreground">Genres</h2>
              <ScrollArea className="h-[300px]">
                <div className="flex flex-wrap gap-2 pr-4">
                  {["Phonk", "Drill", "Trap", "Lo-fi", "Boom Bap", "R&B", "G-House", "Afrobeat"].map(genre => (
                    <Badge key={genre} variant="outline" className="rounded-none border-2 border-foreground/20 font-bold uppercase text-[10px] px-3 py-1 cursor-pointer hover:border-primary hover:text-primary transition-all">
                      {genre}
                    </Badge>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </aside>

          {/* Beat Grid */}
          <section className="flex-1 p-8 overflow-y-auto">
            {/* Single reusable audio element; src is set in handlePlay */}
            <audio ref={songAudioRef} />

            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-4xl font-black uppercase italic tracking-tighter">Newest Releases</h2>
                <p className="text-muted-foreground text-sm font-bold mt-1">FRESHLY CURATED FOR YOUR NEXT PROJECT</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {MOCK_BEATS.map((beat, i) => (
                <motion.div
                  key={beat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="group relative rounded-none border-2 border-foreground bg-elevate-1 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:translate-y-[-2px] hover:shadow-[12px_12px_0px_0px_rgba(255,51,102,0.3)] transition-all cursor-pointer overflow-hidden" data-testid={`card-beat-${beat.id}`}>
                    <div className="aspect-square relative overflow-hidden bg-muted">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                        <Button
                          size="icon"
                          className="rounded-full w-16 h-16 bg-primary border-4 border-foreground scale-90 group-hover:scale-100 transition-transform"
                          onClick={() => handlePlay(beat)}
                        >
                          {activeBeatId === beat.id && isAudioPlaying ? (
                            <Pause className="w-8 h-8 fill-current ml-1" />
                          ) : (
                            <Play className="w-8 h-8 fill-current ml-1" />
                          )}
                        </Button>
                      </div>
                      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                        <Badge className="rounded-none border-2 border-foreground bg-white text-black font-black uppercase text-[10px]">{beat.genre}</Badge>
                        <Badge className="rounded-none border-2 border-foreground bg-primary font-black uppercase text-[10px]">{beat.bpm} BPM</Badge>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 z-20">
                        <h3 className="text-xl font-black text-white uppercase italic tracking-tight truncate">{beat.title}</h3>
                        <p className="text-white/70 text-xs font-bold uppercase tracking-wider">{beat.producer}</p>
                      </div>
                      {/* Generative-looking pattern */}
                      <div className="absolute inset-0 opacity-20 group-hover:scale-110 transition-transform duration-700">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-8 border-white rounded-full animate-pulse" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-4 border-primary rounded-full animate-spin-slow" />
                      </div>
                    </div>
                    <div className="p-4 flex items-center justify-between bg-white text-black border-t-2 border-foreground">
                      <span className="text-lg font-black">{beat.price}</span>
                      <Button size="sm" className="rounded-none font-bold uppercase text-[10px] h-8 px-4" data-testid={`button-buy-${beat.id}`}>Add to Cart</Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>
        </main>

        {/* Player Bar */}
        <footer className="h-24 border-t-4 border-primary bg-foreground text-background px-6 flex items-center gap-8 relative z-50">
          <div className="flex items-center gap-4 w-[300px]">
            <div className="w-16 h-16 bg-primary border-2 border-background shrink-0 overflow-hidden relative group">
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Play className="w-4 h-4 fill-primary text-primary" />
              </div>
            </div>
            <div className="truncate">
              <h4 className="font-black text-sm uppercase tracking-tight truncate italic text-primary">LUNA ECLIPSE</h4>
              <p className="text-[10px] font-bold text-background/60 uppercase tracking-widest truncate">Vampire Inside</p>
            </div>
            <Button variant="ghost" size="icon" className="hover:text-primary text-background/60 ml-auto"><Heart className="w-4 h-4" /></Button>
          </div>

          <div className="flex-1 flex flex-col items-center gap-2 max-w-2xl mx-auto">
            <div className="flex items-center gap-6">
              <Button variant="ghost" size="icon" className="hover:text-primary transition-colors"><SkipBack className="w-5 h-5 fill-current" /></Button>
              <Button size="icon" className="w-12 h-12 rounded-full bg-primary text-foreground border-4 border-foreground hover:scale-110 transition-transform">
                <Play className="w-6 h-6 fill-current ml-1" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-primary transition-colors"><SkipForward className="w-5 h-5 fill-current" /></Button>
            </div>
            <div className="flex items-center gap-3 w-full text-[10px] font-black font-mono">
              <span>
                {new Date(currentTime * 1000).toISOString().substring(14, 19)}
              </span>
              <Slider
                value={sliderValue}
                max={100}
                step={1}
                className="flex-1 cursor-pointer"
                onValueChange={(v) => {
                  setIsSeeking(true);
                  handleSeek(v);
                }}
                onValueCommit={handleSeekCommit}
              />
              <span>
                {new Date(duration * 1000).toISOString().substring(14, 19)}
              </span>
            </div>
          </div>

          <div className="w-[300px] flex items-center justify-end gap-4">
             <div className="flex items-center gap-2 w-32">
                <Slider defaultValue={[80]} max={100} step={1} />
             </div>
             <Button variant="ghost" size="icon" className="hover:text-primary text-background/60"><MoreHorizontal className="w-5 h-5" /></Button>
          </div>
        </footer>
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
