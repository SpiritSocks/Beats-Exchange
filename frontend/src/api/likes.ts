import { apiFetch } from "./client";
import type { Beat } from "./types";

export function fetchLikedIds(): Promise<{ beat_ids: number[] }> {
  return apiFetch("/api/likes");
}

export function fetchLikedBeats(): Promise<Beat[]> {
  return apiFetch("/api/likes/beats");
}

export function toggleLike(beatId: number): Promise<{ liked: boolean; beat_id: number }> {
  return apiFetch(`/api/beats/${beatId}/like`, { method: "POST" });
}
