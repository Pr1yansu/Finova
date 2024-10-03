import React from "react";
import {
  ChartContainer,
  ChartTooltipContent,
  ChartConfig,
  ChartTooltip,
} from "@/components/ui/chart";
import { XAxis, CartesianGrid, LineChart, Line } from "recharts";
import { format } from "date-fns";
import { convertAmountToUnits } from "@/lib/utils";

interface LineVariantProps {
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

const LineVariant = ({ data }: LineVariantProps) => {
  const formattedData = data?.map((item) => {
    return {
      ...item,
      income: convertAmountToUnits(item.income),
      expenses: convertAmountToUnits(item.expenses),
    };
  });

  return (
    <ChartContainer config={chartConfig}>
      <LineChart data={formattedData}>
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
              stopOpacity={0.8}
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
              stopOpacity={0.8}
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
        <Line
          dataKey="income"
          stroke="url(#fillIncome)"
          name="Income"
          dot={false}
          strokeWidth={2}
          className="drop-shadow-sm"
        />
        <Line
          dataKey="expenses"
          stroke="url(#fillExpenses)"
          name="Expenses"
          dot={false}
          strokeWidth={2}
          className="drop-shadow-sm"
        />
        <ChartTooltip content={<ChartTooltipContent />} />
      </LineChart>
    </ChartContainer>
  );
};

export default LineVariant;
