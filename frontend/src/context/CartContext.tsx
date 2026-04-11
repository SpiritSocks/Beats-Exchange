import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { Beat } from "@/api/types";

type CartItem = {
  beat: Beat;
  licenseCode: "base" | "premium" | "exclusive";
};

type CartContextType = {
  items: CartItem[];
  addToCart: (beat: Beat, licenseCode?: "base" | "premium" | "exclusive") => void;
  removeFromCart: (beatId: number) => void;
  clearCart: () => void;
  isInCart: (beatId: number) => boolean;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | null>(null);

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem("cart");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  localStorage.setItem("cart", JSON.stringify(items));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart);

  const addToCart = useCallback((beat: Beat, licenseCode: "base" | "premium" | "exclusive" = "base") => {
    setItems((prev) => {
      if (prev.some((item) => item.beat.id === beat.id)) return prev;
      const next = [...prev, { beat, licenseCode }];
      saveCart(next);
      return next;
    });
  }, []);

  const removeFromCart = useCallback((beatId: number) => {
    setItems((prev) => {
      const next = prev.filter((item) => item.beat.id !== beatId);
      saveCart(next);
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    saveCart([]);
  }, []);

  const isInCart = useCallback((beatId: number) => {
    return items.some((item) => item.beat.id === beatId);
  }, [items]);

  const totalPrice = items.reduce((sum, item) => {
    const license = item.beat.licenses?.find((l) => l.code === item.licenseCode);
    return sum + (license ? parseFloat(license.price) : 0);
  }, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, isInCart, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
