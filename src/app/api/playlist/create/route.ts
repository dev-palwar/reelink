import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { withAuth } from "@/lib/api/helpers/middleware";
import { createPlaylistSchema } from "@/lib/api/validators/playlist";

export const POST = withAuth(async (req, { clerkUser, dbUser, body }) => {
  const { playlistName } = body!;

  // Checks if playlist already exists
  const existingPlaylist = await prisma.playlist.findFirst({
    where: {
      userId: dbUser.id,
      name: playlistName,
    },
  });

  if (existingPlaylist) {
    return NextResponse.json(
      { error: "Playlist with this name already exists" },
      { status: 409 } // 409 Conflict is more appropriate than 400
    );
  }

  // Creates new playlist
  const newPlaylist = await prisma.playlist.create({
    data: {
      name: playlistName,
      userId: dbUser.id,
      isDefault: false,
      isPublic: false,
    },
  });

  return NextResponse.json(newPlaylist, { status: 201 });
}, createPlaylistSchema);
