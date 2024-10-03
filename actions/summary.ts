"use server";
import { currentUser } from "@/lib/auth";
import prisma from "@/lib/db";
import { parse, differenceInDays, subDays } from "date-fns";
import { calculatePercentageChange, fillMissingDays } from "@/lib/utils";
import { getColorForCategory } from "@/lib/utils";

interface filterFields {
  accountId?: string;
  from?: string;
  to?: string;
}

const fetchFinancialData = async (
  userId: string,
  startDate: Date,
  endDate: Date,
  accountId?: string
) => {
  const incomeResult = await prisma.transactions.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      financialAccount: {
        userId: userId,
      },
      date: {
        gte: startDate,
        lte: endDate,
      },
      amount: {
        gte: 0,
      },
      ...(accountId && { financialAccountId: accountId }),
    },
  });

  const expensesResult = await prisma.transactions.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      financialAccount: {
        userId: userId,
      },
      date: {
        gte: startDate,
        lte: endDate,
      },
      amount: {
        lt: 0,
      },
      ...(accountId && { financialAccountId: accountId }),
    },
  });

  const remainingResult = await prisma.transactions.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      financialAccount: {
        userId: userId,
      },
      date: {
        gte: startDate,
        lte: endDate,
      },
      ...(accountId && { financialAccountId: accountId }),
    },
  });

  return {
    income: incomeResult._sum?.amount || 0,
    expenses: expensesResult._sum?.amount || 0,
    remaining: remainingResult._sum?.amount || 0,
  };
};

export const getSummary = async (filters: filterFields) => {
  const user = await currentUser();
  if (!user) {
    return {
      error: "Unauthorized",
    };
  }
  const { accountId, from, to } = filters;

  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo, 30);

  const startDate = from ? parse(from, "yyyy-MM-dd", new Date()) : defaultFrom;

  const endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : defaultTo;

  const periodLength = differenceInDays(endDate, startDate) + 1;

  const lastPeriodStart = subDays(startDate, periodLength);

  const lastPeriodEnd = subDays(endDate, periodLength);

  const currentPeriod = await fetchFinancialData(
    user.id as string,
    startDate,
    endDate,
    accountId
  );
  const lastPeriod = await fetchFinancialData(
    user.id as string,
    lastPeriodStart,
    lastPeriodEnd,
    accountId
  );

  const incomeChange = calculatePercentageChange(
    lastPeriod.income,
    currentPeriod.income
  );

  const expensesChange = calculatePercentageChange(
    lastPeriod.expenses,
    currentPeriod.expenses
  );

  const remainingChange = calculatePercentageChange(
    lastPeriod.remaining,
    currentPeriod.remaining
  );

  const categoryData = await prisma.transactions.groupBy({
    by: ["categoryId"],
    _sum: {
      amount: true,
    },
    where: {
      financialAccount: {
        userId: user.id as string,
      },
      date: {
        gte: startDate,
        lte: endDate,
      },
      amount: {
        gt: 0,
      },
      ...(accountId && { financialAccountId: accountId }),
    },
    orderBy: {
      _sum: {
        amount: "desc",
      },
    },
  });

  const categoryIds = categoryData
    .map((item) => item.categoryId)
    .filter(Boolean) as string[];

  const categories = await prisma.financialCategory.findMany({
    where: {
      id: {
        in: categoryIds,
      },
    },
  });

  const categoriesWithSum = categoryData.map((item) => {
    const category = categories.find((cat) => cat.id === item.categoryId);
    return {
      name: category?.name || "Unknown",
      value: Math.abs(item._sum.amount || 0),
      color: getColorForCategory(),
    };
  });

  const topCategories = categoriesWithSum.slice(0, 3);
  const otherCategories = categoriesWithSum.slice(3);
  const otherSum = otherCategories.reduce((acc, item) => acc + item.value, 0);

  const finalCategories = topCategories;
  if (otherCategories.length > 0) {
    finalCategories.push({
      name: "Other",
      value: otherSum,
      color: getColorForCategory("Other"),
    });
  }

  const activeDaysIncome = await prisma.transactions.groupBy({
    by: ["date"],
    _sum: {
      amount: true,
    },
    where: {
      financialAccount: {
        userId: user.id as string,
      },
      date: {
        gte: startDate,
        lte: endDate,
      },
      amount: {
        gte: 0,
      },
      ...(accountId && { financialAccountId: accountId }),
    },
    orderBy: {
      date: "asc",
    },
  });

  const activeDaysExpenses = await prisma.transactions.groupBy({
    by: ["date"],
    _sum: {
      amount: true,
    },
    where: {
      financialAccount: {
        userId: user.id as string,
      },
      date: {
        gte: startDate,
        lte: endDate,
      },
      amount: {
        lt: 0,
      },
      ...(accountId && { financialAccountId: accountId }),
    },
    orderBy: {
      date: "asc",
    },
  });

  const activeDays = activeDaysIncome.map((incomeItem) => {
    return {
      date: incomeItem.date,
      income: incomeItem._sum.amount || 0,
      expenses: 0,
    };
  });

  activeDaysExpenses.forEach((expenseItem) => {
    const found = activeDays.find((day) => day.date === expenseItem.date);
    if (found) {
      found.expenses = expenseItem._sum.amount || 0;
    } else {
      activeDays.push({
        date: expenseItem.date,
        income: 0,
        expenses: Math.abs(expenseItem._sum.amount || 0),
      });
    }
  });

  const days = fillMissingDays(activeDays, startDate, endDate);

  const totalJson = {
    remainingChange,
    incomeChange,
    expensesChange,
    income: currentPeriod.income,
    expenses: currentPeriod.expenses,
    remaining: currentPeriod.remaining,
    categories: finalCategories,
    days,
  };

  return {
    data: totalJson,
  };
};
