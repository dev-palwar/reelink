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
} from "@/controllers/playlist";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Playlist } from "@/generated/prisma/client";
import Loader from "./Loader";
import { cn } from "@/lib/utils";

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
          variant={isInPlaylist ? "default" : "outline"}
          className={cn(isInPlaylist && "bg-green-500/10 text-green-500")}
        >
          {isInPlaylist ? (
            <IconRenderer name="check" className="text-green-500" />
          ) : (
            <IconRenderer name="add-to-watchlist" className="text-primary" />
          )}
          {isInPlaylist ? (
            <p className="text-sm text-foreground/70 font-medium">Added</p>
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
      onSuccess: () => toast.success("Playlist created successfully"),
    });

  const { mutate: addToPlaylistMutation, isPending: addToPlaylistPending } =
    useMutation({
      mutationFn: ({
        playlistId,
        movieId,
      }: {
        playlistId: string;
        movieId: string;
      }) => addToPlaylist(playlistId, movieId),
      onSuccess: () => {
        toast.success("Added to playlist successfully");
      },
    });

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

  return (
    <div className="flex flex-col gap-2">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        playlistsData?.map((playlist: Playlist) => (
          <p
            key={playlist.id}
            className="hover:underline capitalize text-sm text-foreground font-medium :hover:text-underline cursor-pointer transition-all duration-300"
            onClick={() =>
              addToPlaylistMutation({ playlistId: playlist.id, movieId })
            }
          >
            {playlist.name}
          </p>
        ))
      )}
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
          {createPlaylistPending || addToPlaylistPending ? (
            <Loader />
          ) : (
            "Create playlist"
          )}
        </Button>
      </form>
    </div>
  );
}
