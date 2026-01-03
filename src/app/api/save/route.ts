import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { movieId, playlistId } = await req.json();

  const user = await currentUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const res = prisma.playlist.findFirst({
    where: {
      id: playlistId,
      userId: user.id,
    },
  });
}
