import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Play, Pause, Heart, Share2, ShoppingCart, Check, UserCheck, UserPlus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProducer } from "@/api/producers";
import type { Beat } from "@/api/types";
import { usePlayer } from "@/context/PlayerContext";
import { useCart } from "@/context/CartContext";
import { useLikes } from "@/context/LikesContext";
import { useFollows } from "@/context/FollowsContext";
import { useAuth } from "@/context/AuthContext";
import { me } from "@/api/auth";
import type { User } from "@/api/types";
import LicensePickerDialog from "@/components/LicensePickerDialog";
import { pluralize } from "@/lib/pluralize";

const ProducerProfile = () => {
  const navigate = useNavigate();
  const { play, isPlaying, isActive } = usePlayer();
  const { addToCart, isInCart } = useCart();
  const { isLiked, toggle: toggleLike } = useLikes();
  const { isFollowing, toggle: toggleFollow } = useFollows();
  const { id } = useParams();
  const [pickerBeat, setPickerBeat] = useState<Beat | null>(null);

  const { token } = useAuth();

  const { data: currentUser } = useQuery<User | null>({
    queryKey: ["me", token],
    queryFn: async () => { try { return await me(); } catch { return null; } },
    enabled: !!token,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["producer", id],
    queryFn: () => fetchProducer(Number(id)),
    enabled: !!id,
  });

  const producer = data?.producer;
  const beats = data?.beats ?? [];
  const followersCount: number = data?.followers_count ?? 0;
  const isOwnProfile = !!currentUser && currentUser.id === producer?.id;

  const getBasePrice = (beat: Beat) => {
    const base = beat.licenses?.find((l) => l.code === "base");
    return base ? `${base.price} ₽` : "—";
  };

  if (isLoading || !producer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="font-black uppercase tracking-widest text-xs">Загрузка продюсера...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-32">
      {/* Hero Header */}
      <div className="h-64 bg-primary relative overflow-hidden border-b-4 border-foreground">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full border-20 border-white rounded-full scale-150 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="max-w-7xl mx-auto px-6 h-full flex items-end pb-8 relative z-10">
          <Button onClick={() => navigate("/producers")} variant="outline" className="absolute top-6 left-6 rounded-none border-2 border-foreground bg-background shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <ArrowLeft className="w-4 h-4 mr-2" /> К каталогу
          </Button>
          <div className="flex items-center gap-8">
            <div className="w-32 h-32 bg-background border-4 border-foreground flex items-center justify-center text-6xl font-black italic shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              {producer.name[0]}
            </div>
            <div className="flex flex-col">
              <h1 className="text-6xl font-black uppercase italic tracking-tighter text-foreground bg-background px-4 inline-block shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-2">
                {producer.name}
              </h1>
              <div className="flex items-center gap-4 text-background font-black uppercase text-xs tracking-widest">
                <span>
                  {beats.length % 10 === 1 && beats.length % 100 !== 11
                    ? `Загружен ${beats.length} бит`
                    : `Загружено ${beats.length} ${pluralize(beats.length, "бит", "бита", "битов")}`}
                </span>
                <span>·</span>
                <span>{pluralize(followersCount, "подписчик", "подписчика", "подписчиков")}: {followersCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Sidebar Info */}
        <div className="space-y-8">
          <Card className="rounded-none border-2 border-foreground p-6 bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-xl font-black uppercase italic mb-4">О продюсере</h2>
            <p className="text-sm font-bold text-muted-foreground leading-relaxed">
              {producer.about || "Описание пока не добавлено."}
            </p>
            <div className="flex gap-4 mt-6">
              <Button size="icon" variant="outline" className="rounded-none border-2 border-foreground"><Share2 className="w-4 h-4" /></Button>
              {!isOwnProfile && (
                <Button
                  className={`flex-1 rounded-none border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black uppercase text-xs flex items-center gap-2 transition-all ${
                    isFollowing(producer.id)
                      ? "bg-card text-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
                      : ""
                  }`}
                  onClick={() => toggleFollow(producer.id)}
                >
                  {isFollowing(producer.id)
                    ? <><UserCheck className="w-4 h-4" /> Отписаться</>
                    : <><UserPlus className="w-4 h-4" /> Подписаться</>
                  }
                </Button>
              )}
            </div>
          </Card>
        </div>

        {/* Beats List */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-3xl font-black uppercase italic tracking-tight border-b-4 border-primary pb-2 inline-block mb-4">Загруженные биты</h2>

          {beats.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-foreground/20">
              <p className="font-black uppercase italic text-muted-foreground tracking-widest text-sm">Битов пока нет</p>
            </div>
          ) : (
            <div className="space-y-4">
              {beats.map((beat) => (
                <motion.div
                  key={beat.id}
                  whileHover={{ x: 10 }}
                  className="p-4 border-2 border-foreground bg-card flex items-center gap-4 group cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(255,51,102,1)] transition-all"
                >
                  {/* Cover + play button stacked */}
                  <div className="relative w-14 h-14 shrink-0 border-2 border-foreground overflow-hidden">
                    {beat.cover_url
                      ? <img src={beat.cover_url} alt={beat.name} className="absolute inset-0 w-full h-full object-cover" />
                      : <div className="absolute inset-0 bg-linear-to-br from-muted to-foreground/20" />
                    }
                    <button
                      className="absolute inset-0 flex items-center justify-center bg-background/40 hover:bg-background/60 transition-colors"
                      onClick={(e) => { e.stopPropagation(); play(beat); }}
                    >
                      {isActive(beat.id) && isPlaying ? (
                        <Pause className="w-5 h-5 fill-foreground text-foreground drop-shadow" />
                      ) : (
                        <Play className="w-5 h-5 fill-foreground text-foreground drop-shadow" />
                      )}
                    </button>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black uppercase italic tracking-tight">{beat.name}</h3>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">
                      {beat.genre?.name ?? ""} {beat.bpm ? `• ${beat.bpm} BPM` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-black text-lg">{getBasePrice(beat)}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="hover:text-primary"
                      onClick={(e) => { e.stopPropagation(); toggleLike(beat.id); }}
                    >
                      <Heart className={`w-5 h-5 transition-colors ${isLiked(beat.id) ? "fill-primary text-primary" : ""}`} />
                    </Button>
                    <Button
                      size="sm"
                      className="rounded-none font-black uppercase text-[10px] border-2 border-foreground"
                      onClick={(e) => { e.stopPropagation(); setPickerBeat(beat); }}
                      disabled={isInCart(beat.id)}
                    >
                      {isInCart(beat.id) ? <Check className="w-3 h-3" /> : <ShoppingCart className="w-3 h-3" />}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <LicensePickerDialog
        beat={pickerBeat}
        open={!!pickerBeat}
        onOpenChange={(open) => !open && setPickerBeat(null)}
        onSelect={(beat, license) => addToCart(beat, license)}
      />
    </div>
  );
}

export default ProducerProfile;
