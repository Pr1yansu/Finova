import { clsx, type ClassValue } from "clsx";
import { eachDayOfInterval, format, isSameDay, subDays } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertAmountToMiliUnits = (amount: number) => {
  return amount * 1000;
};

export const convertAmountToUnits = (amount: number) => {
  return amount / 1000;
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

export function calculatePercentageChange(previous: number, current: number) {
  if (previous === 0) {
    return previous === current ? 0 : 100;
  }

  return ((current - previous) / previous) * 100;
}

export const fillMissingDays = (
  activeDays: {
    date: Date;
    income: number;
    expenses: number;
  }[],
  startDate: Date,
  endDate: Date
) => {
  if (activeDays.length === 0) {
    return [];
  }

  const allDays = eachDayOfInterval({ start: startDate, end: endDate });

  const transactionsByDate = allDays.map((date) => {
    const found = activeDays.find((day) => isSameDay(day.date, date));

    if (found) {
      return found;
    } else {
      return {
        date,
        income: 0,
        expenses: 0,
      };
    }
  });

  return transactionsByDate;
};

type Period = {
  from: string | Date | undefined;
  to: string | Date | undefined;
};

export const formatDateRange = (period: Period) => {
  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo, 30);

  if (!period.from) {
    return `${format(defaultFrom, "LLL dd")} - ${format(
      defaultTo,
      "LLL dd,y"
    )}`;
  }

  if (period.to) {
    return `${format(period.from, "LLL dd")} - ${format(
      period.to,
      "LLL dd,y"
    )}`;
  }

  return `${format(period.from, "LLL dd, y")}`;
};

export const formatPercentage = (
  percentage: number,
  options: { addPrefix?: boolean } = {
    addPrefix: false,
  }
) => {
  const result = new Intl.NumberFormat("en-US", {
    style: "percent",
  }).format(percentage / 100);

  return options.addPrefix ? `+${result}` : result;
};

const goldenRatio = 0.618033988749895;
let hue = Math.random();

export const getColorForCategory = (other?: string): string => {
  if (other === "Other") {
    return `hsl(0, 0%, 85%)`;
  }

  hue = (hue + goldenRatio) % 1;

  const saturation = 60 + Math.random() * 10;
  const lightness = 65 + Math.random() * 10;

  return `hsl(${Math.floor(hue * 360)}, ${Math.floor(
    saturation
  )}%, ${Math.floor(lightness)}%)`;
};
