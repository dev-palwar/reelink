import { HeartIcon } from "lucide-react";
import { AiFillFire, AiOutlineFire } from "react-icons/ai";
import { AiOutlineHeart } from "react-icons/ai";

interface IconRendererProps {
  name: string;
}

export default function IconRenderer({ name }: IconRendererProps) {
  switch (name) {
    case "fire-filled":
      return <AiFillFire size={30} />;
    case "fire-outlined":
      return <AiOutlineFire size={30} />;
    case "heart-filled":
      return <HeartIcon size={30} />;
    case "heart-outlined":
      return <AiOutlineHeart size={30} />;
    default:
      return null;
  }
}
