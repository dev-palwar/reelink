import { getTVDetails } from "@/controllers/tv";
import { TVData } from "./interface";
import { formatDate } from "@/lib/utils";
import IconRenderer from "@/components/reusables/IconRenderer";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default async function TVPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const tv: TVData = await getTVDetails(id);

  return (
    <div className="min-h-screen flex flex-col gap-8">
      <TVDetails tv={tv} />
    </div>
  );
}

function TVDetails({ tv }: { tv: TVData }) {
  return (
    <div className="flex justify-between">
      <div className="content flex flex-col gap-8 basis-1/2">
        <div className="flex">
          <div className="date flex items-center gap-2">
            <p className="text-sm text-foreground/70 font-medium">
              {formatDate(tv.first_air_date)}
            </p>
            <div className="seasons bg-primary/10 px-2 py-1">
              <p className="text-sm text-foreground/70 font-medium">
                <span className="text-primary font-medium">
                  {tv.number_of_seasons}
                </span>{" "}
                Seasons
              </p>
            </div>
            <div className="status">
              <p className="text-sm text-foreground/70 font-medium">
                {tv.status}
              </p>
            </div>
          </div>
        </div>
        <p className="text-7xl font-bold capitalize leading-tight">{tv.name}</p>

        <div className="buttons flex items-center gap-2">
          <div className="imdb flex items-center gap-2 hover:text-yellow-500 cursor-pointer transition-all duration-300 bg-primary/10 px-2 py-1 rounded-md hover:bg-primary/20">
            <IconRenderer name="imdb" className="text-yellow-500" />
            <p className="text-sm text-foreground/70 font-medium">
              {tv.vote_average}/10
            </p>
          </div>
          <Button
            variant="outline"
            className="add-to-watchlist h-full flex items-center gap-2"
          >
            <IconRenderer name="add-to-watchlist" className="text-primary" />
            <p className="text-sm text-foreground/70 font-medium">
              Add to Watchlist
            </p>
          </Button>
        </div>

        <div className="generes flex items-center gap-2">
          {tv.genres.map((genre: { id: number; name: string }) => (
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
            {tv.overview}
          </p>
        </div>
      </div>

      <div className="poster">
        <Image
          src={`https://image.tmdb.org/t/p/w500${tv.poster_path}`}
          alt={tv.name}
          className="object-cover"
          width={500}
          height={500}
        />
      </div>
    </div>
  );
}
