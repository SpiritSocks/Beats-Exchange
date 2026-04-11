import { apiFetch, API_BASE_URL } from "./client";
import type { Beat, BeatAsset, PaginatedResponse } from "./types";

export function fetchLatestBeats(): Promise<Beat[]> {
  return apiFetch("/api/beats/latest");
}

export function fetchMyBeats(): Promise<Beat[]> {
  return apiFetch("/api/beats");
}

export function fetchBeat(id: number): Promise<Beat> {
  return apiFetch(`/api/beats/${id}`);
}

export function createBeat(payload: {
  name: string;
  description?: string;
  bpm?: number;
  key?: string;
  genre_id?: number;
  prices?: { base?: number; premium?: number; exclusive?: number };
}): Promise<Beat> {
  return apiFetch("/api/beats", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getStreamUrl(beat: Beat): string | null {
  const baseLicense = beat.licenses?.find((l) => l.code === "base");
  const asset =
    baseLicense?.assets?.find((a: BeatAsset) => a.type === "mp3") ??
    baseLicense?.assets?.find((a: BeatAsset) => a.type === "wav");
  if (!asset) return null;
  return `${API_BASE_URL}/api/stream/${asset.id}`;
}

export function searchBeats(params: {
  q?: string;
  genre_id?: number;
  bpm_min?: number;
  bpm_max?: number;
  page?: number;
}): Promise<PaginatedResponse<Beat>> {
  const searchParams = new URLSearchParams();
  if (params.q) searchParams.set("q", params.q);
  if (params.genre_id) searchParams.set("genre_id", String(params.genre_id));
  if (params.bpm_min) searchParams.set("bpm_min", String(params.bpm_min));
  if (params.bpm_max) searchParams.set("bpm_max", String(params.bpm_max));
  if (params.page) searchParams.set("page", String(params.page));
  return apiFetch(`/api/beats/search?${searchParams.toString()}`);
}

export function deleteBeat(id: number): Promise<{ message: string }> {
  return apiFetch(`/api/beats/${id}`, { method: "DELETE" });
}

export function uploadBeatAsset(
  beatId: number,
  payload: { license_code: string; type: string; file: File }
): Promise<unknown> {
  const formData = new FormData();
  formData.append("license_code", payload.license_code);
  formData.append("type", payload.type);
  formData.append("file", payload.file);

  const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

  return fetch(`${baseUrl}/api/beats/${beatId}/assets/upload`, {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  }).then(async (res) => {
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  });
}
