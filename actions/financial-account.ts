"use server";
import { z } from "zod";
import { currentUser } from "@/lib/auth";
import prisma from "@/lib/db";
import { financialSchema } from "@/schemas/finance";

export const createFinancialAccount = async (
  data: z.infer<typeof financialSchema>
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

  const validatedFields = financialSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.errors,
    };
  }

  const { name, plaidId } = validatedFields.data;

  try {
    const financialAccount = await prisma.financialAccount.create({
      data: {
        name,
        userId: existingUser.id,
        plaidId,
      },
    });

    return {
      success: `${financialAccount.name} created successfully`,
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

export const getFinancialAccounts = async (search: string) => {
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

  const financialAccounts = await prisma.financialAccount.findMany({
    where: {
      userId: existingUser.id,
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          plaidId: {
            contains: search,
            mode: "insensitive",
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
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    data: financialAccounts,
  };
};

export const bulkDeleteFinancialAccounts = async (ids: string[]) => {
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
    await prisma.financialAccount.deleteMany({
      where: {
        userId: existingUser.id,
        id: {
          in: ids,
        },
      },
    });

    return {
      success: "Accounts deleted successfully",
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

export const getFinancialAccountById = async (id: string) => {
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

  const financialAccount = await prisma.financialAccount.findUnique({
    where: {
      id,
    },
  });

  if (!financialAccount) {
    return {
      error: "Account not found",
    };
  }

  return {
    data: financialAccount,
  };
};

export const updateFinancialAccountById = async (id: string, name: string) => {
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
    await prisma.financialAccount.update({
      where: {
        id,
      },
      data: {
        name,
        updatedAt: new Date(),
      },
    });

    return {
      success: "Account updated successfully",
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

export const deleteFinancialAccountById = async (id: string) => {
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
    await prisma.financialAccount.delete({
      where: {
        id,
      },
    });

    return {
      success: "Account deleted successfully",
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

export const getFinancialAccountByUserId = async (userId: string) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!existingUser) {
    return {
      error: "User not found",
    };
  }

  const financialAccounts = await prisma.financialAccount.findMany({
    where: {
      userId: existingUser.id,
    },
  });

  return {
    data: financialAccounts,
  };
};

export const savePlaidIdToFinancialAccount = async (
  financialAccountId: string,
  plaidId: string
) => {
  try {
    await prisma.financialAccount.update({
      where: {
        id: financialAccountId,
      },
      data: {
        plaidId,
        updatedAt: new Date(),
      },
    });

    return {
      success: "Successfully linked account",
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
