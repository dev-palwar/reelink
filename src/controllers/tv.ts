import { apiClient } from "@/lib/api-client";
import { TVData } from "@/app/tv/interface";
import { AxiosError } from "axios";

export const getTVDetails = async (id: string): Promise<TVData> => {
  try {
    const response = await apiClient.get(`/tv/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      (error as AxiosError<{ error: string }>)?.response?.data?.error
    );
  }
};
