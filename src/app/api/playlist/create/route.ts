import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { playlistName } = await req.json();
  const clerkUser = await currentUser();

  if (!clerkUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Sync Clerk user with database
  // Sync Clerk user with database
  const user = await prisma.user.upsert({
    where: {
      clerkId: clerkUser.id, // Match on clerkId
    },
    update: {
      email: clerkUser.emailAddresses[0]?.emailAddress || "",
      name: clerkUser.firstName
        ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim()
        : null,
      image: clerkUser.imageUrl,
    },
    create: {
      clerkId: clerkUser.id, // Store Clerk's ID in clerkId field
      email: clerkUser.emailAddresses[0]?.emailAddress || "",
      name: clerkUser.firstName
        ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim()
        : null,
      image: clerkUser.imageUrl,
    },
  });

  // Check if playlist already exists
  const existingPlaylist = await prisma.playlist.findFirst({
    where: {
      userId: user.id,
      name: playlistName,
    },
  });

  if (existingPlaylist) {
    return NextResponse.json(
      { error: "Playlist already exists" },
      { status: 400 }
    );
  }

  // Create new playlist
  const newPlaylist = await prisma.playlist.create({
    data: {
      name: playlistName,
      userId: user.id,
      isDefault: false,
      isPublic: false,
    },
  });

  return NextResponse.json(newPlaylist);
}
