import prisma from "@/lib/db";

export const getTwoFactorConfirmationByUserID = async (userId: string) => {
  try {
    const twoFactorConfirmation = await prisma.twoFactorConfirmation.findUnique(
      {
        where: {
          userId,
        },
      }
    );

    return twoFactorConfirmation;
  } catch {
    return null;
  }
};
