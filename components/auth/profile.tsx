import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { currentUser } from "@/lib/auth";
import { signOut } from "@/auth";
import { 
  LuLogOut, 
  LuUser, 
  LuLayoutDashboard, 
  LuCrown,
} from "react-icons/lu";
import Link from "next/link";
import ActivatePremiumBtn from "../activate-premium";
import { getUserById } from "@/data/user";

const Profile = async () => {
  const user = await currentUser();
  if (!user || !user.id) return null;
  const dbUser = await getUserById(user.id);
  const isPremium = !!dbUser?.Premium[0]?.active;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none outline-none border-none">
        <Avatar className="size-10 border-2 border-white/20 hover:border-white/50 transition cursor-pointer shadow-md select-none">
          <AvatarImage src={user?.image || undefined} />
          <AvatarFallback className="bg-blue-600 text-white font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72 p-3 bg-white border border-gray-100 shadow-2xl rounded-2xl space-y-3 mt-1.5" align="end">
        
        {/* User Profile Header Block */}
        <div className="px-2 py-1.5 flex items-center space-x-3">
          <div className="size-12 rounded-full bg-blue-100 text-blue-700 font-extrabold flex items-center justify-center text-lg shadow-inner shrink-0 select-none">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-gray-800 truncate flex items-center gap-1.5">
              {user?.name}
            </h4>
            <p className="text-xs text-gray-500 truncate mt-0.5">{user?.email}</p>
          </div>
        </div>

        {/* Subscription Status Block */}
        <div className="px-1">
          {isPremium ? (
            <div className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold select-none">
              <LuCrown className="size-4 fill-emerald-500 text-emerald-600 animate-pulse shrink-0" />
              <span>Premium Account Active</span>
            </div>
          ) : (
            <ActivatePremiumBtn />
          )}
        </div>

        <DropdownMenuSeparator className="bg-gray-100" />

        {/* Navigation Menu Links */}
        <div className="space-y-1">
          <DropdownMenuItem asChild className="focus:bg-blue-50 focus:text-blue-700 rounded-lg p-2.5 cursor-pointer transition">
            <Link href="/" className="flex items-center gap-2.5 text-sm font-semibold text-gray-600 w-full">
              <LuLayoutDashboard className="size-4 text-gray-500 shrink-0" />
              <span>Overview Dashboard</span>
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild className="focus:bg-blue-50 focus:text-blue-700 rounded-lg p-2.5 cursor-pointer transition">
            <Link href="/settings" className="flex items-center gap-2.5 text-sm font-semibold text-gray-600 w-full">
              <LuUser className="size-4 text-gray-500 shrink-0" />
              <span>Account Settings</span>
            </Link>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="bg-gray-100" />

        {/* Sign Out Action Item */}
        <div className="px-1">
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 transition cursor-pointer border-none bg-transparent outline-none text-left"
            >
              <LuLogOut className="size-4 shrink-0" />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Profile;
