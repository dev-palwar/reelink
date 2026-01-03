"use client";

import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import Anya from "@/assets/anya.png";
import Image from "next/image";
import CardGrid from "@/components/home/card-grid";
import ReelCard from "@/components/reusables/ReelCard";
import axios from "axios";
import Loader from "@/components/reusables/Loader";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any>(null);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      console.log(e.currentTarget.value);
    }
  };

  const fetchSearchResults = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MOVIE_API}/search/multi`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_MOVIE_API_TOKEN}`,
          },
          params: {
            query: searchQuery,
          },
        }
      );
      console.log(response.data);
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setSearchResults(null);
    } finally {
      setLoading(false);
    }
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
          searchResults?.results?.map((result: any) => (
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
