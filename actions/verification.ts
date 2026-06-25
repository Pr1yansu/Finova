"use server";
import { prisma } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";

export const verifyEmail = async (token: string) => {
  const verificationToken = await getVerificationTokenByToken(token);

  if (!verificationToken) {
    return {
      error: "Invalid token",
    };
  }

  if (verificationToken.expiresAt < new Date()) {
    return {
      error: "Token has expired",
    };
  }

  // Parse composite token (userId/newEmail) if this is an email change request
  const isEmailChange = verificationToken.email.includes("/");
  let user = null;
  let targetEmail = verificationToken.email;

  if (isEmailChange) {
    const [userId, newEmail] = verificationToken.email.split("/");
    user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    targetEmail = newEmail;
  } else {
    user = await getUserByEmail(verificationToken.email);
  }

  if (!user) {
    return {
      error: "User not found",
    };
  }

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      emailVerified: new Date(),
      email: targetEmail,
    },
  });

  await prisma.verificationToken.delete({
    where: {
      id: verificationToken.id,
    },
  });

  return {
    user,
  };
};
