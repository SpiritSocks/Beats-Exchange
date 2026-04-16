import { apiFetch } from "./client";
import type { User } from "./types";

export function fetchFollowedIds(): Promise<{ producer_ids: number[] }> {
  return apiFetch("/api/follows");
}

export function fetchFollowedProducers(): Promise<User[]> {
  return apiFetch("/api/follows/producers");
}

export function toggleFollow(producerId: number): Promise<{ following: boolean; producer_id: number }> {
  return apiFetch(`/api/producers/${producerId}/follow`, { method: "POST" });
}
