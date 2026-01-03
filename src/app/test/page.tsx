"use client";
import { Button } from "@/components/ui/button";

export default function TestPage() {
  const seedHandler = async () => {
    const response = await fetch("/api/test/seed");
    const data = await response.json();
    console.log(data);
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <Button onClick={seedHandler}>Seed Database</Button>
    </div>
  );
}
