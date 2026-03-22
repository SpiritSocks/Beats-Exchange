import { apiFetch } from "./client";
import type { Beat, PaginatedResponse, Producer } from "./types";

export function fetchProducers(page = 1): Promise<PaginatedResponse<Producer>> {
  return apiFetch(`/api/producers?page=${page}`);
}

export function fetchProducer(id: number): Promise<{ producer: Producer; beats: Beat[] }> {
  return apiFetch(`/api/producers/${id}`);
}
