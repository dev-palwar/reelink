"use client";

import { getUserPlaylists } from "@/controllers/playlist";
import DummyImage from "@/assets/dummycard.jpg";
import Image from "next/image";
import { formatDate } from "@/lib/api/helpers";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Playlist } from "@/generated/prisma/client";
import Loader from "@/components/reusables/Loader";

export default function Me() {
  const { data: userPlaylists, isLoading } = useQuery({
    queryKey: ["user-playlists"],
    queryFn: () => getUserPlaylists(),
  });

  return (
    <div className="min-h-screen flex flex-col gap-8">
      <h1 className="text-4xl font-bold capitalize">Your Playlists</h1>
      <div className="flex flex-wrap gap-4">
        {isLoading ? (
          <div className="w-full min-h-screen flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          userPlaylists?.map((playlist: Playlist) => (
            <div className="basis-48" key={playlist.id}>
              <Link href={`/playlists/${playlist.id}`}>
                <PlaylistCard playlist={playlist} />
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export function PlaylistCard({ playlist }: { playlist: Playlist }) {
  return (
    <div className="relative group flex flex-col gap-2">
      <Image
        src={playlist.coverImage || DummyImage}
        alt={playlist.name}
        width={300}
        height={300}
        className="object-cover"
      />
      <div className="flex p-4 absolute bottom-0 left-0 w-full h-full bg-linear-to-t from-black via-black/40 to-transparent items-end">
        <div className="flex flex-col gap-1">
          <p className="text-xl font-medium leading-relaxed capitalize">
            {playlist.name || "Untitled Playlist"}
          </p>
          <p className="text-sm text-foreground/70 font-medium">
            {formatDate(playlist.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}
