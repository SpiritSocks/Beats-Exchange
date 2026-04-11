import { useState } from "react";
import { ShoppingCart, Crown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Beat } from "@/api/types";
import type { LicenseCode } from "@/context/CartContext";

type LicensePickerDialogProps = {
  beat: Beat | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (beat: Beat, license: LicenseCode) => void;
};

type TierInfo = {
  code: LicenseCode;
  name: string;
  priceLabel: string;
  popular?: boolean;
  files: { label: string; disabled?: boolean }[];
  license: { label: string; disabled?: boolean }[];
  contract: string;
};

const TIERS: TierInfo[] = [
  {
    code: "base",
    name: "Basic",
    priceLabel: "base",
    files: [
      { label: "MP3 (тегированный)" },
      { label: "WAV", disabled: true },
      { label: "Стемы / ZIP", disabled: true },
    ],
    license: [
      { label: "Неэксклюзивная" },
      { label: "До 10 000 стримов" },
      { label: "До 5 000 продаж" },
      { label: "Коммерческое использование", disabled: true },
    ],
    contract: "Стандартный шаблон PDF",
  },
  {
    code: "premium",
    name: "Premium",
    priceLabel: "premium",
    popular: true,
    files: [
      { label: "MP3 (без тегов)" },
      { label: "WAV (High Quality)" },
      { label: "Стемы / ZIP", disabled: true },
    ],
    license: [
      { label: "Неэксклюзивная" },
      { label: "До 100 000 стримов" },
      { label: "До 50 000 продаж" },
      { label: "Коммерческое использование" },
    ],
    contract: "Расширенный контракт PDF",
  },
  {
    code: "ultimate",
    name: "Ultimate",
    priceLabel: "ultimate",
    files: [
      { label: "MP3 (без тегов)" },
      { label: "WAV (High Quality)" },
      { label: "Стемы / ZIP архив" },
    ],
    license: [
      { label: "Неэксклюзивная" },
      { label: "Безлимитные стримы" },
      { label: "Безлимитные продажи" },
      { label: "Коммерческое использование" },
    ],
    contract: "Полный контракт PDF",
  },
  {
    code: "exclusive",
    name: "Exclusive",
    priceLabel: "exclusive",
    files: [
      { label: "MP3 (без тегов)" },
      { label: "WAV (High Quality)" },
      { label: "Стемы / ZIP архив" },
    ],
    license: [
      { label: "Полная эксклюзивность" },
      { label: "Бит снимается с продажи" },
      { label: "Передача авторских прав" },
      { label: "Коммерческое использование" },
    ],
    contract: "Эксклюзивный контракт PDF",
  },
];

export default function LicensePickerDialog({
  beat,
  open,
  onOpenChange,
  onSelect,
}: LicensePickerDialogProps) {
  const [selected, setSelected] = useState<LicenseCode>("base");

  if (!beat) return null;

  const getPrice = (code: LicenseCode) => {
    const license = beat.licenses?.find((l) => l.code === code);
    return license ? `${license.price} ₽` : "—";
  };

  const handleConfirm = () => {
    onSelect(beat, selected);
    onOpenChange(false);
    setSelected("base");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl rounded-none border-2 border-foreground bg-background p-0 gap-0 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <DialogHeader className="p-6 pb-4 border-b-2 border-foreground/10">
          <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter">
            Выберите лицензию
          </DialogTitle>
          <DialogDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            {beat.name} — {beat.user?.name ?? "Неизвестный"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 p-4">
          {TIERS.map((tier) => {
            const isSelected = selected === tier.code;
            return (
              <button
                key={tier.code}
                type="button"
                onClick={() => setSelected(tier.code)}
                className={cn(
                  "relative text-left p-4 border-2 transition-all flex flex-col",
                  isSelected
                    ? "border-primary bg-primary/5 shadow-[4px_4px_0px_0px_rgba(255,51,102,1)] -translate-x-0.5 -translate-y-0.5"
                    : "border-foreground/20 hover:border-foreground/40"
                )}
              >
                {tier.popular && (
                  <Badge className="absolute -top-2.5 left-3 rounded-none bg-primary text-background font-black uppercase text-[8px] px-2 border-0">
                    Популярный
                  </Badge>
                )}

                <h3 className="text-lg font-black uppercase tracking-tight">
                  {tier.name}
                </h3>
                <p className="text-xl font-black text-primary mb-3">
                  {getPrice(tier.code)}
                </p>

                <div className="mb-3">
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1.5">
                    Файлы
                  </p>
                  <ul className="space-y-1">
                    {tier.files.map((f) => (
                      <li
                        key={f.label}
                        className={cn(
                          "text-[11px] font-bold flex items-center gap-1.5",
                          f.disabled && "text-muted-foreground/40"
                        )}
                      >
                        <span
                          className={cn(
                            "w-1.5 h-1.5 rounded-full shrink-0",
                            f.disabled ? "bg-muted-foreground/20" : "bg-primary"
                          )}
                        />
                        {f.label}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-3">
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1.5">
                    Лицензия
                  </p>
                  <ul className="space-y-1">
                    {tier.license.map((l) => (
                      <li
                        key={l.label}
                        className={cn(
                          "text-[11px] font-bold flex items-center gap-1.5",
                          l.disabled && "text-muted-foreground/40"
                        )}
                      >
                        <span
                          className={cn(
                            "w-1.5 h-1.5 rounded-full shrink-0",
                            l.disabled ? "bg-muted-foreground/20" : "bg-primary"
                          )}
                        />
                        {l.label}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto">
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1.5">
                    Контракт
                  </p>
                  <p className="text-[11px] font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    {tier.contract}
                  </p>
                </div>

                {tier.code === "exclusive" && (
                  <div className="mt-3 pt-2 border-t border-foreground/10">
                    <p className="text-[10px] font-bold text-primary italic flex items-center gap-1">
                      <Crown className="w-3 h-3" />
                      Фиксированная цена продюсера
                    </p>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="p-4 pt-0 flex items-center justify-between">
          <p className="text-sm font-bold">
            Выбрано:{" "}
            <span className="font-black uppercase text-primary">
              {TIERS.find((t) => t.code === selected)?.name}
            </span>{" "}
            — <span className="font-black">{getPrice(selected)}</span>
          </p>
          <Button
            onClick={handleConfirm}
            className="rounded-none border-2 border-foreground font-black uppercase text-xs h-10 px-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            В корзину
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
