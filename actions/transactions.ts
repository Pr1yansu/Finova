"use server";
import { z } from "zod";
import { currentUser } from "@/lib/auth";
import prisma from "@/lib/db";
import { transactionSchema, updateTransactionSchema } from "@/schemas/finance";
import { parseISO, subDays } from "date-fns";
import { getFinancialAccountById } from "./financial-account";

interface filterFields {
  accountId?: string;
  from?: string;
  to?: string;
  search?: string;
}
export const createTransaction = async (
  data: z.infer<typeof transactionSchema>
) => {
  Object.keys(data).forEach((key) => {
    const typedKey = key as keyof typeof data;
    if (data[typedKey] === "") {
      delete data[typedKey];
    }
  });

  const user = await currentUser();

  if (!user) {
    return {
      error: "Unauthorized",
    };
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      id: user.id as string,
    },
  });

  if (!existingUser) {
    return {
      error: "User not found",
    };
  }

  const validatedFields = transactionSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.errors,
    };
  }

  const { amount, categoryId, notes, date, payee, accountId } =
    validatedFields.data;

  try {
    const { data, error } = await getFinancialAccountById(accountId);

    if (error || !data) {
      return {
        error: error,
      };
    }

    const transaction = await prisma.transactions.create({
      data: {
        amount,
        date,
        payee,
        categoryId,
        notes,
        financialAccountId: data.id,
      },
      include: {
        financialAccount: true,
      },
    });

    return {
      success: `${transaction.financialAccount.name} created successfully
        `,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        error: error.message,
      };
    }

    return {
      error: "An error occurred",
    };
  }
};

export const getTransactions = async ({
  accountId,
  from,
  to,
  search,
}: filterFields) => {
  const user = await currentUser();

  if (!user) {
    return {
      error: "Unauthorized",
    };
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      id: user.id as string,
    },
  });

  if (!existingUser) {
    return {
      error: "User not found",
    };
  }

  const startDate = from ? new Date(from) : subDays(new Date(), 30);

  const endDate = to ? new Date(to) : new Date();

  const transactions = await prisma.transactions.findMany({
    where: {
      financialAccount: {
        userId: user.id,
        ...(accountId && { id: accountId }),
      },
      date: {
        gte: startDate,
        lte: endDate,
      },
      OR: [
        {
          payee: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          category: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
        {
          financialAccount: {
            name: {
              contains: search,
              mode: "insensitive",
            },
            userId: user.id,
          },
        },
        {
          id: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    },
    include: {
      category: true,
      financialAccount: true,
    },
    orderBy: {
      date: "desc",
    },
  });

  return {
    data: transactions,
  };
};

export const getTransactionById = async (id: string) => {
  const user = await currentUser();

  if (!user) {
    return {
      error: "Unauthorized",
    };
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      id: user.id as string,
    },
  });

  if (!existingUser) {
    return {
      error: "User not found",
    };
  }

  const transaction = await prisma.transactions.findUnique({
    where: {
      financialAccount: {
        userId: user.id,
      },
      id,
    },
    include: {
      category: true,
      financialAccount: true,
    },
  });

  return {
    data: transaction,
  };
};

export const bulkDeleteTransactions = async (ids: string[]) => {
  const user = await currentUser();

  if (!user) {
    return {
      error: "Unauthorized",
    };
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      id: user.id as string,
    },
  });

  if (!existingUser) {
    return {
      error: "User not found",
    };
  }

  try {
    await prisma.transactions.deleteMany({
      where: {
        financialAccount: {
          userId: user.id,
        },
        id: {
          in: ids,
        },
      },
    });

    return {
      success: "Transactions deleted successfully",
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        error: error.message,
      };
    }

    return {
      error: "An error occurred",
    };
  }
};

export const updateTransactionById = async (
  id: string,
  data: z.infer<typeof updateTransactionSchema>
) => {
  const user = await currentUser();

  if (!user) {
    return {
      error: "Unauthorized",
    };
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      id: user.id as string,
    },
  });

  if (!existingUser) {
    return {
      error: "User not found",
    };
  }

  const validatedFields = transactionSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.errors,
    };
  }

  const { amount, categoryId, notes, date, payee, accountId } =
    validatedFields.data;

  try {
    const transaction = await prisma.transactions.update({
      where: {
        financialAccount: {
          userId: user.id,
        },
        id,
      },
      data: {
        amount,
        date,
        payee,
        categoryId,
        notes,
        financialAccountId: accountId,
      },
      include: {
        category: true,
        financialAccount: true,
      },
    });

    return {
      success: `${transaction.financialAccount.name} updated successfully`,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        error: error.message,
      };
    }

    return {
      error: "An error occurred",
    };
  }
};

export const deleteTransactionById = async (id: string) => {
  const user = await currentUser();

  if (!user) {
    return {
      error: "Unauthorized",
    };
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      id: user.id as string,
    },
  });

  if (!existingUser) {
    return {
      error: "User not found",
    };
  }

  try {
    await prisma.transactions.delete({
      where: {
        financialAccount: {
          userId: user.id,
        },
        id,
      },
      include: {
        category: true,
        financialAccount: true,
      },
    });

    return {
      success: "Transaction deleted successfully",
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        error: error.message,
      };
    }

    return {
      error: "An error occurred",
    };
  }
};

export const bulkCreateTransactions = async (
  data: z.infer<typeof transactionSchema>[]
) => {
  const user = await currentUser();

  if (!user) {
    return {
      error: "Unauthorized",
    };
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      id: user.id as string,
    },
  });

  if (!existingUser) {
    return {
      error: "User not found",
    };
  }

  const filteredData = data.filter((fields) => !isNaN(Number(fields.amount)));

  const validatedFields = filteredData.map((fields) =>
    transactionSchema.safeParse({
      ...fields,
      amount: Number(fields.amount),
    })
  );

  const errors = validatedFields.filter((fields) => !fields.success);

  if (errors.length) {
    return {
      error: errors.map((e) =>
        e.error.errors.map((e) => e.message.split(", "))
      ),
    };
  }

  const transactions = filteredData.map((fields) => {
    const { amount, categoryId, notes, date, payee, accountId } = fields;
    return {
      amount,
      date: parseISO(date as unknown as string),
      payee,
      categoryId,
      notes,
      financialAccountId: accountId,
    };
  });

  try {
    const { data, error } = await getFinancialAccountById(
      transactions[0].financialAccountId
    );

    if (error || !data) {
      return {
        error: error,
      };
    }

    console.log("creating transactions");

    const createdTransactions = await prisma.transactions.createMany({
      data: transactions.map((transaction) => ({
        ...transaction,
        financialAccountId: data.id,
      })),
    });

    return {
      success: `${createdTransactions.count} transactions created successfully`,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        error: error.message,
      };
    }

    return {
      error: "An error occurred",
    };
  }
};
