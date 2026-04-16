import { apiFetch } from "./client";
import type { Beat, PaginatedResponse, Producer } from "./types";

export function fetchProducers(page = 1, search = ""): Promise<PaginatedResponse<Producer>> {
  const params = new URLSearchParams({ page: String(page) });
  if (search) params.set("search", search);
  return apiFetch(`/api/producers?${params}`);
}

export function fetchProducer(id: number): Promise<{ producer: Producer; beats: Beat[] }> {
  return apiFetch(`/api/producers/${id}`);
}
