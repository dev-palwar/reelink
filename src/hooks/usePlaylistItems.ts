import { useQuery } from "@tanstack/react-query";
import { authApiClient } from "@/lib/api-client";

export function usePlaylistItems() {
  return useQuery({
    queryKey: ["playlist-items"],
    queryFn: async () => {
      const response = await authApiClient.get("/api/playlist/items/all");
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}
