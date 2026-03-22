import { Play, Pause, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { usePlayer } from "@/context/PlayerContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useMemo } from "react";

export function PlayerBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeBeat, isPlaying, duration, currentTime, volume, togglePlayPause, seek, setVolume } = usePlayer();

  const [isSeeking, setIsSeeking] = useState(false);
  const [seekTime, setSeekTime] = useState(0);
  const [likedIds, setLikedIds] = useState<number[]>([]);

  const displayTime = isSeeking ? seekTime : currentTime;
  const sliderValue = duration > 0 ? [(displayTime / duration) * 100] : [0];

  const isActiveLiked = useMemo(() => {
    return activeBeat ? likedIds.includes(activeBeat.id) : false;
  }, [activeBeat?.id, likedIds]);

  const handleLike = () => {
    if (!activeBeat) return;
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(activeBeat.id)) next.delete(activeBeat.id);
      else next.add(activeBeat.id);
      return Array.from(next);
    });
  };

  if (!activeBeat || location.pathname === "/auth") return null;

  return (
    <footer className="fixed bottom-0 left-0 right-0 h-24 border-t-4 border-primary bg-foreground text-background px-6 flex items-center gap-8 z-50">
      <div className="flex items-center gap-4 w-75">
        <div className="w-16 h-16 bg-primary border-2 border-background shrink-0 overflow-hidden relative" />
        <div className="truncate">
          <h4 className="font-black text-sm uppercase tracking-tight truncate italic text-background">{activeBeat?.name ?? "—"}</h4>
          <Button
            onClick={() => activeBeat?.user_id && navigate(`/producers/${activeBeat.user_id}`)}
            className="text-[10px] font-bold text-background/60 uppercase tracking-widest truncate border-none bg-transparent m-0 p-0"
          >
            {activeBeat?.user?.name ?? "—"}
          </Button>
        </div>
        <Button onClick={handleLike} disabled={!activeBeat} variant="ghost" size="icon" className="text-background/60 ml-auto">
          <Heart className={["w-4 h-4 transition-colors", isActiveLiked ? "fill-background text-primary" : "fill-transparent text-background"].join(" ")} />
        </Button>
      </div>

      <div className="flex-1 flex flex-col items-center gap-2 max-w-2xl mx-auto">
        <div className="flex items-center gap-6">
          <Button
            size="icon"
            className="w-12 h-12 rounded-full bg-primary text-foreground border-2 border-background hover:scale-110 transition-transform disabled:opacity-50"
            onClick={togglePlayPause}
            disabled={!activeBeat}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-background" />
            ) : (
              <Play className="w-6 h-6 fill-background ml-1" />
            )}
          </Button>
        </div>
        <div className="flex items-center gap-3 w-full text-[10px] font-black font-mono">
          <span>{new Date(displayTime * 1000).toISOString().substring(14, 19)}</span>
          <Slider
            value={sliderValue}
            max={100}
            step={0.1}
            className="flex-1 cursor-pointer"
            onValueChange={(v) => {
              setIsSeeking(true);
              const newTime = ((v[0] ?? 0) / 100) * duration;
              setSeekTime(newTime);
            }}
            onValueCommit={(v) => {
              const newTime = ((v[0] ?? 0) / 100) * duration;
              seek(newTime);
              setIsSeeking(false);
            }}
          />
          <span>{new Date(duration * 1000).toISOString().substring(14, 19)}</span>
        </div>
      </div>

      <div className="w-75 flex items-center justify-end gap-4">
        <div className="flex items-center gap-2 w-32">
          <Slider
            value={[volume * 100]}
            max={100}
            step={1}
            onValueChange={(v) => setVolume((v[0] ?? 80) / 100)}
          />
        </div>
      </div>
    </footer>
  );
}
