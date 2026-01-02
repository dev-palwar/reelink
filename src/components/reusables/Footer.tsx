import { Typography } from "@/components/ui/typography";

export default function Footer() {
  return (
    <div className="flex justify-center items-center">
      <footer className="text-white py-4">
        <div className="container mx-auto">
          <Typography variant="helpText">
            &copy; {new Date().getFullYear()} Reelink. All rights reserved.
          </Typography>
        </div>
      </footer>
    </div>
  );
}
