import Image from "next/image";
import { ReelNotFound } from "../../svgs/ReelNotFound";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { ReelCardProps } from "@/types";

export default function ReelCard({ data }: { data: ReelCardProps }) {
  return (
    <Link href={`/${data.media_type}/${data.id}`}>
      <div className="relative group">
        {data.poster_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/w500${data.poster_path}`}
            alt={data.title ? data.title : data.name || ""}
            width={300}
            height={300}
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex justify-center items-center">
            <ReelNotFound />
          </div>
        )}

        <div className="hidden group-hover:flex p-4 absolute bottom-0 left-0 w-full h-full bg-background/80 backdrop-blur-sm items-end">
          <div className="flex flex-col gap-2">
            <p className="text-sm text-foreground/70 font-medium">
              {data.media_type}
            </p>
            <p className="text-xl font-medium leading-relaxed">
              {data.title ? data.title : data.name}
            </p>
            <p className="text-sm text-foreground/70 font-medium">
              {data.first_air_date
                ? formatDate(data.first_air_date)
                : data.release_date
                ? formatDate(data.release_date)
                : "N/A"}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
