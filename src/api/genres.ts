import { apiFetch } from "./client";
import type { Beat, Genre } from "./types";

export function fetchGenres(): Promise<Genre[]> {
  return apiFetch("/api/genres");
}

export function fetchGenre(id: number): Promise<{ genre: Genre; beats: Beat[] }> {
  return apiFetch(`/api/genres/${id}`);
}
