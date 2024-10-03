"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AriaVariant from "./variants/aria-variant";
import BarVariant from "./variants/bar-variant";
import LineVariant from "./variants/line-variant";
import { AreaChart, BarChart, FileSearch, LineChart } from "lucide-react";

type ChartProps = {
  data?: {
    date: Date;
    income: number;
    expenses: number;
  }[];
};

const Chart = ({ data }: ChartProps) => {
  const [chartType, setChartType] = React.useState<"area" | "bar" | "line">(
    "area"
  );

  return (
    <Card className="border-none drop-shadow-sm">
      <CardHeader className="flex space-y-0 items-center justify-between flex-row">
        <CardTitle className="line-clamp-1 text-xl">Transactions</CardTitle>
        <Select
          defaultValue={chartType}
          onValueChange={(value) =>
            setChartType(value as "area" | "bar" | "line")
          }
        >
          <SelectTrigger className="w-auto">
            <SelectValue placeholder="Variant" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="area">
              <div className="flex items-center">
                <AreaChart className="size-4 text-muted-foreground mr-2" />
                Area
              </div>
            </SelectItem>
            <SelectItem value="bar">
              <div className="flex items-center">
                <BarChart className="size-4 text-muted-foreground mr-2" />
                Bar
              </div>
            </SelectItem>
            <SelectItem value="line">
              <div className="flex items-center">
                <LineChart className="size-4 text-muted-foreground mr-2" />
                Line
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {data?.length === 0 ? (
          <div className="flex flex-col gap-y-4 items-center justify-center h-[350px]">
            <FileSearch className="size-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No data for this period. Please select a different date range.
            </p>
          </div>
        ) : (
          <>
            {chartType === "area" && <AriaVariant data={data} />}
            {chartType === "bar" && <BarVariant data={data} />}
            {chartType === "line" && <LineVariant data={data} />}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default Chart;
