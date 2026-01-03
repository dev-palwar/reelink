import ReelCard from "../reusables/ReelCard";

export default function CardGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 10 }).map((_, index) => (
        <ReelCard key={index} />
      ))}
    </div>
  );
}
