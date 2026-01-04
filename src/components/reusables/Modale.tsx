import { useEffect, useState } from "react";
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
  getPlaylists,
} from "@/controllers/playlist";
import { toast } from "sonner";
import { Input } from "../ui/input";

export default function AddToPlaylistModale({ movieId }: { movieId: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <IconRenderer name="add-to-watchlist" className="text-primary" />
          <p className="text-sm text-foreground/70 font-medium">
            Add to Watchlist
          </p>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to favorites</DialogTitle>
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
