"use client";

import IconRenderer from "@/components/reusables/IconRenderer";
import Image from "next/image";
import {
  getMovieCredits,
  getMovieDetails,
  getSimilarMovies,
} from "@/controllers/movie";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MovieData, SimilarMovieData } from "./interface";
import { useState } from "react";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { SignInButton, useUser } from "@clerk/nextjs";
import Modale from "@/components/reusables/Modale";
import { Input } from "@/components/ui/input";
import {
  addToPlaylist,
  createPlaylist,
  getPlaylists,
} from "@/controllers/playlist";
import { toast } from "sonner";

export default function MoviePage() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieData | null>(null);

  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    const fetchMovie = async () => {
      const movie: MovieData = await getMovieDetails(id || "");
      setMovie(movie);
    };
    fetchMovie();
  }, [id]);

  const addToWatchlist = async (movieId: string) => {
    if (!isSignedIn || !isLoaded) {
      router.push("/sign-in");
    } else {
      console.log("Add to watchlist");
    }
  };

  return (
    <div className="flex justify-between">
      <div className="content flex flex-col gap-8 basis-1/2">
        <div className="flex">
          <div className="date flex items-center gap-2">
            <p className="text-sm text-foreground/70 font-medium">
              {formatDate(movie?.release_date || "")}
            </p>
            <div className="seasons bg-primary/10 px-2 py-1">
              <p className="text-sm text-foreground/70 font-medium">
                <span className="text-primary font-medium">
                  {movie?.runtime || 0}
                </span>{" "}
                Minutes
              </p>
            </div>
            <div className="status">
              <p className="text-sm text-foreground/70 font-medium">
                {movie?.status || ""}
              </p>
            </div>
          </div>
        </div>
        <p className="text-7xl font-bold capitalize leading-tight">
          {movie?.title || ""}
        </p>

        <div className="buttons flex items-center gap-2">
          <div className="imdb flex items-center gap-2 hover:text-yellow-500 cursor-pointer transition-all duration-300 bg-primary/10 px-2 py-1 rounded-md hover:bg-primary/20">
            <IconRenderer name="imdb" className="text-yellow-500" />
            <p className="text-sm text-foreground/70 font-medium">
              {movie?.vote_average || 0}/10
            </p>
          </div>
          <Modale>
            <AddToPlaylistForm movieId={movie?.id?.toString() || ""} />
          </Modale>
          {/* <Button
            variant="outline"
            className="add-to-watchlist h-full flex items-center gap-2"
            onClick={() => {
              addToWatchlist(movie?.id.toString() || "");
            }}
          >
            <IconRenderer name="add-to-watchlist" className="text-primary" />
            <p className="text-sm text-foreground/70 font-medium">
              Add to Watchlist
            </p>
          </Button> */}
        </div>

        <div className="generes flex items-center gap-2">
          {movie?.genres.map((genre: { id: number; name: string }) => (
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
            {movie?.overview || ""}
          </p>
        </div>
      </div>

      <div className="poster">
        <Image
          src={`https://image.tmdb.org/t/p/w500${movie?.poster_path || ""}`}
          alt={movie?.title || ""}
          className="object-cover"
          width={500}
          height={500}
        />
      </div>
    </div>
  );
}

function AddToPlaylistForm({ movieId }: { movieId: string }) {
  const [playlists, setPlaylists] = useState<any[]>([]);

  const handleCreatePlaylist = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const playlistName = formData.get("playlistName") as string;
    console.log(playlistName);
    const playlist = await createPlaylist(playlistName);
    if (playlist.error) {
      toast.error(playlist.error);
    } else {
      toast.success("Playlist created successfully");
    }
  };

  const fetchPlaylists = async () => {
    try {
      const playlists = await getPlaylists();
      setPlaylists(playlists);
    } catch (error) {
      console.error("Error fetching playlists:", error);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const handleAddToPlaylist = async (playlistId: string, movieId: string) => {
    const response = await addToPlaylist(playlistId, movieId);
    if (response.error) {
      toast.error(response.error);
    } else {
      toast.success("Added to playlist successfully");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {playlists.map((playlist) => (
        <p
          key={playlist.id}
          className="text-sm text-foreground/70 font-medium :hover:text-underline cursor-pointer transition-all duration-300"
          onClick={() => handleAddToPlaylist(playlist.id, movieId)}
        >
          {playlist.name}
        </p>
      ))}
      <hr />
      <form onSubmit={handleCreatePlaylist} className="flex flex-col gap-2">
        <Input
          name="playlistName"
          placeholder="Enter playlist name"
          className="w-full"
        />
        <Button type="submit" className="w-full">
          Create playlist
        </Button>
      </form>
    </div>
  );
}
