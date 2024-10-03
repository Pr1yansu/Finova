"use client";
import { Button } from "@/components/ui/button";
import { useNewTransaction } from "@/hooks/transaction/use-new-transaction";
import React from "react";

const OpenTransactionSheetBtn = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { onOpen } = useNewTransaction();
  return (
    <div className="absolute top-6 mt-1 right-5">
      <Button size={"sm"} variant={"outline"} onClick={onOpen}>
        {children}
      </Button>
    </div>
  );
};

export default OpenTransactionSheetBtn;
