import Image from "next/image";
import Link from "next/link";
import { UserIcon } from "lucide-react";

interface CastCardProps {
  id: number;
  name: string;
  profile_path: string;
}

export default function CastCard({ data }: { data: CastCardProps }) {
  return (
    <Link href={`/actor/${data.id}`}>
      <div className="relative group">
        {data.profile_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/w500${data.profile_path}`}
            alt={data.name}
            width={300}
            height={300}
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex justify-center items-center">
            <UserIcon size={30} />
          </div>
        )}

        <div className="hidden group-hover:flex p-4 absolute bottom-0 left-0 w-full h-full bg-background/80 backdrop-blur-sm items-end">
          <div className="flex flex-col gap-2">
            <p className="text-xl font-medium leading-relaxed">{data.name}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
