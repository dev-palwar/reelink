"use client";

import ModeToggle from "@/components/ui/mode-toggle";
import { Typography } from "../ui/typography";
import { HeartIcon } from "lucide-react";
import { UserButton, SignInButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { AiFillFire, AiOutlineFire } from "react-icons/ai";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import IconRenderer from "./IconRenderer";

export default function Header() {
  const { isSignedIn, isLoaded } = useUser();
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
        <ModeToggle />
        {isLoaded && (
          <>
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <SignInButton mode="modal">
                <Button variant="outline">Sign In</Button>
              </SignInButton>
            )}
          </>
        )}
      </div>
    </div>
  );
}
