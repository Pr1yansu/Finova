"use server";
import { plaidClient } from "@/lib/plaid";
import prisma from "@/lib/db";
import { getUserById } from "@/data/user";
import { format } from "date-fns";
import { PlaidError } from "plaid";
import { convertAmountToMiliUnits } from "@/lib/utils";

export const getBankAccounts = async (userId: string, accountId: string) => {
  const user = await getUserById(userId);

  if (!user) {
    return {
      error: "User not found",
    };
  }

  if (!user.Premium.length || !user.Premium[0].active) {
    return {
      error: "Please upgrade to premium to use this feature",
    };
  }

  const financialAccounts = await prisma.financialAccount.findMany({
    where: {
      userId: user.id,
      id: accountId,
    },
  });

  const bankAccounts = await Promise.all(
    financialAccounts.map(async (account) => {
      try {
        const response = await plaidClient.accountsGet({
          access_token: account.plaidId as string,
        });

        return response.data.accounts;
      } catch (error) {
        console.log(error);
        return [];
      }
    })
  );

  return {
    data: bankAccounts,
  };
};

export const storeTransactionsFromPlaid = async (
  userId: string,
  accountId: string
) => {
  try {
    const user = await getUserById(userId);

    if (!user) {
      return { error: "User not found" };
    }

    if (user.Premium.length === 0 || !user.Premium[0].active) {
      return { error: "Please upgrade to premium to use this feature" };
    }

    const financialAccounts = await prisma.financialAccount.findMany({
      where: { userId: user.id, id: accountId },
    });

    const existingTransactions = await prisma.transactions.findMany({
      where: { financialAccountId: accountId },
    });

    const startDate = new Date(
      Math.max(
        ...existingTransactions.map((transaction) =>
          new Date(transaction.date).getTime()
        ),
        0
      )
    );

    const endDate = new Date();

    const transactions = await Promise.all(
      financialAccounts.map(async (account) => {
        try {
          const response = await plaidClient.transactionsGet({
            access_token: account.plaidId as string,
            start_date: format(startDate, "yyyy-MM-dd"),
            end_date: format(endDate, "yyyy-MM-dd"),
          });

          return response.data.transactions;
        } catch (error) {
          console.log("Error fetching transactions:", error);
          return [];
        }
      })
    );

    const flattenedTransactions = transactions.flat().map((transaction) => ({
      financialAccountId: accountId,
      amount: convertAmountToMiliUnits(transaction.amount),
      date: new Date(transaction.date),
      payee: "Plaid",
      notes: transaction.name || "",
    }));

    const uniqueTransactions = flattenedTransactions.filter(
      (value, index, self) =>
        index ===
        self.findIndex(
          (t) =>
            t.date.getTime() === value.date.getTime() &&
            t.amount === value.amount
        )
    );

    await prisma.transactions.createMany({
      data: uniqueTransactions,
    });

    return { success: "Transactions stored" };
  } catch (error) {
    const plaidError = error as PlaidError;

    if (plaidError) {
      return { error: "Plaid error" };
    }

    return { error: "An error occurred" };
  }
};

// export const createTestingPlaidTransactions = async (
//   userId: string,
//   accountId: string
// ) => {
//   try {
//     const user = await getUserById(userId);

//     if (!user) {
//       return {
//         error: "User not found",
//       };
//     }

//     const financialAccounts = await prisma.financialAccount.findMany({
//       where: {
//         userId: user.id,
//         id: accountId,
//       },
//     });

//     const firstBankAccount = await plaidClient.accountsGet({
//       access_token: financialAccounts[0].plaidId as string,
//     });

//     const authorizationResponse = await plaidClient.transferAuthorizationCreate(
//       {
//         amount: "100.00",
//         access_token: financialAccounts[0].plaidId as string,
//         account_id: firstBankAccount.data.accounts[0].account_id,
//         network: TransferNetwork.Ach,
//         ach_class: ACHClass.Ppd,
//         user: {
//           legal_name: "John Doe",
//         },
//         type: TransferType.Credit,
//       }
//     );

//     const authId = authorizationResponse.data.authorization.id;

//     const transactions = await plaidClient.transferCreate({
//       amount: "100.00",
//       access_token: financialAccounts[0].plaidId as string,
//       account_id: firstBankAccount.data.accounts[0].account_id,
//       description: "Transfer Funds",
//       authorization_id: authId,
//     });

//     console.log(transactions);

//     return {
//       success: "Transactions created",
//     };
//   } catch (error) {
//     console.log(error);

//     if (error instanceof Error) {
//       return {
//         error: error.message,
//       };
//     }

//     return {
//       error: "An error occurred",
//     };
//   }
// };
