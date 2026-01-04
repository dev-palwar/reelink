"use client";

import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import Anya from "@/assets/anya.png";
import Image from "next/image";
import ReelCard from "@/components/reusables/cards/ReelCard";
import Loader from "@/components/reusables/Loader";
import { getMultiSearch } from "@/controllers/multi";
import { useDebounce } from "../../useDebounce";
import { useQuery } from "@tanstack/react-query";
import { ReelCardProps } from "@/types";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const { debouncedValue: debouncedSearchQuery } = useDebounce(
    searchQuery || "",
    500
  );

  const {
    data: searchResultsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["searchResults", debouncedSearchQuery],
    queryFn: () => getMultiSearch(debouncedSearchQuery || ""),
  });

  useEffect(() => {
    const savedSearchQuery = localStorage.getItem("searchQuery");
    if (savedSearchQuery) {
      setSearchQuery(savedSearchQuery);
    } else {
      localStorage.removeItem("searchQuery");
    }
  }, [debouncedSearchQuery]);

  return (
    <div className="min-h-screen flex flex-col gap-8">
      <Input
        placeholder="Search for a movie TV show or Anime"
        className="w-full bg-black dark:bg-white border-none rounded-none shadow-none p-6 text-black"
        value={localStorage.getItem("searchQuery") || ""}
        onChange={(e) => {
          setSearchQuery(e.currentTarget.value);
          localStorage.setItem("searchQuery", e.currentTarget.value);
        }}
      />

      {!searchQuery && (
        <div className="min-h-screen w-full flex justify-center items-center">
          <Image src={Anya} alt="Anya" width={300} height={300} />
        </div>
      )}

      <div className="flex items-center flex-wrap gap-4">
        {isLoading ? (
          <div className="w-full flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          searchResultsData?.results?.map((result: ReelCardProps) => (
            <div className="basis-48" key={result.id}>
              <ReelCard
                key={result.id}
                data={{
                  id: result.id,
                  title: result.title,
                  name: result.name,
                  original_title: result.original_title,
                  backdrop_path: result.backdrop_path,
                  media_type: result.media_type,
                  poster_path: result.poster_path,
                  release_date: result.first_air_date
                    ? result.first_air_date
                    : result.release_date,
                }}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
