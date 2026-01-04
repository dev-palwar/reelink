import { PlaylistData } from "@/app/playlists/interface";
import { Playlist } from "@/generated/prisma/client";
import { authApiClient } from "@/lib/api-client";
import { AxiosError } from "axios";

export const createPlaylist = async (name: string) => {
  try {
    const response = await authApiClient.post("/api/playlist/create", {
      playlistName: name,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      (error as AxiosError<{ error: string }>)?.response?.data?.error
    );
  }
};

export const getUserPlaylists = async (): Promise<Playlist[] | null> => {
  try {
    const response = await authApiClient.get("/api/playlist/all");
    return response.data;
  } catch (error) {
    throw new Error(
      (error as AxiosError<{ error: string }>)?.response?.data?.error
    );
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
    throw new Error(
      (error as AxiosError<{ error: string }>)?.response?.data?.error
    );
  }
};

export const getPlaylist = async (
  playlistId: string
): Promise<PlaylistData> => {
  try {
    const response = await authApiClient.post("/api/playlist/get", {
      playlistId,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      (error as AxiosError<{ error: string }>)?.response?.data?.error
    );
  }
};
