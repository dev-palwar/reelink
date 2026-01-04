import { withAuth } from "@/lib/api/helpers/middleware";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const removeFromPlaylistSchema = z.object({
  playlistId: z.string().min(1, "Playlist ID is required"),
  movieId: z.string().min(1, "Movie ID is required"),
});

export const POST = withAuth(async (req, context) => {
  const { playlistId, movieId } = context.body!;

  const playlistItem = await prisma.playlistItem.delete({
    where: { playlistId_movieId: { playlistId, movieId } },
  });

  return NextResponse.json(playlistItem);
}, removeFromPlaylistSchema);
