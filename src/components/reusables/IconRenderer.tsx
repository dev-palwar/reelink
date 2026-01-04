import { HeartIcon } from "lucide-react";
import { AiFillFire, AiOutlineFire } from "react-icons/ai";
import { AiOutlineHeart } from "react-icons/ai";
import { FaImdb } from "react-icons/fa";
import { IoAddCircleOutline } from "react-icons/io5";
import { IoCheckmarkCircleOutline } from "react-icons/io5";

interface IconRendererProps {
  name: string;
  className?: string;
}

export default function IconRenderer({ name, className }: IconRendererProps) {
  switch (name) {
    case "fire-filled":
      return <AiFillFire size={30} className={className} />;
    case "fire-outlined":
      return <AiOutlineFire size={30} className={className} />;
    case "heart-filled":
      return <HeartIcon size={30} className={className} />;
    case "heart-outlined":
      return <AiOutlineHeart size={30} className={className} />;
    case "imdb":
      return <FaImdb size={30} className={className} />;
    case "add-to-watchlist":
      return <IoAddCircleOutline size={30} className={className} />;
    case "check":
      return <IoCheckmarkCircleOutline size={30} className={className} />;
    default:
      return null;
  }
}
