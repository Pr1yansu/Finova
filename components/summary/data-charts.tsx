import React from "react";
import Chart from "../charts/chart";
import SpendingPie from "../charts/spending-pie";
interface DataChartProps {
  data:
    | {
        remainingChange: number;
        incomeChange: number;
        expensesChange: number;
        income: number;
        expenses: number;
        remaining: number;
        categories: { name: string; value: number; color: string }[];
        days: { date: Date; income: number; expenses: number }[];
      }
    | undefined;
}

const DataCharts = ({ data }: DataChartProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
      <div className="col-span-1 lg:col-span-3 xl:col-span-4">
        <Chart data={data?.days} />
      </div>
      <div className="col-span-1 lg:col-span-3 xl:col-span-2">
        <SpendingPie data={data?.categories} />
      </div>
    </div>
  );
};

export default DataCharts;
