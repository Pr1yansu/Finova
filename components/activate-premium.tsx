"use client";

import React from "react";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { useSubscriptionModal } from "@/hooks/use-subscription";
import { LuSparkles } from "react-icons/lu";

const ActivatePremiumBtn = () => {
  const { onOpen } = useSubscriptionModal();
  
  return (
    <DropdownMenuItem onClick={onOpen} className="w-full p-0 focus:bg-transparent focus:text-white cursor-pointer">
      <button className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white text-xs font-bold shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] border-none outline-none">
        <span className="flex items-center gap-1.5">
          <LuSparkles className="size-3.5 fill-white animate-pulse" />
          Upgrade to Premium
        </span>
        <span className="text-[9px] bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
          Go PRO
        </span>
      </button>
    </DropdownMenuItem>
  );
};

export default ActivatePremiumBtn;
