"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileSearch } from "lucide-react";
import CategoryBar from "./variants/category-bar";

type SpendingBarProps = {
  data?: {
    name: string;
    value: number;
    color: string;
  }[];
};

const SpendingBar = ({ data }: SpendingBarProps) => {
  return (
    <Card className="border-none drop-shadow-sm">
      <CardHeader className="flex space-y-0 items-center justify-between flex-row">
        <CardTitle className="line-clamp-1 text-xl">Category Spending</CardTitle>
      </CardHeader>
      <CardContent>
        {!data || data?.length === 0 ? (
          <div className="flex flex-col gap-y-4 items-center justify-center h-[350px]">
            <FileSearch className="size-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No data for this period. Please select a different date range.
            </p>
          </div>
        ) : (
          <CategoryBar data={data} />
        )}
      </CardContent>
    </Card>
  );
};

export default SpendingBar;
