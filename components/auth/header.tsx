import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";

const font = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

interface HeaderProps {
  label: string;
}

export const Header = ({ label }: HeaderProps) => {
  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center">
      <h1 className={cn("text-3xl font-bold", font.className)}>FINOVA</h1>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
};
