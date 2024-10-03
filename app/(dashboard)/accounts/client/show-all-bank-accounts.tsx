"use client";
import { Button } from "@/components/ui/button";
import { useShowBanks } from "@/hooks/use-show-banks";
import { useSubscriptionModal } from "@/hooks/use-subscription";
import { Premium } from "@prisma/client";
import { User } from "next-auth";
import React from "react";
import { toast } from "sonner";

interface ExtendedUser extends User {
  Premium: Premium[];
}

const ShowAllBankAccountsBtn = ({
  children,
  user,
}: {
  children: React.ReactNode;
  user: ExtendedUser | null;
}) => {
  const { onOpen } = useShowBanks();
  const { onOpen: onSubscriptionOpen } = useSubscriptionModal();
  if (!user) {
    return null;
  }
  return (
    <Button
      size={"sm"}
      variant={"outline"}
      onClick={() => {
        if (user.Premium.length === 0 || !user.Premium[0].active) {
          onSubscriptionOpen();
          toast.error("Please upgrade to premium to use this feature");
          return;
        }
        onOpen();
      }}
    >
      {children}
    </Button>
  );
};

export default ShowAllBankAccountsBtn;
