"use server";

import { z } from "zod";
import { RegisterSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import VerificationEmail from "@/templates/email-verification-token";
import { render } from "@react-email/components";
import { sendMail } from "@/lib/mails";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  try {
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
      return {
        error: validatedFields.error.errors,
      };
    }

    const { email, password, name } = validatedFields.data;

    const userExists = await getUserByEmail(email);

    if (userExists) {
      return {
        error: "Email already in use",
      };
    }

    const user = await prisma.user.create({
      data: {
        email,
        password: await bcrypt.hash(password, 10),
        name,
      },
    });

    const { token } = await generateVerificationToken(email);

    const emailTemplate = await render(
      VerificationEmail({
        verificationToken: token,
      })
    );

    const { error } = await sendMail(user.email, "verify-email", emailTemplate);

    if (error) {
      await prisma.user.delete({
        where: {
          id: user.id,
        },
      });
      return {
        error: "An error occurred. Please try again!",
      };
    }

    return {
      success: "Confirmation email sent!",
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        error: error.message,
      };
    }
    return {
      error: "An error occurred. Please try again",
    };
  }
};
