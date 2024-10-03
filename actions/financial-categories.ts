"use server";
import { z } from "zod";
import { currentUser } from "@/lib/auth";
import prisma from "@/lib/db";
import { financialSchema } from "@/schemas/finance";

export const createFinancialCategory = async (
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
    const financialCategory = await prisma.financialCategory.create({
      data: {
        name,
        userId: existingUser.id,
        plaidId,
      },
    });

    return {
      success: `${financialCategory.name} created successfully`,
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

export const getFinancialCategories = async (search: string) => {
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

  const FinancialCategories = await prisma.financialCategory.findMany({
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
    data: FinancialCategories,
  };
};

export const bulkDeleteFinancialCategories = async (ids: string[]) => {
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
    await prisma.financialCategory.deleteMany({
      where: {
        userId: existingUser.id,
        id: {
          in: ids,
        },
      },
    });

    return {
      success: "Categorys deleted successfully",
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

export const getfinancialCategoryById = async (id: string) => {
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

  const financialCategory = await prisma.financialCategory.findUnique({
    where: {
      id,
    },
  });

  if (!financialCategory) {
    return {
      error: "Category not found",
    };
  }

  return {
    data: financialCategory,
  };
};

export const updatefinancialCategoryById = async (id: string, name: string) => {
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
    await prisma.financialCategory.update({
      where: {
        id,
      },
      data: {
        name,
        updatedAt: new Date(),
      },
    });

    return {
      success: "Category updated successfully",
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

export const deletefinancialCategoryById = async (id: string) => {
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
    await prisma.financialCategory.delete({
      where: {
        id,
      },
    });

    return {
      success: "Category deleted successfully",
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

export const getFinancialCategoriesByUserId = async (userId: string) => {
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

  const financialCategories = await prisma.financialCategory.findMany({
    where: {
      userId: existingUser.id,
    },
  });

  return {
    data: financialCategories,
  };
};
