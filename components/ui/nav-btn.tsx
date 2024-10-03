import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

const NavButton = ({
  href,
  isActive,
  children,
}: {
  href: string;
  isActive?: boolean;
  children: React.ReactNode;
}) => {
  return (
    <Button
      className={cn(
        "w-full lg:w-auto justify-between font-normal hover:bg-white/20 hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white focus:bg-white/30 transition",
        isActive ? "bg-white/10 text-white" : "bg-transparent"
      )}
      asChild
      size={"sm"}
      variant={"outline"}
    >
      <Link href={href}>{children}</Link>
    </Button>
  );
};

export default NavButton;
