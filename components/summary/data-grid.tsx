"use client";
import { convertAmountToUnits, formatDateRange } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import React from "react";
import { FaPiggyBank } from "react-icons/fa";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import DataCard from "./data-card";

interface DataGridProps {
  data:
    | {
        remainingChange: number;
        incomeChange: number;
        expensesChange: number;
        income: number;
        expenses: number;
        remaining: number;
        categories: { name: string; value: number }[];
        days: { date: Date; income: number; expenses: number }[];
      }
    | undefined;
}

const DataGrid = ({ data }: DataGridProps) => {
  const params = useSearchParams();

  const to = params.get("to") || undefined;
  const from = params.get("from") || undefined;

  const period = { from, to };

  const dateRangeLabel = formatDateRange(period);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8">
      <DataCard
        title="Remaining"
        value={convertAmountToUnits(data?.remaining || 0)}
        percentageChange={data?.remainingChange}
        icon={FaPiggyBank}
        dateRange={dateRangeLabel}
      />
      <DataCard
        title="Income"
        value={convertAmountToUnits(data?.income || 0)}
        percentageChange={data?.incomeChange}
        icon={FaArrowTrendUp}
        dateRange={dateRangeLabel}
        variant={"success"}
      />
      <DataCard
        title="Expenses"
        value={convertAmountToUnits(data?.expenses || 0)}
        percentageChange={data?.expensesChange}
        icon={FaArrowTrendDown}
        dateRange={dateRangeLabel}
        variant={"danger"}
      />
    </div>
  );
};

export default DataGrid;
