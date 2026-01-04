"use client";
import { useQuery } from "@tanstack/react-query";
import { getTVDetails } from "@/controllers/tv";
import IconRenderer from "@/components/reusables/IconRenderer";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Loader from "@/components/reusables/Loader";
import { useParams } from "next/navigation";

export default function TVPage() {
  const { id } = useParams<{ id: string }>();

  const { data: tvData, isLoading } = useQuery({
    queryKey: ["tv", id],
    queryFn: () => getTVDetails(id || ""),
  });

  return (
    <div className="min-h-screen flex flex-col gap-8">
      {isLoading ? (
        <div className="w-full min-h-screen flex justify-center items-center">
          <Loader />
        </div>
      ) : (
        <div className="flex justify-between">
          <div className="content flex flex-col gap-8 basis-1/2">
            <p className="text-7xl font-bold capitalize leading-tight">
              {tvData?.name}
            </p>

            <div className="buttons flex items-center gap-2">
              <div className="imdb flex items-center gap-2 hover:text-yellow-500 cursor-pointer transition-all duration-300 bg-primary/10 px-2 py-1 rounded-md hover:bg-primary/20">
                <IconRenderer name="imdb" className="text-yellow-500" />
                <p className="text-sm text-foreground/70 font-medium">
                  {tvData?.vote_average}/10
                </p>
              </div>
              <Button
                variant="outline"
                className="add-to-watchlist h-full flex items-center gap-2"
              >
                <IconRenderer
                  name="add-to-watchlist"
                  className="text-primary"
                />
                <p className="text-sm text-foreground/70 font-medium">
                  Add to Watchlist
                </p>
              </Button>
            </div>

            <div className="generes flex items-center gap-2">
              {tvData?.genres.map((genre: { id: number; name: string }) => (
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
                {tvData?.overview}
              </p>
            </div>
          </div>

          <div className="poster">
            <Image
              src={`https://image.tmdb.org/t/p/w500${tvData?.poster_path}`}
              alt={tvData?.name || ""}
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
