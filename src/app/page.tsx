"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";
import Anya from "@/assets/anya.png";
import Image from "next/image";

export default function Home() {
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      console.log(e.currentTarget.value);
    }
  };

  return (
    <div className="min-h-screen">
      <Input
        placeholder="Search for a movie TV show or Anime"
        className="w-full bg-black dark:bg-white border-none rounded-none shadow-none p-6 mt-8 text-black"
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
        onKeyDown={handleSearch}
      />
      <div className="flex justify-center items-center h-screen">
        <Image src={Anya} alt="Anya" width={300} height={300} />
      </div>
    </div>
  );
}
