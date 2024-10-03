import * as z from "zod";

export const financialSchema = z.object({
  name: z.string({
    message: "Please enter a valid name",
  }),
  plaidId: z.optional(z.string()).nullable(),
});

export const transactionSchema = z.object({
  amount: z.number({
    message: "Amount must be a valid number",
  }),
  payee: z.string({
    message: "Please enter a valid payee",
  }),
  notes: z.string().nullable().optional(),
  date: z.coerce.date(),
  accountId: z.string({
    message: "Please select an account",
  }),
  categoryId: z.string().nullable().optional(),
});

export const updateTransactionSchema = z.object({
  amount: z.optional(
    z
      .number({
        message: "Amount must be a valid number",
      })
      .min(0, "Amount must be greater than or equal to 0")
  ),
  payee: z.optional(z.string({ message: "Please enter a valid payee" })),
  notes: z.optional(z.string()).nullable(),
  date: z.optional(z.coerce.date()),
  accountId: z.optional(z.string({ message: "Please select an account" })),
  categoryId: z
    .optional(z.string({ message: "Please select a category" }))
    .nullable(),
});
