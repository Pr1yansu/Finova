"use server";
import { z } from "zod";
import { ResetSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { generatePasswordResetToken } from "@/lib/tokens";
import { sendMail } from "@/lib/mails";
import { render } from "@react-email/components";
import ResetPasswordEmail from "@/templates/reset-password";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.errors,
    };
  }

  const { email } = validatedFields.data;

  const user = await getUserByEmail(email);

  if (!user) {
    return {
      error: "User not found",
    };
  }

  if (!user.password) {
    return {
      error: "Please use provider login",
    };
  }

  const { token } = await generatePasswordResetToken(email);

  const emailTemplate = await render(
    ResetPasswordEmail({
      resetPasswordLink: `${process.env.FRONTEND_URL}/auth/new-password?token=${token}`,
      userFirstName: user.name?.split(" ")[0] || "sir/madam",
    })
  );

  const { error } = await sendMail(email, "Reset your password", emailTemplate);

  if (error) {
    return {
      error: "An error occurred. Please try again!",
    };
  }

  return {
    success: "Reset email sent!",
  };
};
