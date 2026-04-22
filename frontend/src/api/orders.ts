import { apiFetch } from "./client";

export interface CheckoutItem {
  beat_id: number;
  license_code: string;
}

export interface CheckoutResultItem {
  beat_id: number;
  beat_name: string;
  license_code: string;
  price: number;
  order_item_id: number;
  license_download_url: string;
}

export interface CheckoutResult {
  message: string;
  order_number: string;
  items: CheckoutResultItem[];
}

export interface MyPurchase {
  order_number: string;
  order_id: number;
  order_item_id: number;
  beat_name: string;
  beat_cover: string | null;
  license_code: string;
  price: number;
  purchased_at: string;
  license_download_url: string | null;
}

export function fetchMyOrders(): Promise<MyPurchase[]> {
  return apiFetch("/api/orders");
}

export function checkout(items: CheckoutItem[]): Promise<CheckoutResult> {
  return apiFetch("/api/orders/checkout", {
    method: "POST",
    body: JSON.stringify({ items }),
  });
}

export async function downloadLicense(url: string, filename: string): Promise<void> {
  const token = localStorage.getItem("authToken");
  const res = await fetch(url, {
    credentials: "include",
    headers: {
      Accept: "application/octet-stream",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) throw new Error(`Ошибка загрузки: ${res.status}`);
  const blob = await res.blob();
  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(blobUrl);
}
