"use client";

import Loader from "@/components/reusables/Loader";
import ReelCard from "@/components/reusables/cards/ReelCard";
import { getDiscoverMovies } from "@/controllers/movie";
import { useEffect, useState } from "react";

export default function Discover() {
  const [discoverData, setDiscoverData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchDiscoverData = async () => {
    setLoading(true);
    const data = await getDiscoverMovies(1);
    setDiscoverData(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchDiscoverData();
  }, []);

  console.log(discoverData);

  return (
    <div className="flex flex-col gap-8">
      <p className="text-7xl font-bold capitalize">Discover</p>
      <div className="flex flex-wrap gap-4 justify-center items-center">
        {loading ? (
          <Loader />
        ) : (
          discoverData?.results?.map((result: any) => (
            <div className="basis-48" key={result.id}>
              <ReelCard
                key={result.id}
                data={{
                  id: result.id,
                  title: result.title,
                  original_title: result.original_title,
                  backdrop_path: result.backdrop_path,
                  release_date: result.release_date,
                  poster_path: result.poster_path,
                  media_type: "movie",
                }}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
