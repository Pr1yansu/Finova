import React from "react";
import {
  ChartContainer,
  ChartTooltipContent,
  ChartConfig,
  ChartTooltip,
} from "@/components/ui/chart";
import { XAxis, AreaChart, Area, CartesianGrid } from "recharts";
import { format } from "date-fns";
import { convertAmountToUnits } from "@/lib/utils";

interface AriaVariantProps {
  data:
    | {
        date: Date;
        income: number;
        expenses: number;
      }[]
    | undefined;
}

const chartConfig = {
  income: {
    label: "Income",
    color: "hsl(var(--chart-1))",
  },
  expenses: {
    label: "Expenses",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const AriaVariant = ({ data }: AriaVariantProps) => {
  const formattedData = data?.map((item) => {
    return {
      ...item,
      income: convertAmountToUnits(item.income),
      expenses: convertAmountToUnits(item.expenses),
    };
  });

  return (
    <ChartContainer config={chartConfig}>
      <AreaChart data={formattedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <defs>
          <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-income)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-income)"
              stopOpacity={0.1}
            />
          </linearGradient>
          <linearGradient id="fillExpenses" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-expenses)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-expenses)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <XAxis
          axisLine={false}
          dataKey="date"
          tickFormatter={(date) => format(date, "MMM dd")}
          tickLine={false}
          tickMargin={10}
          tickSize={10}
          fontSize={12}
        />
        <Area
          type={"monotone"}
          dataKey={"income"}
          strokeWidth={2}
          stackId={"income"}
          stroke={"var(--color-income)"}
          fill={"url(#fillIncome)"}
          className="drop-shadow-sm"
        />
        <Area
          type={"monotone"}
          dataKey={"expenses"}
          stackId={"expenses"}
          strokeWidth={2}
          stroke={"var(--color-expenses)"}
          fill={"url(#fillExpenses)"}
          className="drop-shadow-sm"
        />
        <ChartTooltip content={<ChartTooltipContent />} />
      </AreaChart>
    </ChartContainer>
  );
};

export default AriaVariant;
