"use client";

import Loader from "@/components/reusables/Loader";
import ReelCard from "@/components/reusables/ReelCard";
import { Typography } from "@/components/ui/typography";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Discover() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDiscoverData = async () => {
    setLoading(true);
    try {
      const options = {
        method: "GET",
        url: `https://api.themoviedb.org/3/discover/movie`,
        params: {
          page: 1,
        },
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_TMDB_TOKEN}`,
        },
      };

      const response = await axios.request(options);
      setData(response.data);
      setLoading(false);
    } catch (error) {
      setError(error as string);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscoverData();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <Typography variant="heading1">Discover</Typography>
      <div className="flex flex-wrap gap-4">
        {loading ? (
          <Loader />
        ) : (
          data?.results?.map((result: any) => (
            <div className="basis-48" key={result.id}>
              <ReelCard
                key={result.id}
                id={result.id}
                title={result.title}
                original_title={result.original_title}
                backdrop_path={result.backdrop_path}
                media_type={result.media_type}
                release_date={result.release_date}
                poster_path={result.poster_path}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
