import Image from "next/image";
import { Typography } from "../ui/typography";
import { ReelNotFound } from "../svgs/ReelNotFound";

interface ReelCardProps {
  id: number;
  title: string;
  original_title: string;
  backdrop_path: string;
  media_type: string;
  release_date: string;
  poster_path: string;
}

export default function ReelCard({
  id,
  title,
  original_title,
  backdrop_path,
  media_type,
  release_date,
  poster_path,
}: ReelCardProps) {
  return (
    <>
      <div className="">
        {poster_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/w500${poster_path}`}
            alt={original_title}
            width={300}
            height={300}
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex justify-center items-center">
            <ReelNotFound />
          </div>
        )}
      </div>
    </>
  );
}
