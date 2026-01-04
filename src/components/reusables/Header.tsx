"use client";

import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import IconRenderer from "./IconRenderer";
import { AuthButton } from "./UserButton";

export default function Header() {
  const pathname = usePathname();

  const router = useRouter();

  return (
    <div className="flex justify-between items-center sticky top-0 z-50 w-full bg-background/80 backdrop-blur-sm p-4 mb-10">
      <Button
        variant="ghost"
        className="text-2xl"
        onClick={() => router.push("/")}
      >
        🍿
      </Button>
      <div className="flex justify-end items-center gap-4">
        {pathname == "/discover" ? (
          <Link href="/discover">
            <IconRenderer name="fire-filled" />
          </Link>
        ) : (
          <Link href="/discover">
            <IconRenderer name="fire-outlined" />
          </Link>
        )}
        {/* <ModeToggle /> */}
        <AuthButton />
      </div>
    </div>
  );
}
