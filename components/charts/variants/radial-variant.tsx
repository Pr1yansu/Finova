import React from "react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Legend, RadialBar, RadialBarChart } from "recharts";
import { convertAmountToUnits } from "@/lib/utils";

interface PieVariantProps {
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

const RadialVariant = ({ data }: PieVariantProps) => {
  const formattedData = data.map((entry) => {
    return {
      ...entry,
      value: convertAmountToUnits(entry.value),
      fill: entry.color,
    };
  });

  return (
    <ChartContainer config={chartConfig}>
      <RadialBarChart
        cx="50%"
        cy="30%"
        innerRadius="90%"
        outerRadius="40%"
        data={formattedData}
      >
        <ChartTooltip content={<ChartTooltipContent />} />
        <RadialBar
          dataKey="value"
          label={{ position: "insideStart", fill: "#fff", fontSize: 10 }}
          background
        />
        <Legend
          layout="horizontal"
          verticalAlign="bottom"
          align="right"
          iconType="circle"
          content={({ payload }) => {
            return (
              <ul className="flex flex-col space-y-2">
                {payload &&
                  payload.map((entry, index) => {
                    return (
                      <li
                        key={`item-${index}`}
                        className="flex items-center space-x-2"
                      >
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: entry.color }}
                        />
                        <span>{entry.value}</span>
                      </li>
                    );
                  })}
              </ul>
            );
          }}
        />
      </RadialBarChart>
    </ChartContainer>
  );
};

export default RadialVariant;
