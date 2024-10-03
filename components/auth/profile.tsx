import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { currentUser } from "@/lib/auth";
import { signOut } from "@/auth";
import { Button } from "../ui/button";
import { LuLogOut } from "react-icons/lu";
import Link from "next/link";
import ActivatePremiumBtn from "../activate-premium";
import { getUserById } from "@/data/user";

const Profile = async () => {
  const user = await currentUser();
  if (!user || !user.id) return null;
  const dbUser = await getUserById(user?.id);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user?.image || undefined} />
          <AvatarFallback>{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="space-y-2" align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href="/settings">Profile</Link>
        </DropdownMenuItem>
        {dbUser?.Premium[0]?.active ? null : <ActivatePremiumBtn />}
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <Button
            className="w-full justify-start"
            type="submit"
            variant="destructive"
            size={"sm"}
          >
            <LuLogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Profile;
