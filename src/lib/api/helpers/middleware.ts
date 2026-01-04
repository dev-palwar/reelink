import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ZodSchema } from "zod";

type ApiHandler<T = any> = (
  req: Request,
  context: {
    clerkUser: NonNullable<Awaited<ReturnType<typeof currentUser>>>;
    dbUser: NonNullable<Awaited<ReturnType<typeof prisma.user.findUnique>>>;
    body?: T;
  }
) => Promise<NextResponse>;

export function withAuth<T = undefined>(
  handler: ApiHandler<T>,
  schema?: ZodSchema<T>
) {
  return async (req: Request, ...args: any[]) => {
    try {
      // Checks authentication
      const clerkUser = await currentUser();

      if (!clerkUser) {
        return NextResponse.json(
          { error: "Unauthorized - Please sign in" },
          { status: 401 }
        );
      }

      // Gets database user
      const dbUser = await prisma.user.findUnique({
        where: { clerkId: clerkUser.id },
      });

      if (!dbUser) {
        return NextResponse.json(
          { error: "User not found in database" },
          { status: 404 }
        );
      }

      // Validates body if schema provided (for POST/PUT requests)
      let body: T | undefined;
      if (schema) {
        try {
          const rawBody = await req.json();
          body = schema.parse(rawBody);
        } catch (error: any) {
          return NextResponse.json(
            {
              error: "Validation failed",
              details: error.errors?.map((e: any) => ({
                field: e.path.join("."),
                message: e.message,
              })),
            },
            { status: 400 }
          );
        }
      }

      // Calls handler
      return handler(req, { clerkUser, dbUser, body });
    } catch (error) {
      return NextResponse.json(
        { error: "Internal server error - middleware failed" },
        { status: 500 }
      );
    }
  };
}
