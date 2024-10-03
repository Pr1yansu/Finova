"use client";
import { Button } from "@/components/ui/button";
import { useNewAccount } from "@/hooks/account/use-new-account";
import React from "react";

const OpenAccountSheetBtn = ({ children }: { children: React.ReactNode }) => {
  const { onOpen } = useNewAccount();
  return (
    <div>
      <Button size={"sm"} variant={"outline"} onClick={onOpen}>
        {children}
      </Button>
    </div>
  );
};

export default OpenAccountSheetBtn;
