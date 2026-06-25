import { Role } from "@prisma/client";
import { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  role: Role;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
  defaultCurrency: string;
  monthlyBudget?: number | null;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
