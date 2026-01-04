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
  (response) => {
    if (response.status === 201 || response.status === 200) {
      toast.success("Operation successful");
    }
    return response;
  },
  (error) => {
    console.error("[API Error]", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.response?.data?.error || error.message,
    });

    const message =
      error.response?.data?.error || "Something went wrong. Please try again.";

    const title = error.response?.status
      ? `Error ${error.response.status}`
      : "Request Failed";

    toast.error(title, {
      description: message,
    });

    return Promise.reject(error);
  }
);
