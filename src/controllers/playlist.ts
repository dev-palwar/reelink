import { authApiClient } from "@/lib/api-client";

export const createPlaylist = async (name: string) => {
  try {
    const response = await authApiClient.post("/api/playlist/create", {
      playlistName: name,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating playlist:", error);
    throw error;
  }
};

export const getPlaylists = async () => {
  try {
    const response = await authApiClient.get("/api/playlist/all");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching playlists:", error);
    throw error;
  }
};

export const addToPlaylist = async (playlistId: string, movieId: string) => {
  try {
    const response = await authApiClient.post("/api/playlist/add", {
      playlistId,
      movieId,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding to playlist:", error);
    throw error;
  }
};
