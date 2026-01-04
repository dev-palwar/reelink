"use client";

import { getPlaylists } from "@/controllers/playlist";
import { useState } from "react";
import { useEffect } from "react";
import DummyImage from "@/assets/dummycard.jpg";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export default function Me() {
  const [allPlaylists, setAllPlaylists] = useState<any[]>([]);

  const fetchPlaylists = async () => {
    const playlists = await getPlaylists();
    setAllPlaylists(playlists);
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  return (
    <div className="min-h-screen flex flex-col gap-8">
      <h1 className="text-4xl font-bold capitalize">Your Playlists</h1>
      <div className="flex flex-wrap gap-4">
        {allPlaylists.map((playlist: any) => (
          <Link key={playlist.id} href={`/playlists/${playlist.id}`}>
            <PlaylistCard key={playlist.id} playlist={playlist} />
          </Link>
        ))}
      </div>
    </div>
  );
}

export function PlaylistCard({ playlist }: { playlist: any }) {
  return (
    <div className="relative group flex flex-col gap-2">
      <Image
        src={DummyImage}
        alt={playlist.name}
        width={300}
        height={300}
        className="object-cover"
      />
      <div className="flex p-4 absolute bottom-0 left-0 w-full h-full bg-linear-to-t from-black via-black/40 to-transparent items-end">
        <div className="flex flex-col gap-1">
          <p className="text-xl font-medium leading-relaxed capitalize">
            {playlist.name}
          </p>
          <p className="text-sm text-foreground/70 font-medium">
            {formatDate(playlist.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}
