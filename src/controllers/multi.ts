import { apiClient } from "@/lib/api-client";
import { ReelCardProps } from "@/types";

export interface SearchResults {
  results: ReelCardProps[];
  total_pages: number;
  total_results: number;
}

export const getMultiSearch = async (query: string): Promise<SearchResults> => {
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
