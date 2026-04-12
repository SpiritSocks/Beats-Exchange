import { motion } from "framer-motion";
import { Play, Pause, ShoppingCart, Check, SlidersHorizontal, X, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { searchBeats } from "@/api/beats";
import { fetchGenres } from "@/api/genres";
import { usePlayer } from "@/context/PlayerContext";
import { useLikes } from "@/context/LikesContext";
import type { Beat, Genre, PaginatedResponse } from "@/api/types";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import LicensePickerDialog from "@/components/LicensePickerDialog";
import { pluralize } from "@/lib/pluralize";

const MUSICAL_KEYS = [
  "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
  "Cm", "C#m", "Dm", "D#m", "Em", "Fm", "F#m", "Gm", "G#m", "Am", "A#m", "Bm",
];

export default function Search() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const { play, isPlaying, isActive } = usePlayer();
  const { addToCart, isInCart } = useCart();
  const { isLiked, toggle: toggleLike } = useLikes();
  const [pickerBeat, setPickerBeat] = useState<Beat | null>(null);
  const [page, setPage] = useState(1);

  const ANY = "__any__"; // sentinel for "no filter selected" — Radix requires non-empty value

  // Filter state
  const [genreId, setGenreId]     = useState<string>(ANY);
  const [bpmMin, setBpmMin]       = useState("");
  const [bpmMax, setBpmMax]       = useState("");
  const [key, setKey]             = useState<string>(ANY);
  const [priceMin, setPriceMin]   = useState("");
  const [priceMax, setPriceMax]   = useState("");
  const [sort, setSort]           = useState<"newest" | "oldest">("newest");

  // Applied filters (only sent to API after apply)
  const [applied, setApplied] = useState({
    genreId: ANY, bpmMin: "", bpmMax: "", key: ANY, priceMin: "", priceMax: "", sort: "newest" as "newest" | "oldest",
  });

  const applyFilters = () => {
    setApplied({ genreId, bpmMin, bpmMax, key, priceMin, priceMax, sort });
    setPage(1);
  };

  const resetFilters = () => {
    setGenreId(ANY); setBpmMin(""); setBpmMax(""); setKey(ANY); setPriceMin(""); setPriceMax(""); setSort("newest");
    setApplied({ genreId: ANY, bpmMin: "", bpmMax: "", key: ANY, priceMin: "", priceMax: "", sort: "newest" });
    setPage(1);
  };

  const activeFilterCount = [
    applied.genreId !== ANY ? applied.genreId : "",
    applied.bpmMin,
    applied.bpmMax,
    applied.key !== ANY ? applied.key : "",
    applied.priceMin,
    applied.priceMax,
  ].filter(Boolean).length;

  const { data } = useQuery<PaginatedResponse<Beat>>({
    queryKey: ["beats", "search", q, page, applied],
    queryFn: () => searchBeats({
      q,
      page,
      genre_id:  applied.genreId !== ANY  ? Number(applied.genreId)  : undefined,
      bpm_min:   applied.bpmMin           ? Number(applied.bpmMin)   : undefined,
      bpm_max:   applied.bpmMax           ? Number(applied.bpmMax)   : undefined,
      key:       applied.key !== ANY      ? applied.key              : undefined,
      price_min: applied.priceMin         ? Number(applied.priceMin) : undefined,
      price_max: applied.priceMax         ? Number(applied.priceMax) : undefined,
      sort:      applied.sort,
    }),
    enabled: !!q,
  });

  const { data: genres = [] } = useQuery<Genre[]>({
    queryKey: ["genres"],
    queryFn: fetchGenres,
  });

  const beats = data?.data ?? [];

  const getBasePrice = (beat: Beat) => {
    const base = beat.licenses?.find((l) => l.code === "base");
    return base ? `${base.price} ₽` : "—";
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-32">
      <div className="max-w-screen-2xl mx-auto px-6 pt-8">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-4xl font-black uppercase italic tracking-tighter">
            Результаты по запросу "{q}"
          </h2>
          {data && (
            <p className="text-muted-foreground font-bold uppercase text-xs tracking-widest mt-1">
              Найдено: {data.total} {pluralize(data.total, "результат", "результата", "результатов")}
            </p>
          )}
        </div>

        <div className="flex gap-8 items-start">
          {/* ── Sidebar filters ── */}
          <aside className="w-64 shrink-0 border-2 border-foreground bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sticky top-4">
            <div className="flex items-center justify-between px-4 py-3 border-b-2 border-foreground">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                <span className="font-black uppercase text-xs tracking-widest">Фильтры</span>
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 rounded-none bg-primary text-background text-[9px] font-black flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              {activeFilterCount > 0 && (
                <button onClick={resetFilters} className="text-[9px] font-black uppercase text-muted-foreground hover:text-destructive flex items-center gap-1">
                  <X className="w-3 h-3" /> Сбросить
                </button>
              )}
            </div>

            <div className="p-4 space-y-5">
              {/* Sort */}
              <div className="space-y-1.5">
                <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Сортировка</Label>
                <Select value={sort} onValueChange={(v) => setSort(v as "newest" | "oldest")}>
                  <SelectTrigger className="rounded-none border-2 border-foreground h-8 text-xs font-bold uppercase">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-none border-2 border-foreground">
                    <SelectItem value="newest" className="text-xs font-bold uppercase">Сначала новые</SelectItem>
                    <SelectItem value="oldest" className="text-xs font-bold uppercase">Сначала старые</SelectItem>
                  </SelectContent>

                </Select>
              </div>

              {/* Genre */}
              <div className="space-y-1.5">
                <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Жанр</Label>
                <Select value={genreId} onValueChange={setGenreId}>
                  <SelectTrigger className="rounded-none border-2 border-foreground h-8 text-xs font-bold uppercase">
                    <SelectValue placeholder="Любой" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none border-2 border-foreground">
                    <SelectItem value={ANY} className="text-xs font-bold uppercase">Любой</SelectItem>
                    {genres.map((g) => (
                      <SelectItem key={g.id} value={String(g.id)} className="text-xs font-bold uppercase">
                        {g.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* BPM */}
              <div className="space-y-1.5">
                <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">BPM</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="От"
                    min={40} max={300}
                    value={bpmMin}
                    onChange={(e) => setBpmMin(e.target.value)}
                    className="rounded-none border-2 border-foreground h-8 text-xs font-bold w-full"
                  />
                  <span className="text-muted-foreground font-black text-xs shrink-0">—</span>
                  <Input
                    type="number"
                    placeholder="До"
                    min={40} max={300}
                    value={bpmMax}
                    onChange={(e) => setBpmMax(e.target.value)}
                    className="rounded-none border-2 border-foreground h-8 text-xs font-bold w-full"
                  />
                </div>
              </div>

              {/* Key */}
              <div className="space-y-1.5">
                <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Тональность</Label>
                <Select value={key} onValueChange={setKey}>
                  <SelectTrigger className="rounded-none border-2 border-foreground h-8 text-xs font-bold uppercase">
                    <SelectValue placeholder="Любая" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none border-2 border-foreground max-h-48">
                    <SelectItem value={ANY} className="text-xs font-bold">Любая</SelectItem>
                    {MUSICAL_KEYS.map((k) => (
                      <SelectItem key={k} value={k} className="text-xs font-bold">
                        {k}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price */}
              <div className="space-y-1.5">
                <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Цена (₽)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="От"
                    min={0}
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    className="rounded-none border-2 border-foreground h-8 text-xs font-bold w-full"
                  />
                  <span className="text-muted-foreground font-black text-xs shrink-0">—</span>
                  <Input
                    type="number"
                    placeholder="До"
                    min={0}
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    className="rounded-none border-2 border-foreground h-8 text-xs font-bold w-full"
                  />
                </div>
              </div>

              {/* Apply */}
              <Button
                onClick={applyFilters}
                className="w-full rounded-none border-2 border-foreground font-black uppercase text-xs h-10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
              >
                Применить
              </Button>
            </div>
          </aside>

          {/* ── Results ── */}
          <div className="flex-1 min-w-0">
            {beats.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed border-foreground/20">
                <p className="font-black uppercase italic text-muted-foreground tracking-widest">
                  Ничего не найдено
                </p>
                {activeFilterCount > 0 && (
                  <button onClick={resetFilters} className="mt-3 text-xs font-black uppercase text-primary hover:underline">
                    Сбросить фильтры
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                {beats.map((beat, i) => (
                  <motion.div
                    key={beat.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Card className="group relative rounded-none border-2 border-foreground bg-elevate-1 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0px_0px_rgba(255,51,102,0.3)] transition-all cursor-pointer overflow-hidden">
                      <div className="aspect-square relative overflow-hidden bg-muted">
                        {beat.cover_url && (
                          <img src={beat.cover_url} alt={beat.name} className="absolute inset-0 w-full h-full object-cover" />
                        )}
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent z-10" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                          <Button
                            size="icon"
                            className="rounded-full w-12 h-12 bg-primary border-2 border-foreground scale-90 group-hover:scale-100 transition-transform"
                            onClick={() => play(beat)}
                          >
                            {isActive(beat.id) && isPlaying
                              ? <Pause className="w-6 h-6 fill-current ml-0.5" />
                              : <Play  className="w-6 h-6 fill-current ml-0.5" />
                            }
                          </Button>
                        </div>
                        {/* Like */}
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleLike(beat.id); }}
                          className="absolute top-2 left-2 z-20 w-7 h-7 flex items-center justify-center bg-background/60 hover:bg-primary/90 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Heart className={`w-4 h-4 transition-colors ${isLiked(beat.id) ? "fill-primary text-primary" : "text-foreground"}`} />
                        </button>
                        <div className="absolute top-2 right-2 z-20 flex flex-col gap-1">
                          {beat.genre && (
                            <Badge className="rounded-none border border-foreground bg-white text-black font-black uppercase text-[8px] flex justify-center">
                              {beat.genre.name}
                            </Badge>
                          )}
                          {beat.bpm && (
                            <Badge className="rounded-none border border-foreground bg-primary font-black uppercase text-[8px]">
                              {beat.bpm} BPM
                            </Badge>
                          )}
                          {beat.key && (
                            <Badge className="rounded-none border border-foreground bg-foreground text-background font-black uppercase text-[8px]">
                              {beat.key}
                            </Badge>
                          )}
                        </div>
                        <div className="absolute bottom-2 left-2 right-2 z-20">
                          <h3 className="text-sm font-black text-white uppercase italic tracking-tight truncate">{beat.name}</h3>
                          <p className="text-white/70 text-[10px] font-bold uppercase tracking-wider truncate">{beat.user?.name ?? "Unknown"}</p>
                        </div>
                      </div>
                      <div className="p-2.5 flex items-center justify-between bg-white text-black border-t-2 border-foreground">
                        <span className="text-sm font-black">{getBasePrice(beat)}</span>
                        <Button
                          size="sm"
                          className="rounded-none font-bold uppercase text-[9px] h-7 px-3"
                          onClick={(e) => { e.stopPropagation(); setPickerBeat(beat); }}
                          disabled={isInCart(beat.id)}
                        >
                          {isInCart(beat.id) ? <Check className="w-3 h-3" /> : <ShoppingCart className="w-3 h-3" />}
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {data && data.last_page > 1 && (
              <div className="flex justify-center gap-4 mt-12">
                <Button
                  variant="outline"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="rounded-none border-2 border-foreground font-black uppercase text-xs"
                >
                  Назад
                </Button>
                <span className="flex items-center font-black uppercase text-xs tracking-widest">
                  Стр. {data.current_page} из {data.last_page}
                </span>
                <Button
                  variant="outline"
                  disabled={page >= data.last_page}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-none border-2 border-foreground font-black uppercase text-xs"
                >
                  Далее
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <LicensePickerDialog
        beat={pickerBeat}
        open={!!pickerBeat}
        onOpenChange={(open) => !open && setPickerBeat(null)}
        onSelect={(beat, license) => addToCart(beat, license)}
      />
    </div>
  );
}
