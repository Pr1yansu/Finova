"use client";
import { convertAmountToUnits, formatDateRange, formatCurrency } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import React from "react";
import { FaPiggyBank, FaBullseye } from "react-icons/fa";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import DataCard from "./data-card";
import { useCurrentUser } from "@/hooks/use-current-user";

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
  const user = useCurrentUser();
  const currency = user?.defaultCurrency || "INR";
  const budget = user?.monthlyBudget; // in units (e.g. 50000)

  const to = params.get("to") || undefined;
  const from = params.get("from") || undefined;

  const period = { from, to };

  const dateRangeLabel = formatDateRange(period);

  // Convert aggregate sums to standard units
  const income = convertAmountToUnits(data?.income || 0);
  const expenses = convertAmountToUnits(data?.expenses || 0);
  const remaining = convertAmountToUnits(data?.remaining || 0);

  // Spent is the positive value of expenses (negative in DB)
  const spent = Math.abs(expenses);

  // Resolve dynamic fourth card configuration (Savings Rate or Remaining Budget)
  let fourthCardTitle = "Savings Rate";
  let fourthCardValue = income > 0 ? (remaining / income) * 100 : 0;
  let fourthCardVariant: "default" | "success" | "danger" | "warning" = "default";
  let fourthCardSubtext = "";
  let fourthCardIcon = FaPiggyBank;
  let isPercentage = true;

  if (budget && budget > 0) {
    fourthCardTitle = "Remaining Budget";
    fourthCardValue = budget - spent;
    fourthCardIcon = FaBullseye;
    isPercentage = false;
    
    const percentSpent = budget > 0 ? (spent / budget) * 100 : 0;
    if (percentSpent > 100) {
      fourthCardVariant = "danger";
      fourthCardSubtext = `Over budget by ${formatCurrency(spent - budget, currency)}`;
    } else if (percentSpent > 80) {
      fourthCardVariant = "warning";
      fourthCardSubtext = `Spent ${percentSpent.toFixed(0)}% of ${formatCurrency(budget, currency)} budget`;
    } else {
      fourthCardVariant = "success";
      fourthCardSubtext = `${formatCurrency(budget - spent, currency)} left of ${formatCurrency(budget, currency)}`;
    }
  } else {
    fourthCardIcon = FaArrowTrendUp;
    isPercentage = true;
    if (fourthCardValue >= 20) {
      fourthCardVariant = "success";
      fourthCardSubtext = `Healthy savings rate (${fourthCardValue.toFixed(0)}% saved)`;
    } else if (fourthCardValue > 0) {
      fourthCardVariant = "warning";
      fourthCardSubtext = `Savings rate is ${fourthCardValue.toFixed(0)}% (Target: 20%)`;
    } else {
      fourthCardVariant = "danger";
      fourthCardSubtext = "No savings in this period";
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-2 mb-8">
      <DataCard
        title="Remaining"
        value={remaining}
        percentageChange={data?.remainingChange}
        icon={FaPiggyBank}
        dateRange={dateRangeLabel}
      />
      <DataCard
        title="Income"
        value={income}
        percentageChange={data?.incomeChange}
        icon={FaArrowTrendUp}
        dateRange={dateRangeLabel}
        variant={"success"}
      />
      <DataCard
        title="Expenses"
        value={expenses}
        percentageChange={data?.expensesChange}
        icon={FaArrowTrendDown}
        dateRange={dateRangeLabel}
        variant={"danger"}
      />
      <DataCard
        title={fourthCardTitle}
        value={fourthCardValue}
        icon={fourthCardIcon}
        dateRange={dateRangeLabel}
        variant={fourthCardVariant}
        isPercentage={isPercentage}
        customSubtext={fourthCardSubtext}
      />
    </div>
  );
};

export default DataGrid;
