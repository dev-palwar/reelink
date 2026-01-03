import { apiClient } from "@/lib/api-client";

export const getMultiSearch = async (query: string): Promise<any> => {
  try {
    const response = await apiClient.get(`/search/multi`, {
      params: {
        query: query,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching multi search:", error);
    throw error;
  }
};
