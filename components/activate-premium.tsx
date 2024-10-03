"use client";
import React from "react";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { useSubscriptionModal } from "@/hooks/use-subscription";

const ActivatePremiumBtn = () => {
  const { onOpen } = useSubscriptionModal();
  return <DropdownMenuItem onClick={onOpen}>Active premium</DropdownMenuItem>;
};

export default ActivatePremiumBtn;
