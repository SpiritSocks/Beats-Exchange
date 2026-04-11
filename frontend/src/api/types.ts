export type User = {
  id: number;
  name: string;
  email: string;
  role: number;
  avatar: string | null;
  about: string | null;
  balance: string | null;
};

export type Genre = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
};

export type BeatAsset = {
  id: number;
  beat_license_id: number;
  type: "mp3" | "wav" | "trackout_zip";
  disk: string;
  path: string;
  original_name: string;
  mime: string;
  size_bytes: number;
};

export type BeatLicense = {
  id: number;
  beat_id: number;
  code: "base" | "premium" | "exclusive";
  price: string;
  is_active: boolean;
  assets: BeatAsset[];
};

export type Beat = {
  id: number;
  name: string;
  description: string | null;
  bpm: number | null;
  key: string | null;
  genre_id: number | null;
  user_id: number;
  created_at: string;
  updated_at: string;
  genre: Genre | null;
  user: User | null;
  licenses: BeatLicense[];
};

export type PaginatedResponse<T> = {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export type Producer = User;
