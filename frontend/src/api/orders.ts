import { apiFetch } from "./client";

export interface CheckoutItem {
  beat_id: number;
  license_code: string;
}

export interface CheckoutResult {
  message: string;
  items: {
    beat_id: number;
    beat_name: string;
    license_code: string;
    price: number;
  }[];
}

export function checkout(items: CheckoutItem[]): Promise<CheckoutResult> {
  return apiFetch("/api/orders/checkout", {
    method: "POST",
    body: JSON.stringify({ items }),
  });
}
