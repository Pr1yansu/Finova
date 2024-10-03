"use client";
import { Button } from "@/components/ui/button";
import { useNewCategory } from "@/hooks/category/use-new-category";
import React from "react";

const OpenAccountSheetBtn = ({ children }: { children: React.ReactNode }) => {
  const { onOpen } = useNewCategory();
  return (
    <div>
      <Button size={"sm"} variant={"outline"} onClick={onOpen}>
        {children}
      </Button>
    </div>
  );
};

export default OpenAccountSheetBtn;
