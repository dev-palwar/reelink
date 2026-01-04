import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { withAuth } from "@/lib/api/helpers/middleware";
import { z } from "zod";

const addToPlaylistSchema = z.object({
  playlistId: z.string().min(1, "Playlist ID is required"),
  movieId: z.string().min(1, "Movie ID is required"),
});

export const POST = withAuth(async (req, context) => {
  const { playlistId, movieId } = context.body!;

  // Checks if playlist exists
  const playlist = await prisma.playlist.findUnique({
    where: { id: playlistId },
  });

  if (!playlist) {
    return NextResponse.json({ error: "Playlist not found" }, { status: 404 });
  }

  // Checks if user has access to playlist
  if (playlist.userId !== context.dbUser.id) {
    return NextResponse.json(
      { error: "You don't have permission to modify this playlist" },
      { status: 403 }
    );
  }

  // Checks if movie already exists in playlist
  const existingItem = await prisma.playlistItem.findUnique({
    where: { playlistId_movieId: { playlistId, movieId } },
  });

  if (existingItem) {
    return NextResponse.json(
      { error: "Movie already exists in this playlist" },
      { status: 409 }
    );
  }

  // Creates new playlist item
  const playlistItem = await prisma.playlistItem.create({
    data: {
      playlistId,
      movieId,
      userId: context.dbUser.id,
      position: 0 as number,
    },
  });

  return NextResponse.json(playlistItem, { status: 201 });
}, addToPlaylistSchema);
