"use server";
import { prisma } from "@/lib/db";
import { getUserByEmail, getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { SettingsSchema } from "@/schemas";
import { z } from "zod";
import bcrpyt from "bcryptjs";
import { generateVerificationToken } from "@/lib/tokens";
import { sendMail } from "@/lib/mails";
import { render } from "@react-email/components";
import VerificationEmail from "@/templates/email-verification-token";
import { signIn } from "@/auth";
import { cookies } from "next/headers";

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

    // Handle monthly budget clearing or parsing
    let monthlyBudgetValue: number | null | undefined = values.monthlyBudget;
    if (monthlyBudgetValue === undefined || monthlyBudgetValue === null || Number.isNaN(monthlyBudgetValue)) {
      monthlyBudgetValue = null;
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

      // Generate composite token: prefix with user ID to support secure email changes
      const verificationToken = await generateVerificationToken(
        `${user.id}/${values.email}`
      );

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

    // Prepare data to update
    const updateData: any = {
      ...values,
      monthlyBudget: monthlyBudgetValue,
    };

    // Remove keys that are undefined to avoid overriding database fields
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    await prisma.user.update({
      where: { id: user.id },
      data: updateData,
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

export const getSwitchableAccounts = async () => {
  try {
    const user = await currentUser();
    if (!user || !user.email) {
      return {
        error: "Unauthorized",
      };
    }

    const cookieStore = cookies();

    // If the current user is a real user (not the pre-seeded demo/admin test accounts),
    // store their email in a secure cookie so they can switch back to it later.
    const isTestAccount = user.email === "demo@finova.test" || user.email === "admin@finova.test";
    if (!isTestAccount) {
      cookieStore.set("original_user_email", user.email, {
        path: "/",
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    }

    const originalEmail = cookieStore.get("original_user_email")?.value;

    // We only allow switching between the active user, demo, admin, and their original account.
    const allowedEmails = new Set<string>();
    allowedEmails.add(user.email);
    allowedEmails.add("demo@finova.test");
    allowedEmails.add("admin@finova.test");
    if (originalEmail) {
      allowedEmails.add(originalEmail);
    }

    const accounts = await prisma.user.findMany({
      where: {
        email: {
          in: Array.from(allowedEmails),
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return {
      data: accounts,
    };
  } catch (error) {
    console.error("Failed to get switchable accounts:", error);
    return {
      error: "Failed to fetch switchable accounts",
    };
  }
};

export const switchAccount = async (email: string) => {
  try {
    const user = await currentUser();
    if (!user) {
      return {
        error: "Unauthorized",
      };
    }

    const targetUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!targetUser) {
      return {
        error: "User not found",
      };
    }

    await signIn("credentials", {
      email,
      isSwitch: "true",
      redirectTo: "/",
    });

    return {
      success: "Switched account successfully",
    };
  } catch (error) {
    // If it is a Next.js redirect error (which uses throw), let it propagate
    if (
      error instanceof Error &&
      (error.message === "NEXT_REDIRECT" || error.constructor.name === "RedirectError")
    ) {
      throw error;
    }
    
    console.error("Failed to switch account:", error);
    return {
      error: error instanceof Error ? error.message : "An error occurred during switching",
    };
  }
};
