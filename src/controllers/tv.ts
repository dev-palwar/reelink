import { apiClient } from "@/lib/api-client";

export const getTVDetails = async (id: string) => {
  try {
    const response = await apiClient.get(`/tv/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching TV details:", error);
    throw error;
  }
};
