import React from "react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Cell, Legend, Pie, PieChart } from "recharts";
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

const PieVariant = ({ data }: PieVariantProps) => {
  const formattedData = data.map((entry) => {
    return {
      ...entry,
      value: convertAmountToUnits(entry.value),
    };
  });

  return (
    <ChartContainer config={chartConfig}>
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent />} />
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
        <Pie
          data={formattedData}
          cx="50%"
          cy="50%"
          outerRadius={90}
          innerRadius={60}
          fill="#8884d8"
          dataKey={"value"}
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  );
};

export default PieVariant;
