export interface PlaylistItem {
  id: string;
  movieId: string;
  position: number;
  notes: string;
  addedAt: string;
}

export interface PlaylistData {
  id: string;
  name: string;
  description: string;
  isDefault: boolean;
  isPublic: boolean;
  items: PlaylistItem[];
}
