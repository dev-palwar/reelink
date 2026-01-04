"use client";

import { getPlaylist } from "@/controllers/playlist";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { PlaylistData, PlaylistItem } from "../interface";
import { MovieData } from "@/app/movie/interface";
import Loader from "@/components/reusables/Loader";
import { getMovieDetails } from "@/controllers/movie";
import ReelCard from "@/components/reusables/cards/ReelCard";
import { useQuery } from "@tanstack/react-query";

export default function PlaylistPage() {
  const { id } = useParams<{ id: string }>();

  const { data: playlistDetails, isLoading } = useQuery({
    queryKey: ["playlist-details", id],
    queryFn: () => getPlaylist(id || ""),
  });

  return (
    <div className="min-h-screen flex flex-col gap-8">
      {isLoading ? (
        <div className="w-full min-h-screen flex justify-center items-center">
          <Loader />
        </div>
      ) : (
        playlistDetails && <PlaylistDetails playlist={playlistDetails} />
      )}
    </div>
  );
}

const PlaylistDetails = ({ playlist }: { playlist: PlaylistData | null }) => {
  const [movies, setMovies] = useState<MovieData[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMovies = async () => {
    setLoading(true);
    const movies = await Promise.all(
      playlist?.items.map((item: PlaylistItem) =>
        getMovieDetails(item.movieId)
      ) || []
    );
    setMovies(movies);
    setLoading(false);
  };

  useEffect(() => {
    fetchMovies();
  }, [playlist]);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-4xl font-bold capitalize">{playlist?.name}</h1>
      <div className="flex flex-wrap gap-4">
        {loading ? (
          <div className="w-full min-h-screen flex justify-center items-center">
            <Loader />
          </div>
        ) : movies.length > 0 ? (
          movies.map((movie: MovieData) => (
            <ReelCard
              key={movie.id}
              data={{
                id: movie.id,
                title: movie.title,
                original_title: movie.original_title,
                backdrop_path: movie.backdrop_path,
                media_type: "movie",
                poster_path: movie.poster_path,
                release_date: movie.release_date,
              }}
            />
          ))
        ) : (
          <div className="w-full min-h-screen flex justify-center items-center">
            <p>No data found</p>
          </div>
        )}
      </div>
    </div>
  );
};
