"use client";

import IconRenderer from "@/components/reusables/IconRenderer";
import Image from "next/image";
import { getMovieDetails } from "@/controllers/movie";
import { formatDate } from "@/lib/utils";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import AddToPlaylistModale from "@/components/reusables/Modale";
import Loader from "@/components/reusables/Loader";

export default function MoviePage() {
  const { id } = useParams<{ id: string }>();

  const { data: movieData, isLoading } = useQuery({
    queryKey: ["movie", id],
    queryFn: () => getMovieDetails(id || ""),
  });

  return (
    <div className="min-h-screen flex flex-col gap-8">
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex justify-between">
          <div className="content flex flex-col gap-8 basis-1/2">
            <div className="flex">
              <div className="date flex items-center gap-2">
                <p className="text-sm text-foreground/70 font-medium">
                  {formatDate(movieData?.release_date || "")}
                </p>
                <div className="seasons bg-primary/10 px-2 py-1">
                  <p className="text-sm text-foreground/70 font-medium">
                    <span className="text-primary font-medium">
                      {movieData?.runtime || 0}
                    </span>{" "}
                    Minutes
                  </p>
                </div>
                <div className="status">
                  <p className="text-sm text-foreground/70 font-medium">
                    {movieData?.status || ""}
                  </p>
                </div>
              </div>
            </div>
            <p className="text-7xl font-bold capitalize leading-tight">
              {movieData?.title || ""}
            </p>

            <div className="buttons flex items-center gap-2">
              <div className="imdb flex items-center gap-2 hover:text-yellow-500 cursor-pointer transition-all duration-300 bg-primary/10 px-2 py-1 rounded-md hover:bg-primary/20">
                <IconRenderer name="imdb" className="text-yellow-500" />
                <p className="text-sm text-foreground/70 font-medium">
                  {movieData?.vote_average || 0}/10
                </p>
              </div>
              <AddToPlaylistModale movieId={movieData?.id?.toString() || ""} />
            </div>

            <div className="generes flex items-center gap-2">
              {movieData?.genres.map((genre: { id: number; name: string }) => (
                <p
                  key={genre.id}
                  className="text-sm text-foreground/70 font-medium capitalize"
                >
                  {genre.name}
                </p>
              ))}
            </div>

            <div className="description">
              <p className="text-lg text-foreground/80 font-medium text-justify">
                {movieData?.overview || ""}
              </p>
            </div>
          </div>

          <div className="poster">
            <Image
              src={`https://image.tmdb.org/t/p/w500${
                movieData?.poster_path || ""
              }`}
              alt={movieData?.title || ""}
              className="object-cover"
              width={500}
              height={500}
            />
          </div>
        </div>
      )}
    </div>
  );
}
