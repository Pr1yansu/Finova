import React from "react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
} from "recharts";
import { convertAmountToUnits } from "@/lib/utils";

interface RadarVariantProps {
  data: {
    name: string;
    value: number;
    color: string;
  }[];
}

const chartConfig = {
  name: {
    label: "Name",
    color: "hsl(var(--chart-1))",
  },
  value: {
    label: "Value",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const RadarVariant = ({ data }: RadarVariantProps) => {
  const formattedData = data.map((entry) => {
    return {
      ...entry,
      value: convertAmountToUnits(entry.value),
    };
  });

  return (
    <ChartContainer config={chartConfig}>
      <RadarChart cx="50%" cy="50%" outerRadius="60%" data={formattedData}>
        <ChartTooltip content={<ChartTooltipContent />} />
        <PolarGrid />
        <PolarAngleAxis dataKey="name" />
        <PolarRadiusAxis />
        <Radar dataKey="value" fill="#8884d8" fillOpacity={0.6} />
      </RadarChart>
    </ChartContainer>
  );
};

export default RadarVariant;
