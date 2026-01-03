"use client";

import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import Anya from "@/assets/anya.png";
import Image from "next/image";
import ReelCard, { ReelCardProps } from "@/components/reusables/cards/ReelCard";
import Loader from "@/components/reusables/Loader";
import { getMultiSearch } from "@/controllers/multi";

interface SearchResults {
  results: ReelCardProps[];
  total_pages: number;
  total_results: number;
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    SearchResults["results"] | null
  >(null);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      console.log(e.currentTarget.value);
    }
  };

  const fetchSearchResults = async () => {
    setLoading(true);
    const data: SearchResults = await getMultiSearch(searchQuery);
    console.log(data.results);
    setSearchResults(data.results);
    setLoading(false);
  };

  useEffect(() => {
    fetchSearchResults();
  }, [searchQuery]);

  return (
    <div className="flex flex-col gap-8">
      <Input
        placeholder="Search for a movie TV show or Anime"
        className="w-full bg-black dark:bg-white border-none rounded-none shadow-none p-6 mt-8 text-black"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.currentTarget.value)}
        onKeyDown={handleSearch}
      />

      {!searchQuery && (
        <div className="flex justify-center items-center h-screen">
          <Image src={Anya} alt="Anya" width={300} height={300} />
        </div>
      )}

      <div className="flex justify-center items-center flex-wrap gap-4">
        {loading ? (
          <Loader />
        ) : (
          searchResults?.map((result) => (
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
