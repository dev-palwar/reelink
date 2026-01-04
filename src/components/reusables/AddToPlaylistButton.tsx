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
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

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

export function AddToPlaylistForm({ movieId }: { movieId: string }) {
  const queryClient = useQueryClient();
  const [newPlaylistName, setNewPlaylistName] = useState("");

  // Fetch playlists
  const { data: playlists = [], isLoading: isLoadingPlaylists } = useQuery({
    queryKey: ["playlists"],
    queryFn: getUserPlaylists,
  });

  // Fetch playlist items to check which playlists contain this movie
  const { data: playlistItems = [] } = usePlaylistItems();

  // Get playlist IDs that contain this movie
  const playlistsWithMovie = playlistItems
    .filter((item: PlaylistItem) => item.movieId === movieId)
    .map((item: PlaylistItem) => item.playlistId);

  // Create playlist mutation
  const createPlaylistMutation = useMutation({
    mutationFn: createPlaylist,
    onSuccess: (newPlaylist) => {
      // Invalidate and refetch playlists
      queryClient.invalidateQueries({ queryKey: ["playlists"] });

      toast.success("Playlist created successfully");
      setNewPlaylistName(""); // Reset form

      // Optionally auto-add movie to new playlist
      addToPlaylistMutation.mutate({
        playlistId: newPlaylist.id,
        movieId,
      });
    },
    onError: () => {
      toast.error("Failed to create playlist");
    },
  });

  // Add to playlist mutation
  const addToPlaylistMutation = useMutation({
    mutationFn: ({
      playlistId,
      movieId,
    }: {
      playlistId: string;
      movieId: string;
    }) => addToPlaylist(playlistId, movieId),
    onMutate: async ({ playlistId }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["playlist-items"] });

      // Snapshot previous value
      const previousItems = queryClient.getQueryData(["playlist-items"]);

      // Optimistically update
      queryClient.setQueryData(
        ["playlist-items"],
        (old: PlaylistItem[] = []) => [
          ...old,
          {
            playlistId,
            movieId,
            id: "temp-id",
            userId: "temp",
            position: 0,
            addedAt: new Date(),
          },
        ]
      );

      return { previousItems };
    },
    onSuccess: () => {
      // Invalidate to get real data
      queryClient.invalidateQueries({ queryKey: ["playlist-items"] });
      toast.success("Added to playlist");
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousItems) {
        queryClient.setQueryData(["playlist-items"], context.previousItems);
      }
      toast.error("Failed to add to playlist");
    },
  });

  // Remove from playlist mutation
  const removeFromPlaylistMutation = useMutation({
    mutationFn: ({
      playlistId,
      movieId,
    }: {
      playlistId: string;
      movieId: string;
    }) => removeFromPlaylist(playlistId, movieId),
    onMutate: async ({ playlistId, movieId }) => {
      await queryClient.cancelQueries({ queryKey: ["playlist-items"] });

      const previousItems = queryClient.getQueryData(["playlist-items"]);

      // Optimistically remove
      queryClient.setQueryData(["playlist-items"], (old: PlaylistItem[] = []) =>
        old.filter(
          (item) =>
            !(item.playlistId === playlistId && item.movieId === movieId)
        )
      );

      return { previousItems };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlist-items"] });
      toast.success("Removed from playlist");
    },
    onError: (error, variables, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(["playlist-items"], context.previousItems);
      }
      toast.error("Failed to remove from playlist");
    },
  });

  // Handle toggle (add or remove)
  const handleTogglePlaylist = (playlistId: string) => {
    const isInPlaylist = playlistsWithMovie.includes(playlistId);

    if (isInPlaylist) {
      removeFromPlaylistMutation.mutate({ playlistId, movieId });
    } else {
      addToPlaylistMutation.mutate({ playlistId, movieId });
    }
  };

  // Handle create playlist form submission
  const handleCreatePlaylist = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedName = newPlaylistName.trim();

    if (!trimmedName) {
      toast.error("Playlist name cannot be empty");
      return;
    }

    if (trimmedName.length > 50) {
      toast.error("Playlist name cannot be longer than 50 characters");
      return;
    }

    // Check for duplicate playlist names
    const isDuplicate = playlists?.some(
      (playlist: Playlist) =>
        playlist.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (isDuplicate) {
      toast.error("A playlist with this name already exists");
      return;
    }

    createPlaylistMutation.mutate(trimmedName);
  };

  const isAnyMutationPending =
    createPlaylistMutation.isPending ||
    addToPlaylistMutation.isPending ||
    removeFromPlaylistMutation.isPending;

  if (isLoadingPlaylists) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader />
      </div>
    );
  }

  if (!playlists?.length && !isLoadingPlaylists) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground text-center py-4">
          You don't have any playlists yet. Create one below!
        </p>
        <form onSubmit={handleCreatePlaylist} className="flex flex-col gap-2">
          <Input
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            placeholder="Enter playlist name"
            maxLength={50}
            disabled={isAnyMutationPending}
          />
          <Button type="submit" disabled={isAnyMutationPending}>
            {createPlaylistMutation.isPending ? <Loader /> : "Create playlist"}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Playlist List */}
      <div className="flex flex-col gap-1 max-h-[300px] overflow-y-auto">
        {playlists?.map((playlist: Playlist) => {
          const isInPlaylist = playlistsWithMovie.includes(playlist.id);
          const isCurrentlyMutating =
            addToPlaylistMutation.isPending ||
            removeFromPlaylistMutation.isPending;

          return (
            <button
              key={playlist.id}
              onClick={() => handleTogglePlaylist(playlist.id)}
              disabled={isCurrentlyMutating}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium capitalize transition-all duration-200 hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed text-left"
            >
              <IconRenderer
                name={isInPlaylist ? "check" : "add-to-watchlist"}
                className={`w-4 h-4 shrink-0 ${
                  isInPlaylist ? "text-green-500" : "text-muted-foreground"
                }`}
              />
              <span className="text-foreground/90 flex-1">{playlist.name}</span>
              {isInPlaylist && (
                <span className="text-xs text-muted-foreground">Added</span>
              )}
            </button>
          );
        })}
      </div>

      <hr className="my-2" />

      {/* Create Playlist Form */}
      <form onSubmit={handleCreatePlaylist} className="flex flex-col gap-2">
        <Input
          value={newPlaylistName}
          onChange={(e) => setNewPlaylistName(e.target.value)}
          placeholder="Create new playlist"
          maxLength={50}
          disabled={isAnyMutationPending}
        />
        <Button
          type="submit"
          disabled={isAnyMutationPending}
          className="w-full"
        >
          {createPlaylistMutation.isPending ? <Loader /> : "Create & Add Movie"}
        </Button>
      </form>
    </div>
  );
}
