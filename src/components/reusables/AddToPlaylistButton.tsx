import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import IconRenderer from "./IconRenderer";
import {
  addToPlaylist,
  createPlaylist,
  getUserPlaylists,
  removeFromPlaylist,
} from "@/controllers/playlist";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Playlist, PlaylistItem } from "@/generated/prisma/client";
import Loader from "./Loader";
import { cn } from "@/lib/utils";
import { usePlaylistItems } from "@/hooks/usePlaylistItems";

export default function AddToPlaylistModale({
  movieId,
  isInPlaylist,
}: {
  movieId: string;
  isInPlaylist: boolean;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={isInPlaylist ? "secondary" : "outline"}
          className={cn(isInPlaylist && "bg-green-500/10 text-green-500")}
        >
          {isInPlaylist ? (
            <IconRenderer name="remove" className="text-green-500" />
          ) : (
            <IconRenderer name="add-to-watchlist" className="text-primary" />
          )}
          {isInPlaylist ? (
            <p className="text-sm text-foreground/70 font-medium">
              Remove from playlist
            </p>
          ) : (
            <p className="text-sm text-foreground/70 font-medium">
              Add to playlist
            </p>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to playlist</DialogTitle>
          <DialogDescription>Or create a new playlist</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <AddToPlaylistForm movieId={movieId} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AddToPlaylistForm({ movieId }: { movieId: string }) {
  const { data: playlistsData, isLoading } = useQuery({
    queryKey: ["playlists"],
    queryFn: () => getUserPlaylists(),
  });

  const { mutate: createPlaylistMutation, isPending: createPlaylistPending } =
    useMutation({
      mutationFn: (playlistName: string) => createPlaylist(playlistName),
      // onSuccess: () => toast.success("Playlist created successfully"),
    });

  const {
    mutate: addToPlaylistMutation,
    isPending: addToPlaylistPending,
    error: movieAlreadyInPlaylistError,
  } = useMutation({
    mutationFn: ({
      playlistId,
      movieId,
    }: {
      playlistId: string;
      movieId: string;
    }) => addToPlaylist(playlistId, movieId),
    // onSuccess: () => {
    //   toast.success("Added to playlist successfully");
    // },
  });

  const { data: playlistItemsData } = usePlaylistItems();

  const {
    mutate: removeFromPlaylistMutation,
    isPending: removeFromPlaylistPending,
  } = useMutation({
    mutationFn: ({
      playlistId,
      movieId,
    }: {
      playlistId: string;
      movieId: string;
    }) => removeFromPlaylist(playlistId, movieId),
  });

  if (movieAlreadyInPlaylistError) {
    // removeFromPlaylistMutation({ playlistId: movieAlreadyInPlaylistError.id, movieId });
  }

  const handleAddOrRemoveMovieFromPlaylist = (
    movieId: string,
    playlistId: string
  ) => {
    if (matchedPlaylistIds.includes(playlistId)) {
      removeFromPlaylistMutation({ playlistId, movieId });
    } else {
      addToPlaylistMutation({ playlistId, movieId });
    }
  };

  const matchedPlaylistIds =
    playlistItemsData
      ?.filter((item: PlaylistItem) => item.movieId === movieId)
      .map((item: PlaylistItem) => item.playlistId) ?? [];

  const handleCreatePlaylist = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const playlistName = formData.get("playlistName") as string;
    if (playlistName.trim() === "") {
      toast.error("Playlist name cannot be empty");
      return;
    }
    if (playlistName.length > 50) {
      toast.error("Playlist name cannot be longer than 50 characters");
      return;
    }
    createPlaylistMutation(playlistName);
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {playlistsData?.map((playlist: Playlist) => {
        const isSelected = matchedPlaylistIds.includes(playlist.id);

        return (
          <div
            key={playlist.id}
            onClick={() =>
              handleAddOrRemoveMovieFromPlaylist(movieId, playlist.id)
            }
            className="flex items-center gap-2 cursor-pointer text-sm font-medium capitalize transition-all duration-300 hover:underline"
          >
            <IconRenderer
              name={isSelected ? "check" : "add-to-watchlist"}
              className={isSelected ? "text-green-500" : "text-primary"}
            />

            <p className="text-foreground/70">{playlist.name}</p>
          </div>
        );
      })}
      <hr />
      <form onSubmit={handleCreatePlaylist} className="flex flex-col gap-2">
        <Input
          name="playlistName"
          placeholder="Enter playlist name"
          className="w-full"
        />
        <Button
          type="submit"
          className="w-full"
          disabled={createPlaylistPending || addToPlaylistPending}
        >
          {createPlaylistPending ||
          addToPlaylistPending ||
          removeFromPlaylistPending ? (
            <Loader />
          ) : (
            "Create playlist"
          )}
        </Button>
      </form>
    </div>
  );
}
