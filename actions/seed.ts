"use server";
import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { convertAmountToMiliUnits } from "@/lib/utils";

export const seedDemoData = async () => {
  const user = await currentUser();

  if (!user || !user.id) {
    return {
      error: "Unauthorized",
    };
  }

  try {
    const userId = user.id;

    // 1. Check if user already has accounts, categories, or transactions
    const existingAccounts = await prisma.financialAccount.findMany({
      where: { userId },
    });

    const existingCategories = await prisma.financialCategory.findMany({
      where: { userId },
    });

    // 2. Find or create standard accounts
    let checkingAccount = existingAccounts.find((a) => a.name.toLowerCase() === "checking");
    let savingsAccount = existingAccounts.find((a) => a.name.toLowerCase() === "savings");

    if (!checkingAccount) {
      checkingAccount = await prisma.financialAccount.create({
        data: {
          name: "Checking",
          userId,
        },
      });
    }

    if (!savingsAccount) {
      savingsAccount = await prisma.financialAccount.create({
        data: {
          name: "Savings",
          userId,
        },
      });
    }

    // 3. Find or create standard categories
    const categoriesToCreate = [
      "Groceries",
      "Utilities",
      "Salary",
      "Rent",
      "Food & Dining",
      "Entertainment",
      "Transportation",
      "Shopping",
    ];

    const categoryMap: { [key: string]: string } = {};

    for (const catName of categoriesToCreate) {
      let cat = existingCategories.find((c) => c.name.toLowerCase() === catName.toLowerCase());
      if (!cat) {
        cat = await prisma.financialCategory.create({
          data: {
            name: catName,
            userId,
          },
        });
      }
      categoryMap[catName] = cat.id;
    }

    // 4. Create 14 rich transactions for June 2026
    const demoTransactions = [
      {
        amount: 150000,
        payee: "Tech Corp",
        notes: "Monthly Salary",
        date: new Date("2026-06-01T09:00:00.000Z"),
        accountId: checkingAccount.id,
        categoryName: "Salary",
      },
      {
        amount: -35000,
        payee: "Grand Meadows Realty",
        notes: "Apartment Rent",
        date: new Date("2026-06-02T10:00:00.000Z"),
        accountId: checkingAccount.id,
        categoryName: "Rent",
      },
      {
        amount: -8500,
        payee: "Supermart",
        notes: "Monthly Groceries",
        date: new Date("2026-06-03T14:30:00.000Z"),
        accountId: checkingAccount.id,
        categoryName: "Groceries",
      },
      {
        amount: -4200,
        payee: "State Power Corp",
        notes: "Electricity Bill",
        date: new Date("2026-06-05T11:15:00.000Z"),
        accountId: checkingAccount.id,
        categoryName: "Utilities",
      },
      {
        amount: -3500,
        payee: "The Olive Garden",
        notes: "Dinner with family",
        date: new Date("2026-06-07T20:00:00.000Z"),
        accountId: checkingAccount.id,
        categoryName: "Food & Dining",
      },
      {
        amount: -1800,
        payee: "PVR Cinemas",
        notes: "Movie tickets & snacks",
        date: new Date("2026-06-10T18:45:00.000Z"),
        accountId: checkingAccount.id,
        categoryName: "Entertainment",
      },
      {
        amount: -2500,
        payee: "Shell Fuel Station",
        notes: "Car fuel",
        date: new Date("2026-06-12T09:30:00.000Z"),
        accountId: checkingAccount.id,
        categoryName: "Transportation",
      },
      {
        amount: -12000,
        payee: "Amazon",
        notes: "Noise-cancelling headphones",
        date: new Date("2026-06-15T13:00:00.000Z"),
        accountId: checkingAccount.id,
        categoryName: "Shopping",
      },
      {
        amount: -6000,
        payee: "Fresh Foods",
        notes: "Vegetables and dairy",
        date: new Date("2026-06-18T16:00:00.000Z"),
        accountId: checkingAccount.id,
        categoryName: "Groceries",
      },
      {
        amount: 25000,
        payee: "Upwork Client",
        notes: "Freelance Web Design",
        date: new Date("2026-06-20T12:00:00.000Z"),
        accountId: checkingAccount.id,
        categoryName: "Salary",
      },
      {
        amount: -1200,
        payee: "Netflix & Spotify",
        notes: "Monthly subscriptions",
        date: new Date("2026-06-22T08:00:00.000Z"),
        accountId: checkingAccount.id,
        categoryName: "Entertainment",
      },
      {
        amount: 15000,
        payee: "Transfer to Savings",
        notes: "Monthly savings goal",
        date: new Date("2026-06-23T10:00:00.000Z"),
        accountId: savingsAccount.id,
        categoryName: "Salary",
      },
      {
        amount: -950,
        payee: "Starbucks Coffee",
        notes: "Coffee & cookies",
        date: new Date("2026-06-24T15:30:00.000Z"),
        accountId: checkingAccount.id,
        categoryName: "Food & Dining",
      },
      {
        amount: -1500,
        payee: "Airtel Broadband",
        notes: "Wifi internet bill",
        date: new Date("2026-06-25T11:00:00.000Z"),
        accountId: checkingAccount.id,
        categoryName: "Utilities",
      },
    ];

    // Check for duplicate transactions before inserting
    const existingTransactions = await prisma.transactions.findMany({
      where: {
        financialAccountId: {
          in: [checkingAccount.id, savingsAccount.id],
        },
      },
    });

    const transactionsToInsert = demoTransactions
      .filter((t) => {
        // Skip if a transaction with the same amount, payee, and date already exists
        return !existingTransactions.some(
          (existing) =>
            existing.amount === convertAmountToMiliUnits(t.amount) &&
            existing.payee === t.payee &&
            existing.date.getTime() === t.date.getTime()
        );
      })
      .map((t) => ({
        amount: convertAmountToMiliUnits(t.amount),
        payee: t.payee,
        notes: t.notes,
        date: t.date,
        financialAccountId: t.accountId,
        categoryId: categoryMap[t.categoryName] || null,
      }));

    if (transactionsToInsert.length > 0) {
      await prisma.transactions.createMany({
        data: transactionsToInsert,
      });
    }

    return {
      success: "Demo data seeded successfully!",
    };
  } catch (error) {
    console.error(error);
    return {
      error: "Failed to seed demo data. Please try again.",
    };
  }
};
