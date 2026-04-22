import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ShoppingCart, Play, Pause, CheckCircle2, AlertCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCart, type LicenseCode } from "@/context/CartContext";
import { usePlayer } from "@/context/PlayerContext";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { checkout, downloadLicense, type CheckoutResultItem } from "@/api/orders";
import { pluralize } from "@/lib/pluralize";

export default function Cart() {
  const { items, removeFromCart, updateLicense, clearCart, totalPrice } = useCart();
  const { play, isPlaying, isActive } = usePlayer();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [successItems, setSuccessItems] = useState<CheckoutResultItem[]>([]);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  const checkoutMutation = useMutation({
    mutationFn: () =>
      checkout(items.map((i) => ({ beat_id: i.beat.id, license_code: i.licenseCode }))),
    onSuccess: (data) => {
      setSuccessItems(data.items);
      setOrderNumber(data.order_number);
      clearCart();
      // Refresh beats lists so exclusive-sold beats disappear
      queryClient.invalidateQueries({ queryKey: ["beats"] });
      queryClient.invalidateQueries({ queryKey: ["latest-beats"] });
    },
  });

  const getPrice = (item: (typeof items)[0]) => {
    const license = item.beat.licenses?.find((l) => l.code === item.licenseCode);
    return license ? `${license.price} ₽` : "—";
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8 pb-32">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl font-black uppercase italic tracking-tighter flex items-center gap-3">
            <ShoppingCart className="w-8 h-8" />
            Корзина
          </h2>
          {items.length > 0 && (
            <Button
              variant="outline"
              onClick={clearCart}
              className="rounded-none border-2 border-foreground font-black uppercase text-xs"
            >
              Очистить
            </Button>
          )}
        </div>

        {/* Success screen */}
        <AnimatePresence>
          {successItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 border-2 border-foreground bg-card shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
            >
              <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-2">Покупка оформлена!</h3>
              {orderNumber && (
                <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest mb-1">
                  Заказ {orderNumber}
                </p>
              )}
              <p className="text-xs font-bold uppercase text-muted-foreground tracking-widest mb-6">
                Скачайте лицензии ниже
              </p>
              <div className="inline-block text-left border-2 border-foreground p-4 mb-6 space-y-3 min-w-64">
                {successItems.map((si, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-black uppercase">
                        {si.beat_name}
                        {si.license_code === "exclusive" && (
                          <span className="ml-2 text-primary text-[10px] font-black border border-primary px-1 py-0.5">ЭКСКЛЮЗИВ</span>
                        )}
                      </p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        {si.license_code} — {si.price} ₽
                      </p>
                    </div>
                    <button
                      onClick={() => downloadLicense(si.license_download_url, `${si.beat_name}_${si.license_code}_license.pdf`)}
                      className="shrink-0 flex items-center gap-1 border-2 border-foreground px-2 py-1 text-[10px] font-black uppercase hover:bg-foreground hover:text-background transition-colors cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      Лицензия
                    </button>
                  </div>
                ))}
              </div>
              <br />
              <Button
                onClick={() => { setSuccessItems([]); setOrderNumber(null); navigate("/"); }}
                className="rounded-none border-2 border-foreground font-black uppercase text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                На главную
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {items.length === 0 && successItems.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-foreground/20">
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="font-black uppercase italic text-muted-foreground tracking-widest mb-6">
              Корзина пуста
            </p>
            <Button
              onClick={() => navigate("/")}
              className="rounded-none border-2 border-foreground font-black uppercase text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              Смотреть биты
            </Button>
          </div>
        ) : successItems.length === 0 ? (
          <>
            <div className="space-y-4">
              {items.map((item, i) => (
                <motion.div
                  key={item.beat.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="rounded-none border-2 border-foreground p-4 flex items-center gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(255,51,102,1)] transition-all">
                    {/* Cover + play button stacked */}
                    <div className="relative w-12 h-12 shrink-0 border-2 border-foreground overflow-hidden">
                      {item.beat.cover_url
                        ? <img src={item.beat.cover_url} alt={item.beat.name} className="absolute inset-0 w-full h-full object-cover" />
                        : <div className="absolute inset-0 bg-linear-to-br from-muted to-foreground/20" />
                      }
                      <button
                        className="absolute inset-0 flex items-center justify-center bg-background/40 hover:bg-background/60 transition-colors"
                        onClick={() => play(item.beat)}
                      >
                        {isActive(item.beat.id) && isPlaying ? (
                          <Pause className="w-5 h-5 fill-foreground text-foreground drop-shadow" />
                        ) : (
                          <Play className="w-5 h-5 fill-foreground text-foreground drop-shadow" />
                        )}
                      </button>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-black uppercase italic tracking-tight truncate">
                        {item.beat.name}
                      </h3>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest truncate">
                        {item.beat.user?.name ?? "Unknown"}
                        {item.beat.genre ? ` • ${item.beat.genre.name}` : ""}
                        {item.beat.bpm ? ` • ${item.beat.bpm} BPM` : ""}
                      </p>
                    </div>

                    <Select
                      value={item.licenseCode}
                      onValueChange={(v) => updateLicense(item.beat.id, v as LicenseCode)}
                    >
                      <SelectTrigger className="w-28 h-8 rounded-none border-2 border-foreground font-black uppercase text-[9px] shrink-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-none border-2 border-foreground">
                        {(["base", "premium", "ultimate", "exclusive"] as const).map((code) => {
                          const license = item.beat.licenses?.find((l) => l.code === code);
                          if (!license) return null;
                          const allAssets = item.beat.licenses?.flatMap((l) => l.assets ?? []) ?? [];
                          const fileMap = {
                            hasMp3: allAssets.some((a) => a.type === "mp3"),
                            hasWav: allAssets.some((a) => a.type === "wav"),
                            hasStems: allAssets.some((a) => a.type === "trackout_zip"),
                          };
                          const available =
                            code === "base" ? fileMap.hasMp3 :
                            code === "premium" ? fileMap.hasWav :
                            fileMap.hasStems;
                          return available ? (
                            <SelectItem
                              key={code}
                              value={code}
                              className="font-bold uppercase text-[10px]"
                            >
                              {code} — {license.price} ₽
                            </SelectItem>
                          ) : null;
                        })}
                      </SelectContent>
                    </Select>

                    <span className="font-black text-lg shrink-0">{getPrice(item)}</span>

                    <Button
                      size="icon"
                      variant="ghost"
                      className="shrink-0 hover:text-red-500 hover:bg-red-500/10"
                      onClick={() => removeFromCart(item.beat.id)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>

            <Card className="rounded-none border-2 border-foreground p-6 mt-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              {checkoutMutation.isError && (
                <div className="flex items-center gap-2 mb-4 p-3 border-2 border-destructive bg-destructive/10">
                  <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
                  <p className="text-xs font-bold text-destructive uppercase">
                    {(checkoutMutation.error as Error)?.message ?? "Ошибка при оформлении"}
                  </p>
                </div>
              )}
              {/* Warn if exclusive in cart */}
              {items.some((i) => i.licenseCode === "exclusive") && (
                <div className="flex items-start gap-2 mb-4 p-3 border-2 border-primary bg-primary/10">
                  <AlertCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-xs font-bold text-primary uppercase leading-relaxed">
                    В корзине есть эксклюзивный тариф — бит будет снят с продажи после покупки.
                  </p>
                </div>
              )}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    {items.length} {pluralize(items.length, "товар", "товара", "товаров")}
                  </p>
                  <p className="text-3xl font-black">{totalPrice.toFixed(2)} ₽</p>
                </div>
                <Button
                  onClick={() => checkoutMutation.mutate()}
                  disabled={checkoutMutation.isPending}
                  className="rounded-none border-2 border-foreground font-black uppercase text-sm h-12 px-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all disabled:opacity-60"
                >
                  {checkoutMutation.isPending ? "Обработка..." : "Оформить заказ"}
                </Button>
              </div>
            </Card>
          </>
        ) : null}
      </div>
    </div>
  );
}
