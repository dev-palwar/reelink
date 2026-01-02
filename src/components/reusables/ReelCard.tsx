import Image from "next/image";
import DummyImage from "@/assets/dummycard.jpg";

export default function ReelCard() {
  return (
    <div className="w-full h-full">
      <Image src={DummyImage} alt="Dummy Image" width={100} height={100} />
    </div>
  );
}
