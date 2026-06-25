"use client";

import React from "react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid } from "recharts";
import { convertAmountToUnits, formatCurrency } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/use-current-user";

interface CategoryBarProps {
  data: {
    name: string;
    value: number;
    color: string;
  }[];
}

const chartConfig = {
  value: {
    label: "Spending",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const CategoryBar = ({ data }: CategoryBarProps) => {
  const user = useCurrentUser();
  const currency = user?.defaultCurrency || "INR";

  const formattedData = data.map((entry) => {
    return {
      ...entry,
      value: convertAmountToUnits(entry.value),
    };
  });

  return (
    <ChartContainer config={chartConfig}>
      <BarChart
        data={formattedData}
        layout="vertical"
        margin={{ top: 10, right: 25, left: 10, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" hide domain={[0, "dataMax * 1.15"]} />
        <YAxis
          dataKey="name"
          type="category"
          axisLine={false}
          tickLine={false}
          fontSize={11}
          width={95}
        />
        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16}>
          {formattedData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              formatter={(val) => formatCurrency(Number(val), currency)}
            />
          }
        />
      </BarChart>
    </ChartContainer>
  );
};

export default CategoryBar;
