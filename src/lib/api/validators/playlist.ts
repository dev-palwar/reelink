import { z } from "zod";

export const createPlaylistSchema = z.object({
  playlistName: z
    .string()
    .min(1, "Playlist name is required")
    .max(100, "Playlist name too long"),
});
