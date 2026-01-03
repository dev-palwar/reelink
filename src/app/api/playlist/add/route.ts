import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { playlistId, movieId } = await req.json();
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Find the database user using clerkId
  const user = await prisma.user.findUnique({
    where: {
      clerkId: clerkUser.id,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Get the current max position in the playlist
  const maxPosition = await prisma.playlistItem.findFirst({
    where: { playlistId },
    orderBy: { position: "desc" },
    select: { position: true },
  });

  const playlistItem = await prisma.playlistItem.create({
    data: {
      playlistId,
      movieId,
      userId: user.id, // Use database user's id
      position: (maxPosition?.position ?? -1) + 1, // Add to end of playlist
      // addedAt is automatic with @default(now())
    },
  });

  return NextResponse.json(playlistItem);
}
