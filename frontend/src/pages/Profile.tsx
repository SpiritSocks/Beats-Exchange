import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Upload,
  Settings,
  Plus,
  Music,
  Wallet,
  Mail,
  X,
  Play,
  Pause,
  Trash2,
  ImagePlus,
  Download,
  ShoppingBag,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MUSICAL_KEYS = [
  "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
  "Cm", "C#m", "Dm", "D#m", "Em", "Fm", "F#m", "Gm", "G#m", "Am", "A#m", "Bm",
];

import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { me, type User } from "@/api/auth";
import { fetchMyBeats, createBeat, uploadBeatAsset, uploadBeatCover, deleteBeat } from "@/api/beats";
import { fetchMyOrders, downloadLicense, type MyPurchase } from "@/api/orders";
import { fetchGenres } from "@/api/genres";
import { fetchFollowedProducers } from "@/api/follows";
import type { Beat, Genre, Producer } from "@/api/types";
import { usePlayer } from "@/context/PlayerContext";
import { useAuth } from "@/context/AuthContext";


const Profile = () => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isPurchasesOpen, setIsPurchasesOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const mp3InputRef = useRef<HTMLInputElement | null>(null);
  const wavInputRef = useRef<HTMLInputElement | null>(null);
  const stemsInputRef = useRef<HTMLInputElement | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedMp3, setSelectedMp3] = useState<File | null>(null);
  const [selectedWav, setSelectedWav] = useState<File | null>(null);
  const [selectedStems, setSelectedStems] = useState<File | null>(null);
  const [selectedCover, setSelectedCover] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { play, isPlaying, isActive } = usePlayer();

  // Form state
  const [beatName, setBeatName] = useState("");
  const [beatGenreId, setBeatGenreId] = useState<string>("");
  const [beatBpm, setBeatBpm] = useState("");
  const [beatKey, setBeatKey] = useState("");
  const [beatDescription, setBeatDescription] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Prices per tier — premium/ultimate/exclusive auto-calc from base unless manually edited
  const [priceBase, setPriceBase] = useState("");
  const [pricePremium, setPricePremium] = useState("");
  const [priceUltimate, setPriceUltimate] = useState("");
  const [priceExclusive, setPriceExclusive] = useState("");
  const [priceEdited, setPriceEdited] = useState({ premium: false, ultimate: false, exclusive: false });

  const handleBasePriceChange = (val: string) => {
    setPriceBase(val);
    const base = parseFloat(val);
    if (!isNaN(base) && base > 0) {
      if (!priceEdited.premium)   setPricePremium((base * 2).toFixed(2));
      if (!priceEdited.ultimate)  setPriceUltimate((base * 3).toFixed(2));
      if (!priceEdited.exclusive) setPriceExclusive((base * 5).toFixed(2));
    } else {
      if (!priceEdited.premium)   setPricePremium("");
      if (!priceEdited.ultimate)  setPriceUltimate("");
      if (!priceEdited.exclusive) setPriceExclusive("");
    }
  };

  const { token } = useAuth();

  const { data: user, isLoading, isError } = useQuery<User | null>({
    queryKey: ["me", token],
    queryFn: async () => {
      try {
        return await me();
      } catch {
        return null;
      }
    },
  });

  const { data: myBeats = [] } = useQuery<Beat[]>({
    queryKey: ["my-beats"],
    queryFn: fetchMyBeats,
    enabled: !!token,
  });

  const { data: genres = [] } = useQuery<Genre[]>({
    queryKey: ["genres"],
    queryFn: fetchGenres,
  });

  const { data: followedProducers = [] } = useQuery<Producer[]>({
    queryKey: ["followed-producers"],
    queryFn: fetchFollowedProducers,
    enabled: !!token,
  });

  const { data: myPurchases = [] } = useQuery<MyPurchase[]>({
    queryKey: ["my-orders"],
    queryFn: fetchMyOrders,
    enabled: !!token,
  });

  const deleteBeatMutation = useMutation({
    mutationFn: (beatId: number) => deleteBeat(beatId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-beats"] });
      queryClient.invalidateQueries({ queryKey: ["beats"] });
    },
  });

  const createBeatMutation = useMutation({
    mutationFn: async () => {
      const base      = priceBase      ? parseFloat(priceBase)      : 0;
      const premium   = pricePremium   ? parseFloat(pricePremium)   : base * 2;
      const ultimate  = priceUltimate  ? parseFloat(priceUltimate)  : base * 3;
      const exclusive = priceExclusive ? parseFloat(priceExclusive) : base * 5;

      const beat = await createBeat({
        name: beatName,
        description: beatDescription || undefined,
        bpm: beatBpm ? parseInt(beatBpm) : undefined,
        key: beatKey || undefined,
        genre_id: beatGenreId ? parseInt(beatGenreId) : undefined,
        prices: { base, premium, ultimate, exclusive },
      });

      if (selectedMp3 && beat.id) {
        await uploadBeatAsset(beat.id, { license_code: "base", type: "mp3", file: selectedMp3 });
      }
      if (selectedWav && beat.id) {
        await uploadBeatAsset(beat.id, { license_code: "premium", type: "wav", file: selectedWav });
      }
      if (selectedStems && beat.id) {
        await uploadBeatAsset(beat.id, { license_code: "ultimate", type: "trackout_zip", file: selectedStems });
        await uploadBeatAsset(beat.id, { license_code: "exclusive", type: "trackout_zip", file: selectedStems });
      }

      // Upload cover if selected
      if (selectedCover && beat.id) {
        await uploadBeatCover(beat.id, selectedCover);
      }

      return beat;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-beats"] });
      queryClient.invalidateQueries({ queryKey: ["beats"] });
      closeUpload();
    },
    onError: (err: Error) => {
      setSubmitError(err.message);
    },
  });

  useEffect(() => {
    if (!token) {
      navigate("/auth");
      return;
    }

    if (!isLoading && (!user || isError)) {
      navigate("/auth");
    }
  }, [user, isLoading, isError, navigate, token]);

  const closeUpload = () => {
    setIsUploadOpen(false);
    setSelectedMp3(null);
    setSelectedWav(null);
    setSelectedStems(null);
    setSelectedCover(null);
    setCoverPreview(null);
    setBeatName("");
    setBeatGenreId("");
    setBeatBpm("");
    setBeatKey("");
    setBeatDescription("");
    setPriceBase("");
    setPricePremium("");
    setPriceUltimate("");
    setPriceExclusive("");
    setPriceEdited({ premium: false, ultimate: false, exclusive: false });
    setSubmitError(null);
    if (mp3InputRef.current) mp3InputRef.current.value = "";
    if (wavInputRef.current) wavInputRef.current.value = "";
    if (stemsInputRef.current) stemsInputRef.current.value = "";
    if (coverInputRef.current) coverInputRef.current.value = "";
  };

  const getBasePrice = (beat: Beat) => {
    const base = beat.licenses?.find((l) => l.code === "base");
    return base ? `${base.price} ₽` : "—";
  };

  if (!token || isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="font-black uppercase tracking-widest text-xs">
          Загрузка профиля...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-32">
      {/* Header / Cover */}
      <div className="h-48 bg-primary relative border-b-4 border-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full border-60 border-white rounded-full scale-110 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-6 relative z-10 flex justify-between items-start">
            <Button onClick={() => navigate("/")} variant="outline" size="sm" className="rounded-none border-2 border-foreground bg-background shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <ArrowLeft className="w-4 h-4 mr-2" /> Главная
            </Button>
            <Button onClick={() => navigate("/settings")} variant="outline" size="icon" className="rounded-none border-2 border-foreground bg-background shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Settings className="w-4 h-4" />
            </Button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 -mt-24 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column: Profile Card */}
          <div className="space-y-6">
            <Card className="rounded-none border-4 border-foreground bg-card p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-32 h-32 bg-primary border-4 border-foreground flex items-center justify-center text-6xl font-black italic shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-background">{user.name[0].toUpperCase()}</span>
                    )}
                  </div>
                </div>

                <h1 className="text-3xl font-black uppercase italic tracking-tighter mb-1">{user.name}</h1>
                <div className="flex items-center gap-2 text-muted-foreground text-[10px] font-bold uppercase tracking-widest mb-6">
                  <Mail className="w-3 h-3" /> {user.email}
                </div>

                <div className="w-full grid grid-cols-2 gap-2 border-y-2 border-foreground/10 py-6 mb-6">
                  <div className="flex flex-col items-center">
                    <span className="text-xl font-black">{myBeats.length}</span>
                    <span className="text-[8px] font-black uppercase text-muted-foreground">Треков</span>
                  </div>
                  <div className="flex flex-col items-center border-l-2 border-foreground/10">
                    <span className="text-xl font-black">{user.role === 1 ? "Продюсер" : "Пользователь"}</span>
                    <span className="text-[8px] font-black uppercase text-muted-foreground">Роль</span>
                  </div>
                </div>

                <Button
                  onClick={() => setIsUploadOpen(true)}
                  className="w-full h-12 rounded-none border-2 border-foreground bg-primary text-background font-black uppercase tracking-widest text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all mb-4"
                >
                  <Upload className="w-4 h-4 mr-2" /> Загрузить бит
                </Button>
              </div>
            </Card>

            {/* Wallet Card */}
            <Card className="rounded-none border-4 border-foreground bg-card p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-foreground">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-primary" />
                  <span className="font-black uppercase italic tracking-tight">Ваш баланс</span>
                </div>
              </div>
              <div className="text-4xl font-black mb-6 italic text-primary">
                {user.balance ?? "0.00"} ₽
              </div>
              <Button className="w-full h-10 rounded-none bg-background text-foreground border-2 border-primary font-black uppercase text-[10px] tracking-widest hover:bg-primary hover:text-white transition-all">
                <Plus className="w-4 h-4 mr-1" /> Пополнить баланс
              </Button>
            </Card>

            <Button
              onClick={() => setIsPurchasesOpen(true)}
              variant="outline"
              className="w-full h-12 rounded-none border-2 border-foreground font-black uppercase text-xs tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              <ShoppingBag className="w-4 h-4 mr-2" /> Мои покупки
              {myPurchases.length > 0 && (
                <span className="ml-2 bg-primary text-background text-[9px] font-black px-1.5 py-0.5">{myPurchases.length}</span>
              )}
            </Button>
          </div>

          {/* Right Column: Content */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="rounded-none border-4 border-foreground bg-card p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-2xl font-black uppercase italic tracking-tight border-b-4 border-primary pb-2 inline-block mb-6">Обо мне</h2>
              <p className="text-sm font-bold text-muted-foreground leading-relaxed mb-8">
                {user.about ?? "Описание пока не добавлено."}
              </p>

              <div className="space-y-6">
                <h3 className="text-xl font-black uppercase italic tracking-tight flex items-center gap-2">
                  Мои треки
                </h3>

                {myBeats.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-foreground/20">
                    <p className="font-black uppercase italic text-muted-foreground tracking-widest text-sm">Треков пока нет</p>
                    <Button
                      onClick={() => setIsUploadOpen(true)}
                      className="mt-4 rounded-none border-2 border-foreground font-black uppercase text-xs"
                    >
                      Загрузить первый бит
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {myBeats.map((beat) => (
                      <motion.div
                        key={beat.id}
                        whileHover={{ x: 10 }}
                        className="p-4 border-2 border-foreground bg-elevate-1 flex items-center gap-4 group cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                      >
                        {/* Cover + play button stacked */}
                        <div className="relative w-12 h-12 shrink-0 border-2 border-foreground overflow-hidden">
                          {beat.cover_url
                            ? <img src={beat.cover_url} alt={beat.name} className="absolute inset-0 w-full h-full object-cover" />
                            : <div className="absolute inset-0 bg-linear-to-br from-muted to-foreground/20" />
                          }
                          <button
                            className="absolute inset-0 flex items-center justify-center bg-background/40 hover:bg-background/60 transition-colors"
                            onClick={(e) => { e.stopPropagation(); play(beat); }}
                          >
                            {isActive(beat.id) && isPlaying ? (
                              <Pause className="w-4 h-4 fill-foreground text-foreground drop-shadow" />
                            ) : (
                              <Play className="w-4 h-4 fill-foreground text-foreground drop-shadow" />
                            )}
                          </button>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-black uppercase italic tracking-tight text-sm">{beat.name}</h4>
                            {beat.is_available === false && (
                              <span className="text-[8px] font-black uppercase tracking-widest border border-primary text-primary px-1 py-0.5 shrink-0">
                                Продан эксклюзивно
                              </span>
                            )}
                          </div>
                          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                            {beat.bpm ? `${beat.bpm} BPM` : ""} {beat.key ? `• ${beat.key}` : ""}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          {beat.genre && (
                            <Badge variant="outline" className="rounded-none border-foreground/20 font-black uppercase text-[8px]">{beat.genre.name}</Badge>
                          )}
                          <span className="font-black text-xs">{getBasePrice(beat)}</span>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                            disabled={deleteBeatMutation.isPending}
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteTarget(beat.id);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </Card>

          </div>

        </div>

        {/* Subscriptions — full width */}
        <div className="mt-8">
          <Card className="rounded-none border-4 border-foreground bg-card p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-2xl font-black uppercase italic tracking-tight border-b-4 border-primary pb-2 inline-block mb-6">Мои подписки</h2>
            {followedProducers.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-foreground/20">
                <p className="font-black uppercase italic text-muted-foreground tracking-widest text-sm">Вы пока ни на кого не подписаны</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                {followedProducers.map((producer) => (
                  <motion.div
                    key={producer.id}
                    whileHover={{ y: -2 }}
                    onClick={() => navigate(`/producers/${producer.id}`)}
                    className="group border-2 border-foreground bg-card p-4 flex flex-col items-center gap-3 cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(255,51,102,1)] transition-all"
                  >
                    <div className="w-14 h-14 bg-primary border-2 border-foreground flex items-center justify-center text-2xl font-black italic text-background group-hover:scale-105 transition-transform overflow-hidden">
                      {producer.avatar
                        ? <img src={producer.avatar} alt={producer.name} className="w-full h-full object-cover" />
                        : producer.name[0].toUpperCase()
                      }
                    </div>
                    <div className="text-center">
                      <p className="font-black uppercase italic tracking-tight text-xs truncate w-full">{producer.name}</p>
                      <p className="text-[9px] font-bold uppercase text-muted-foreground tracking-widest mt-0.5">Продюсер</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </main>

      {/* Purchases Modal */}
      <AnimatePresence>
        {isPurchasesOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
              onClick={() => setIsPurchasesOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-background border-4 border-foreground shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between p-6 border-b-2 border-foreground">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-5 h-5" />
                  <h2 className="text-xl font-black uppercase italic tracking-tighter">Мои покупки</h2>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsPurchasesOpen(false)}
                  className="rounded-none border-2 border-foreground hover:bg-primary transition-colors"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Modal body */}
              <div className="overflow-y-auto max-h-[60vh] p-6 space-y-3">
                {myPurchases.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-foreground/20">
                    <ShoppingBag className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                    <p className="font-black uppercase italic text-muted-foreground tracking-widest text-sm">Покупок пока нет</p>
                  </div>
                ) : (
                  myPurchases.map((p, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      {/* Cover */}
                      <div className="w-12 h-12 shrink-0 border-2 border-foreground overflow-hidden bg-muted">
                        {p.beat_cover
                          ? <img src={p.beat_cover} alt={p.beat_name} className="w-full h-full object-cover" />
                          : <div className="w-full h-full bg-linear-to-br from-muted to-foreground/20" />
                        }
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-black uppercase italic tracking-tight text-sm truncate">{p.beat_name}</p>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                          {p.license_code} &nbsp;•&nbsp; {p.price} ₽ &nbsp;•&nbsp; {p.purchased_at}
                        </p>
                        <p className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest">{p.order_number}</p>
                      </div>

                      {/* Downloads */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => {
                            const ext = p.license_code === "base" ? "mp3" : "zip";
                            downloadLicense(p.beat_download_url, `${p.beat_name}_${p.license_code}.${ext}`);
                          }}
                          className="flex items-center gap-1.5 border-2 border-primary text-primary px-3 py-2 text-[10px] font-black uppercase hover:bg-primary hover:text-background transition-colors cursor-pointer"
                        >
                          <Download className="w-3 h-3" />
                          Файлы
                        </button>
                        {p.license_download_url && (
                          <button
                            onClick={() => downloadLicense(p.license_download_url!, `${p.beat_name}_${p.license_code}_license.pdf`)}
                            className="flex items-center gap-1.5 border-2 border-foreground px-3 py-2 text-[10px] font-black uppercase hover:bg-foreground hover:text-background transition-colors cursor-pointer"
                          >
                            <Download className="w-3 h-3" />
                            PDF
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Upload Modal */}
      <AnimatePresence>
        {isUploadOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
              onClick={closeUpload}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-background border-4 border-foreground p-8 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-background border-2 border-foreground flex items-center justify-center">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter">Загрузка бита</h2>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Поделись своим звуком с миром</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeUpload}
                  className="rounded-none border-2 border-foreground hover:bg-primary transition-colors"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <form
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitError(null);
                  createBeatMutation.mutate();
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest">Название бита</Label>
                    <Input
                      required
                      placeholder="e.g. DARK NIGHT"
                      className="rounded-none border-2 border-foreground bg-elevate-1 focus:border-primary transition-all font-bold uppercase italic"
                      data-testid="input-beat-name"
                      value={beatName}
                      onChange={(e) => setBeatName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest">Жанр</Label>
                    <Select value={beatGenreId} onValueChange={setBeatGenreId}>
                      <SelectTrigger className="rounded-none border-2 border-foreground bg-elevate-1 font-bold uppercase">
                        <SelectValue placeholder="Выберите жанр" />
                      </SelectTrigger>
                      <SelectContent className="rounded-none border-2 border-foreground max-h-52 overflow-y-auto" position="popper" sideOffset={4} avoidCollisions>
                        {genres.map((genre) => (
                          <SelectItem key={genre.id} value={String(genre.id)}>
                            {genre.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest">BPM</Label>
                    <Input
                      type="number"
                      placeholder="140"
                      className="rounded-none border-2 border-foreground bg-elevate-1 font-bold"
                      data-testid="input-beat-bpm"
                      value={beatBpm}
                      onChange={(e) => setBeatBpm(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest">Тональность</Label>
                    <Select value={beatKey || "__none__"} onValueChange={(v) => setBeatKey(v === "__none__" ? "" : v)}>
                      <SelectTrigger className="rounded-none border-2 border-foreground bg-elevate-1 font-bold uppercase">
                        <SelectValue placeholder="Не указана" />
                      </SelectTrigger>
                      <SelectContent className="rounded-none border-2 border-foreground max-h-52 overflow-y-auto" position="popper" sideOffset={4} avoidCollisions>
                        <SelectItem value="__none__" className="font-bold">Не указана</SelectItem>
                        {MUSICAL_KEYS.map((k) => (
                          <SelectItem key={k} value={k} className="font-bold">{k}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Cover art — full width */}
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-xs font-black uppercase tracking-widest">Обложка</Label>
                    <input
                      ref={coverInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setSelectedCover(file);
                        setCoverPreview(URL.createObjectURL(file));
                      }}
                    />
                    <div
                      className="border-2 border-dashed border-foreground/20 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group flex items-center gap-4 p-4"
                      onClick={() => coverInputRef.current?.click()}
                    >
                      {coverPreview ? (
                        <>
                          <img
                            src={coverPreview}
                            alt="Обложка"
                            className="w-20 h-20 object-cover border-2 border-foreground shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-black uppercase italic text-sm truncate">
                              {selectedCover?.name}
                            </p>
                            <button
                              type="button"
                              className="text-[10px] font-bold text-primary uppercase tracking-widest mt-1 hover:underline"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCover(null);
                                setCoverPreview(null);
                                if (coverInputRef.current) coverInputRef.current.value = "";
                              }}
                            >
                              Удалить
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-20 h-20 bg-elevate-1 border-2 border-foreground flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                            <ImagePlus className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                          <div>
                            <p className="font-black uppercase italic text-sm">
                              Нажмите чтобы выбрать
                            </p>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">
                              JPG, PNG, WEBP · Рекомендуется 1:1
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Pricing — full width */}
                  <div className="space-y-3 md:col-span-2">
                    <Label className="text-xs font-black uppercase tracking-widest">Цены по тарифам (₽)</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {/* Base */}
                      <div className="space-y-1">
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Basic</p>
                        <Input
                          type="number"
                          min="0"
                          placeholder="500"
                          className="rounded-none border-2 border-foreground bg-elevate-1 font-bold"
                          data-testid="input-beat-price"
                          value={priceBase}
                          onChange={(e) => handleBasePriceChange(e.target.value)}
                        />
                        <p className="text-[9px] text-muted-foreground font-bold">× 1</p>
                      </div>
                      {/* Premium */}
                      <div className="space-y-1">
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Premium</p>
                        <Input
                          type="number"
                          min="0"
                          placeholder="авто"
                          className={`rounded-none border-2 bg-elevate-1 font-bold ${priceEdited.premium ? "border-primary" : "border-foreground"}`}
                          value={pricePremium}
                          onChange={(e) => {
                            setPricePremium(e.target.value);
                            setPriceEdited((p) => ({ ...p, premium: true }));
                          }}
                        />
                        <p className="text-[9px] text-muted-foreground font-bold">× 2 по умолчанию</p>
                      </div>
                      {/* Ultimate */}
                      <div className="space-y-1">
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Ultimate</p>
                        <Input
                          type="number"
                          min="0"
                          placeholder="авто"
                          className={`rounded-none border-2 bg-elevate-1 font-bold ${priceEdited.ultimate ? "border-primary" : "border-foreground"}`}
                          value={priceUltimate}
                          onChange={(e) => {
                            setPriceUltimate(e.target.value);
                            setPriceEdited((p) => ({ ...p, ultimate: true }));
                          }}
                        />
                        <p className="text-[9px] text-muted-foreground font-bold">× 3 по умолчанию</p>
                      </div>
                      {/* Exclusive */}
                      <div className="space-y-1">
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Exclusive</p>
                        <Input
                          type="number"
                          min="0"
                          placeholder="авто"
                          className={`rounded-none border-2 bg-elevate-1 font-bold ${priceEdited.exclusive ? "border-primary" : "border-foreground"}`}
                          value={priceExclusive}
                          onChange={(e) => {
                            setPriceExclusive(e.target.value);
                            setPriceEdited((p) => ({ ...p, exclusive: true }));
                          }}
                        />
                        <p className="text-[9px] text-muted-foreground font-bold">× 5 по умолчанию</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest">Описание</Label>
                  <Textarea
                    placeholder="Расскажите про настроение, энергетику или вдохновение..."
                    className="rounded-none border-2 border-foreground bg-elevate-1 font-bold h-24"
                    data-testid="textarea-beat-description"
                    value={beatDescription}
                    onChange={(e) => setBeatDescription(e.target.value)}
                  />
                </div>

                {/* Hidden file inputs */}
                <input ref={mp3InputRef} type="file" accept=".mp3" className="hidden" onChange={(e) => setSelectedMp3(e.target.files?.[0] ?? null)} />
                <input ref={wavInputRef} type="file" accept=".wav" className="hidden" onChange={(e) => setSelectedWav(e.target.files?.[0] ?? null)} />
                <input ref={stemsInputRef} type="file" accept=".zip" className="hidden" onChange={(e) => setSelectedStems(e.target.files?.[0] ?? null)} />

                <div className="space-y-3">
                  <Label className="text-xs font-black uppercase tracking-widest">Файлы</Label>

                  {/* MP3 */}
                  <div
                    className="flex items-center gap-3 border-2 border-foreground/30 hover:border-primary/60 hover:bg-primary/5 transition-all p-3 cursor-pointer group"
                    onClick={() => mp3InputRef.current?.click()}
                  >
                    <div className="w-8 h-8 bg-elevate-1 border-2 border-foreground flex items-center justify-center shrink-0">
                      <Music className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-widest">MP3 <span className="text-primary">·</span> Тегированный</p>
                      <p className="text-[10px] text-muted-foreground font-bold truncate mt-0.5">
                        {selectedMp3 ? selectedMp3.name : "Нажмите для выбора · .mp3"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {selectedMp3 ? (
                        <span className="text-[8px] font-black uppercase text-primary border border-primary px-1.5 py-0.5">Загружен</span>
                      ) : (
                        <span className="text-[8px] font-black uppercase text-muted-foreground border border-foreground/20 px-1.5 py-0.5">Basic</span>
                      )}
                      {selectedMp3 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMp3(null);
                            setSelectedWav(null);
                            setSelectedStems(null);
                            if (mp3InputRef.current) mp3InputRef.current.value = "";
                            if (wavInputRef.current) wavInputRef.current.value = "";
                            if (stemsInputRef.current) stemsInputRef.current.value = "";
                          }}
                        >
                          <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* WAV */}
                  <div
                    className={`flex items-center gap-3 border-2 p-3 transition-all ${selectedMp3 ? "border-foreground/30 hover:border-primary/60 hover:bg-primary/5 cursor-pointer group" : "border-foreground/10 opacity-40 cursor-not-allowed"}`}
                    onClick={() => selectedMp3 && wavInputRef.current?.click()}
                  >
                    <div className="w-8 h-8 bg-elevate-1 border-2 border-foreground flex items-center justify-center shrink-0">
                      <Music className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-widest">WAV <span className="text-primary">·</span> High Quality</p>
                      <p className="text-[10px] text-muted-foreground font-bold truncate mt-0.5">
                        {selectedWav ? selectedWav.name : selectedMp3 ? "Нажмите для выбора · .wav" : "Требуется MP3"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {selectedWav ? (
                        <span className="text-[8px] font-black uppercase text-primary border border-primary px-1.5 py-0.5">Загружен</span>
                      ) : (
                        <span className="text-[8px] font-black uppercase text-muted-foreground border border-foreground/20 px-1.5 py-0.5">Premium</span>
                      )}
                      {selectedWav && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedWav(null);
                            setSelectedStems(null);
                            if (wavInputRef.current) wavInputRef.current.value = "";
                            if (stemsInputRef.current) stemsInputRef.current.value = "";
                          }}
                        >
                          <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Stems / ZIP */}
                  <div
                    className={`flex items-center gap-3 border-2 p-3 transition-all ${selectedWav ? "border-foreground/30 hover:border-primary/60 hover:bg-primary/5 cursor-pointer group" : "border-foreground/10 opacity-40 cursor-not-allowed"}`}
                    onClick={() => selectedWav && stemsInputRef.current?.click()}
                  >
                    <div className="w-8 h-8 bg-elevate-1 border-2 border-foreground flex items-center justify-center shrink-0">
                      <Music className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-widest">Стемы <span className="text-primary">·</span> ZIP архив</p>
                      <p className="text-[10px] text-muted-foreground font-bold truncate mt-0.5">
                        {selectedStems ? selectedStems.name : selectedWav ? "Нажмите для выбора · .zip" : "Требуется WAV"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {selectedStems ? (
                        <span className="text-[8px] font-black uppercase text-primary border border-primary px-1.5 py-0.5">Загружен</span>
                      ) : (
                        <span className="text-[8px] font-black uppercase text-muted-foreground border border-foreground/20 px-1.5 py-0.5">Ultimate</span>
                      )}
                      {selectedStems && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedStems(null);
                            if (stemsInputRef.current) stemsInputRef.current.value = "";
                          }}
                        >
                          <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Tier availability preview */}
                  <div className="grid grid-cols-4 gap-2 pt-1">
                    {[
                      { name: "Basic",     unlocked: !!selectedMp3,   need: "MP3" },
                      { name: "Premium",   unlocked: !!selectedWav,   need: "WAV" },
                      { name: "Ultimate",  unlocked: !!selectedStems, need: "Стемы" },
                      { name: "Exclusive", unlocked: !!selectedStems, need: "Стемы" },
                    ].map((t) => (
                      <div
                        key={t.name}
                        className={`border-2 p-2 text-center transition-all ${t.unlocked ? "border-primary bg-primary/5" : "border-foreground/10 opacity-40"}`}
                      >
                        <p className="text-[9px] font-black uppercase tracking-widest">{t.name}</p>
                        <p className="text-[8px] font-bold text-muted-foreground mt-0.5">
                          {t.unlocked ? "Доступен" : `+ ${t.need}`}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {submitError && (
                  <p className="text-red-500 text-xs font-bold uppercase tracking-widest">{submitError}</p>
                )}

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeUpload}
                    className="flex-1 rounded-none h-14 border-2 border-foreground font-black uppercase italic shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                  >
                    Отмена
                  </Button>
                  <Button
                    type="submit"
                    disabled={createBeatMutation.isPending}
                    className="flex-1 rounded-none h-14 bg-primary text-background border-2 border-foreground font-black uppercase italic shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-60"
                  >
                    {createBeatMutation.isPending ? "Публикация..." : "Опубликовать"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteTarget !== null && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
              onClick={() => setDeleteTarget(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-background border-4 border-foreground p-8 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] text-center"
            >
              <div className="w-16 h-16 bg-destructive/10 border-2 border-destructive flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-8 h-8 text-destructive" />
              </div>
              <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-2">Внимание</h2>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-8">Удалить бит?</p>
              <div className="flex gap-4">
                <Button
                  onClick={() => setDeleteTarget(null)}
                  variant="outline"
                  className="flex-1 rounded-none h-12 border-2 border-foreground font-black uppercase italic shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                >
                  Нет
                </Button>
                <Button
                  onClick={() => {
                    deleteBeatMutation.mutate(deleteTarget);
                    setDeleteTarget(null);
                  }}
                  className="flex-1 rounded-none h-12 bg-destructive text-destructive-foreground border-2 border-foreground font-black uppercase italic shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all hover:bg-destructive/90"
                >
                  Да
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default Profile;
