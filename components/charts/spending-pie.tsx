"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileSearch, PieChart, Radar, Target } from "lucide-react";
import PieVariant from "./variants/pie-variant";
import RadarVariant from "./variants/radar-chart";
import RadialVariant from "./variants/radial-variant";

type SpendingPieProps = {
  data?: {
    name: string;
    value: number;
    color: string;
  }[];
};

const SpendingPie = ({ data }: SpendingPieProps) => {
  const [chartType, setChartType] = React.useState<"pie" | "radar" | "radial">(
    "pie"
  );

  return (
    <Card className="border-none drop-shadow-sm">
      <CardHeader className="flex space-y-0 items-center justify-between flex-row">
        <CardTitle className="line-clamp-1 text-xl">Categories</CardTitle>
        <Select
          defaultValue={chartType}
          onValueChange={(value) =>
            setChartType(value as "pie" | "radar" | "radial")
          }
        >
          <SelectTrigger className="w-auto">
            <SelectValue placeholder="Variant" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pie">
              <div className="flex items-center">
                <PieChart className="size-4 text-muted-foreground mr-2" />
                Pie
              </div>
            </SelectItem>
            <SelectItem value="radar">
              <div className="flex items-center">
                <Radar className="size-4 text-muted-foreground mr-2" />
                Radar
              </div>
            </SelectItem>
            <SelectItem value="radial">
              <div className="flex items-center">
                <Target className="size-4 text-muted-foreground mr-2" />
                Radial
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
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
          <>
            {chartType === "pie" && <PieVariant data={data} />}
            {chartType === "radar" && <RadarVariant data={data} />}
            {chartType === "radial" && <RadialVariant data={data} />}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SpendingPie;
