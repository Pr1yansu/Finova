"use server";
import { z } from "zod";
import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/data/user";
import { sendMail } from "@/lib/mails";
import { render } from "@react-email/components";
import VerificationEmail from "@/templates/email-verification-token";
import {
  generateTwoFactorToken,
  generateVerificationToken,
} from "@/lib/tokens";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { getTwoFactorConfirmationByUserID } from "@/data/two-factor-confirmation";
import OtpEmail from "@/templates/two-factor-email";
import prisma from "@/lib/db";

export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string
) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.errors,
    };
  }

  const { email, password, code } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    throw new Error("Email does not exist!");
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );

    if (!verificationToken) {
      throw new Error("Verification token not found!");
    }

    const emailTemplate = await render(
      VerificationEmail({
        verificationToken: verificationToken?.token,
      })
    );

    await sendMail(existingUser.email, "verify-email", emailTemplate);

    return {
      success: "Confirmation email sent!",
    };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

      if (!twoFactorToken) {
        throw new Error("Two factor token not found!");
      }

      if (twoFactorToken.token !== code) {
        return {
          error: "Invalid two factor code!",
        };
      }

      const hasExpired = new Date(twoFactorToken.expiresAt) < new Date();

      if (hasExpired) {
        return {
          error: "Two factor code has expired!",
        };
      }

      await prisma.twoFactorToken.delete({
        where: {
          id: twoFactorToken.id,
        },
      });

      const existingTwoFactorConfirmation =
        await getTwoFactorConfirmationByUserID(existingUser.id);

      if (existingTwoFactorConfirmation) {
        await prisma.twoFactorConfirmation.delete({
          where: {
            id: existingTwoFactorConfirmation.id,
          },
        });
      }

      await prisma.twoFactorConfirmation.create({
        data: {
          user: {
            connect: {
              id: existingUser.id,
            },
          },
        },
      });
    } else {
      const { token } = await generateTwoFactorToken(existingUser.email);

      const emailTemplate = await render(
        OtpEmail({
          otp: token,
          username: existingUser.name || "sir/madam",
        })
      );

      const { error } = await sendMail(
        existingUser.email,
        "Two factor authentication",
        emailTemplate
      );

      if (error) {
        return {
          error: "An error occurred. Please try again!",
        };
      }

      return {
        twoFactor: true,
      };
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT || callbackUrl,
    });

    return {
      success: "Login successful",
    };
  } catch (error) {
    if (error instanceof AuthError) {
      console.log("Cause", error.cause?.err);

      switch (error.type) {
        case "CredentialsSignin":
          return {
            error: "Invalid email or password!",
          };
        case "OAuthAccountNotLinked":
          return {
            error: "Another account is already linked with this email!",
          };
        case "AccessDenied":
          return {
            error: error.cause?.err?.message,
          };
        case "CallbackRouteError":
          return {
            error: "Callback route error!",
          };
        default:
          return {
            error: "An error occurred. Please try again!",
          };
      }
    }
    throw error;
  }
};
