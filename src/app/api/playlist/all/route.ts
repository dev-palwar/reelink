import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { withAuth } from "@/lib/api/helpers/middleware";

export const GET = withAuth(async (req, context) => {
  const playlists = await prisma.playlist.findMany({
    where: {
      userId: context.dbUser.id,
    },
  });
  return NextResponse.json(playlists);
});
