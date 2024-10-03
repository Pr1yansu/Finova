"use server";
import prisma from "@/lib/db";
import { getUserByEmail, getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { SettingsSchema } from "@/schemas";
import { z } from "zod";
import bcrpyt from "bcryptjs";
import { generateVerificationToken } from "@/lib/tokens";
import { sendMail } from "@/lib/mails";
import { render } from "@react-email/components";
import VerificationEmail from "@/templates/email-verification-token";

type SettingsKeys = keyof z.infer<typeof SettingsSchema>;

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  try {
    const user = await currentUser();

    if (!user || !user.id) {
      return {
        error: "Unauthorized",
      };
    }

    const dbUser = await getUserById(user.id);

    if (!dbUser) {
      return {
        error: "Unauthorized",
      };
    }

    Object.keys(values).forEach((key) => {
      if (values[key as SettingsKeys] === "") {
        delete values[key as SettingsKeys];
      }
    });

    if (user.isOAuth) {
      values.email = undefined;
      values.password = undefined;
      values.newPassword = undefined;
      values.isTwoFactorEnabled = undefined;
    }

    if (values.email && values.email !== dbUser.email) {
      const existingUser = await getUserByEmail(values.email);

      if (existingUser && existingUser.id !== user.id) {
        return {
          error: "Email already in use",
        };
      }

      const verificationToken = await generateVerificationToken(values.email);

      const template = await render(
        VerificationEmail({ verificationToken: verificationToken.token })
      );

      await sendMail(values.email, "Email Verification", template);

      return {
        success: "Verification email sent",
      };
    }

    if (values.password && values.newPassword && dbUser.password) {
      const isValid = await bcrpyt.compare(values.password, dbUser.password);

      if (!isValid) {
        return {
          error: "Invalid password",
        };
      }

      const hashedPassword = await bcrpyt.hash(values.newPassword, 10);

      values.password = hashedPassword;
      values.newPassword = undefined;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        ...values,
      },
    });

    return {
      success: "Data updated successfully",
    };
  } catch (error) {
    console.log(error);

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
