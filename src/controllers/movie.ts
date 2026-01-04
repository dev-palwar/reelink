import { DiscoverMoviesData } from "@/app/discover/interface";
import { MovieCreditData } from "@/app/movie/interface";
import { apiClient } from "@/lib/api-client";
import { MovieData } from "@/app/movie/interface";
import { AxiosError } from "axios";

export const getMovieDetails = async (id: string): Promise<MovieData> => {
  try {
    const response = await apiClient.get(`/movie/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      (error as AxiosError<{ error: string }>)?.response?.data?.error
    );
  }
};

export const getSimilarMovies = async (id: string) => {
  try {
    const response = await apiClient.get(`/movie/${id}/similar`);
    return response.data;
  } catch (error) {
    throw new Error(
      (error as AxiosError<{ error: string }>)?.response?.data?.error
    );
  }
};

export const getMovieCredits = async (
  id: string
): Promise<MovieCreditData["cast"]> => {
  try {
    const response = await apiClient.get(`/movie/${id}/credits`);
    return response.data.cast;
  } catch (error) {
    throw new Error(
      (error as AxiosError<{ error: string }>)?.response?.data?.error
    );
  }
};

export const getDiscoverMovies = async (
  page: number
): Promise<DiscoverMoviesData[]> => {
  try {
    const response = await apiClient.get(`/discover/movie`, {
      params: {
        page: page,
      },
    });
    return response.data.results;
  } catch (error) {
    throw new Error(
      (error as AxiosError<{ error: string }>)?.response?.data?.error
    );
  }
};
