import axios from "axios";
import { toast } from "sonner";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_MOVIE_API,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_MOVIE_API_TOKEN}`,
  },
});

export const authApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

authApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorDetails = {
      timestamp: new Date().toISOString(),
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      status: error.response?.status,
      message: error.response?.data?.error || error.message,
      details: error.response?.data?.details,
    };

    toast.error("Error fetching playlist details", {
      description: errorDetails.message,
    });

    console.log(errorDetails);

    return Promise.reject(error);
  }
);
