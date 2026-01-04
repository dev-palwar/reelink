import { withAuth } from "@/lib/api/helpers/middleware";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = withAuth(async (req, context) => {
  const playlistItems = await prisma.playlistItem.findMany({
    where: { userId: context.dbUser.id },
    select: {
      movieId: true,
      playlistId: true,
    },
  });

  return NextResponse.json(playlistItems);
});
