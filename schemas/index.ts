import * as z from "zod";

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    email: z.optional(
      z.string().email({
        message: "Please enter a valid email",
      })
    ),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }

      if (!data.password && data.newPassword) {
        return false;
      }

      return true;
    },
    {
      message: "Please enter your current password and new password",
      path: ["newPassword"],
    }
  );

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email",
  }),
  password: z.string().min(1, {
    message: "Please enter a valid password",
  }),
  code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email",
  }),
  password: z
    .string()
    .min(6, {
      message: "Password must be at least 6 characters",
    })
    .max(100, {
      message: "Password must be less than 100 characters",
    }),
  name: z.string().min(1, {
    message: "Please enter your name",
  }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email",
  }),
});

export const NewPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, {
        message: "Password must be at least 6 characters",
      })
      .max(100, {
        message: "Password must be less than 100 characters",
      }),
    confirmPassword: z.string().min(6, {
      message: "Password must be at least 6 characters",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
