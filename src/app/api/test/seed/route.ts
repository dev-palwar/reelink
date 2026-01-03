import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const user = await prisma.user.upsert({
    where: {
      email: "test@test.com",
    },
    update: {},
    create: {
      email: "test@test.com",
    },
  });

  return NextResponse.json(user);
}
