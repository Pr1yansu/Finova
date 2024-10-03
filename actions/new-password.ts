"use server";
import { z } from "zod";
import { NewPasswordSchema } from "@/schemas";
import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { getUserByEmail } from "@/data/user";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token?: string | null
) => {
  if (!token) {
    return {
      error: "Token not found",
    };
  }

  const validatedFields = NewPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.errors,
    };
  }

  const { password } = validatedFields.data;

  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    return {
      error: "Invalid token",
    };
  }

  if (new Date() > existingToken.expiresAt) {
    return {
      error: "Token expired",
    };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return {
      error: "User not found",
    };
  }

  await prisma.user.update({
    where: {
      email: existingToken.email,
    },
    data: {
      password: await bcrypt.hash(password, 10),
    },
  });

  return {
    success: "Password changed successfully",
  };
};
