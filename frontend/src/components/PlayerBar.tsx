import { Play, Pause, Heart, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { usePlayer } from "@/context/PlayerContext";
import { useLikes } from "@/context/LikesContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

export function PlayerBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeBeat, isPlaying, duration, currentTime, volume, togglePlayPause, seek, setVolume } = usePlayer();

  const { isLiked, toggle: toggleLike } = useLikes();
  const [collapsed, setCollapsed] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekTime, setSeekTime] = useState(0);

  const displayTime = isSeeking ? seekTime : currentTime;
  const sliderValue = duration > 0 ? [(displayTime / duration) * 100] : [0];


  if (!activeBeat || location.pathname === "/auth") return null;

  return (
    <footer
      className={`fixed bottom-0 left-0 right-0 border-t-4 border-primary bg-foreground text-background z-50 transition-all duration-300 overflow-visible ${
        collapsed ? "h-1" : "h-24"
      }`}
    >
      {/* Collapse toggle — sits above the bar, always visible */}
      <button
        onClick={() => setCollapsed((v) => !v)}
        className="absolute -top-6 left-1/2 -translate-x-1/2 w-10 h-6 bg-foreground border-t-2 border-x-2 border-primary flex items-center justify-center hover:bg-primary transition-colors"
        title={collapsed ? "Показать плеер" : "Скрыть плеер"}
      >
        {collapsed
          ? <ChevronUp className="w-3 h-3 text-background" />
          : <ChevronDown className="w-3 h-3 text-background" />
        }
      </button>

      {/* Player content — hidden when collapsed */}
      {!collapsed && (
        <div className="flex items-center gap-8 h-full px-6">
          {/* Left: cover + info + like */}
          <div className="flex items-center gap-4 w-75">
            <div className="w-16 h-16 bg-primary border-2 border-background shrink-0 overflow-hidden relative">
              {activeBeat.cover_url && (
                <img src={activeBeat.cover_url} alt={activeBeat.name} className="w-full h-full object-cover" />
              )}
            </div>
            <div className="truncate">
              <h4 className="font-black text-sm uppercase tracking-tight truncate italic text-background">
                {activeBeat.name}
              </h4>
              <Button
                onClick={() => activeBeat.user_id && navigate(`/producers/${activeBeat.user_id}`)}
                className="text-[10px] font-bold text-background/60 uppercase tracking-widest truncate border-none bg-transparent m-0 p-0"
              >
                {activeBeat.user?.name ?? "—"}
              </Button>
            </div>
            <Button
              onClick={() => activeBeat && toggleLike(activeBeat.id)}
              variant="ghost" size="icon" className="text-background/60 ml-auto"
            >
              <Heart className={`w-4 h-4 transition-colors ${activeBeat && isLiked(activeBeat.id) ? "fill-background text-primary" : "fill-transparent text-background"}`} />
            </Button>
          </div>

          {/* Center: play + seek */}
          <div className="flex-1 flex flex-col items-center gap-2 max-w-2xl mx-auto">
            <Button
              size="icon"
              className="w-12 h-12 rounded-full bg-primary text-foreground border-2 border-background hover:scale-110 transition-transform"
              onClick={togglePlayPause}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 fill-background" />
              ) : (
                <Play className="w-6 h-6 fill-background ml-1" />
              )}
            </Button>
            <div className="flex items-center gap-3 w-full text-[10px] font-black font-mono">
              <span>{new Date(displayTime * 1000).toISOString().substring(14, 19)}</span>
              <Slider
                value={sliderValue}
                max={100}
                step={0.1}
                className="flex-1 cursor-pointer"
                onValueChange={(v) => {
                  setIsSeeking(true);
                  setSeekTime(((v[0] ?? 0) / 100) * duration);
                }}
                onValueCommit={(v) => {
                  seek(((v[0] ?? 0) / 100) * duration);
                  setIsSeeking(false);
                }}
              />
              <span>{new Date(duration * 1000).toISOString().substring(14, 19)}</span>
            </div>
          </div>

          {/* Right: volume */}
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
        </div>
      )}
    </footer>
  );
}
