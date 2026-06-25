"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SettingsSchema } from "@/schemas";
import React, { useEffect, useTransition } from "react";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { settings, getSwitchableAccounts, switchAccount } from "@/actions/settings";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useRouter } from "next/navigation";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import FormError from "@/components/form-error";
import FormSuccess from "@/components/form-success";
import { Switch } from "@/components/ui/switch";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  LuUser,
  LuLock,
  LuUsers,
  LuCoins,
  LuTrendingUp,
  LuLoader,
  LuArrowLeft,
} from "react-icons/lu";

const Settings = () => {
  const user = useCurrentUser();
  const router = useRouter();
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [success, setSuccess] = React.useState<string | undefined>(undefined);
  const [isPending, startTransition] = useTransition();
  const [accounts, setAccounts] = React.useState<any[]>([]);
  const [isSwitching, setIsSwitching] = React.useState<string | null>(null);

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: user?.name ?? "",
      isTwoFactorEnabled: user?.isTwoFactorEnabled ?? false,
      email: user?.email ?? "",
      defaultCurrency: user?.defaultCurrency ?? "INR",
      monthlyBudget: user?.monthlyBudget ?? undefined,
    },
  });

  useEffect(() => {
    form.reset({
      name: user?.name ?? "",
      isTwoFactorEnabled: user?.isTwoFactorEnabled ?? false,
      email: user?.email ?? "",
      defaultCurrency: user?.defaultCurrency ?? "INR",
      monthlyBudget: user?.monthlyBudget ?? undefined,
    });
  }, [user, form]);

  useEffect(() => {
    getSwitchableAccounts().then((res) => {
      if (res && res.data) {
        setAccounts(res.data);
      }
    });
  }, []);

  const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      settings(values)
        .then((res) => {
          if (res) {
            if (res.error) {
              setError(res.error);
            }

            if (res.success) {
              setSuccess(res.success);
              router.refresh();
            }
          }
        })
        .catch((error) => {
          if (error instanceof Error) {
            setError(error.message);
            return;
          }
          setError("An error occurred");
        });
    });
  };

  const handleSwitch = (email: string) => {
    setError("");
    setSuccess("");
    setIsSwitching(email);
    startTransition(() => {
      switchAccount(email)
        .then((res) => {
          if (res && res.error) {
            setError(res.error);
            setIsSwitching(null);
          } else {
            // Instant redirect to dashboard upon successful session swap
            window.location.href = "/";
          }
        })
        .catch(() => {
          setError("An error occurred while switching accounts");
          setIsSwitching(null);
        });
    });
  };

  // Dynamically resolve currency symbols for budget prefix
  const getCurrencySymbol = (currencyCode: string) => {
    switch (currencyCode) {
      case "USD":
        return "$";
      case "EUR":
        return "€";
      case "GBP":
        return "£";
      case "JPY":
        return "¥";
      case "CAD":
        return "C$";
      case "AUD":
        return "A$";
      default:
        return "₹";
    }
  };

  const currentCurrency = form.watch("defaultCurrency") || "INR";

  return (
    <Card className="max-w-[720px] w-full border-none shadow-2xl rounded-2xl overflow-hidden bg-white/95 backdrop-blur-md relative">
      {/* Full screen switching loader */}
      {isSwitching && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center space-y-4">
          <LuLoader className="size-12 text-blue-600 animate-spin" />
          <p className="text-sm font-semibold text-gray-700">
            Switching session to <span className="text-blue-600">{isSwitching}</span>...
          </p>
        </div>
      )}

      {/* Premium Gradient Banner */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-8 text-white flex flex-col md:flex-row items-center gap-6 relative">
        <div className="size-24 rounded-full bg-white/10 backdrop-blur-md border-4 border-white/30 flex items-center justify-center text-4xl font-extrabold text-white shadow-xl hover:scale-105 transition duration-300 select-none shrink-0">
          {user?.name?.charAt(0).toUpperCase() || "U"}
        </div>
        <div className="flex-1 text-center md:text-left min-w-0">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <h2 className="text-3xl font-bold tracking-tight font-montserrat truncate">
              {user?.name || "User Profile"}
            </h2>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-white/20 text-white rounded-full uppercase tracking-wider">
              {user?.role}
            </span>
          </div>
          <p className="text-sm text-blue-200/90 font-medium mt-1 truncate">{user?.email}</p>
          {user?.isOAuth && (
            <span className="inline-block mt-3 px-2.5 py-1 text-[9px] font-bold bg-white/10 border border-white/20 text-white rounded-full uppercase tracking-wider">
              Connected via Social Provider
            </span>
          )}
        </div>
        <Link
          href="/"
          className="absolute top-4 right-4 text-white/80 hover:text-white flex items-center gap-1 text-xs font-semibold bg-white/10 hover:bg-white/25 px-3 py-1.5 rounded-lg transition"
        >
          <LuArrowLeft className="size-3" /> Dashboard
        </Link>
      </div>

      <CardContent className="p-6 md:p-8">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid grid-cols-3 mb-8 bg-gray-100/80 p-1 rounded-xl">
            <TabsTrigger value="profile" className="rounded-lg py-2 text-xs md:text-sm font-semibold transition flex items-center justify-center gap-1.5">
              <LuUser className="size-4" /> Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="rounded-lg py-2 text-xs md:text-sm font-semibold transition flex items-center justify-center gap-1.5">
              <LuLock className="size-4" /> Security
            </TabsTrigger>
            <TabsTrigger value="switch" className="rounded-lg py-2 text-xs md:text-sm font-semibold transition flex items-center justify-center gap-1.5">
              <LuUsers className="size-4" /> Quick Switch
            </TabsTrigger>
          </TabsList>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Profile & Preferences Tab */}
              <TabsContent value="profile" className="space-y-5 focus-visible:ring-0 focus-visible:ring-offset-0 outline-none">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isPending} type="text" className="h-10 border-gray-200 focus-visible:ring-blue-500 rounded-lg bg-white" />
                        </FormControl>
                        {user?.isOAuth && (
                          <FormDescription className="text-[10px] text-gray-400">
                            Details managed by your social provider.
                          </FormDescription>
                        )}
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isPending || user?.isOAuth} type="email" className="h-10 border-gray-200 focus-visible:ring-blue-500 rounded-lg bg-white disabled:bg-gray-50 disabled:text-gray-400" />
                        </FormControl>
                        {user?.isOAuth && (
                          <FormDescription className="text-[10px] text-gray-400">
                            Email address is managed by your social provider and cannot be modified.
                          </FormDescription>
                        )}
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <FormField
                    control={form.control}
                    name="defaultCurrency"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                          <LuCoins className="size-3.5 text-blue-500" /> Default Currency
                        </FormLabel>
                        <Select
                          disabled={isPending}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-10 border-gray-200 focus-visible:ring-blue-500 rounded-lg bg-white">
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white border border-gray-100 shadow-xl rounded-lg">
                            <SelectItem value="INR">INR (₹) - Indian Rupee</SelectItem>
                            <SelectItem value="USD">USD ($) - US Dollar</SelectItem>
                            <SelectItem value="EUR">EUR (€) - Euro</SelectItem>
                            <SelectItem value="GBP">GBP (£) - British Pound</SelectItem>
                            <SelectItem value="JPY">JPY (¥) - Japanese Yen</SelectItem>
                            <SelectItem value="CAD">CAD (C$) - Canadian Dollar</SelectItem>
                            <SelectItem value="AUD">AUD (A$) - Australian Dollar</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-[10px] text-gray-400">
                          Format dashboard metrics and transactions in this currency.
                        </FormDescription>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="monthlyBudget"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                          <LuTrendingUp className="size-3.5 text-emerald-500" /> Monthly Spending Budget
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">
                              {getCurrencySymbol(currentCurrency)}
                            </span>
                            <Input
                              {...field}
                              disabled={isPending}
                              type="number"
                              placeholder="Not set"
                              className="h-10 pl-8 border-gray-200 focus-visible:ring-blue-500 rounded-lg bg-white"
                            />
                          </div>
                        </FormControl>
                        <FormDescription className="text-[10px] text-gray-400">
                          Set a limit to track your spending. Leave blank to disable.
                        </FormDescription>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              {/* Security & 2FA Tab */}
              <TabsContent value="security" className="space-y-5 focus-visible:ring-0 focus-visible:ring-offset-0 outline-none">
                {user?.isOAuth ? (
                  <div className="p-6 rounded-xl border border-dashed border-gray-200 bg-gray-50/50 text-center">
                    <p className="text-sm text-gray-500">
                      Security settings and credentials are managed through your social login provider.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem className="space-y-1.5">
                            <FormLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              Current Password
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={isPending}
                                type="password"
                                placeholder="••••••••"
                                className="h-10 border-gray-200 focus-visible:ring-blue-500 rounded-lg bg-white"
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem className="space-y-1.5">
                            <FormLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              New Password
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={isPending}
                                type="password"
                                placeholder="••••••••"
                                className="h-10 border-gray-200 focus-visible:ring-blue-500 rounded-lg bg-white"
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="isTwoFactorEnabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-xl border border-gray-100 bg-gray-50/50 p-4 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel className="text-sm font-semibold text-gray-800">
                              Two-Factor Authentication
                            </FormLabel>
                            <FormDescription className="text-xs text-gray-500 leading-normal max-w-[420px]">
                              Add an extra layer of security. We will email you a 6-digit verification OTP code when logging in.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              disabled={isPending}
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-blue-600"
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </TabsContent>

              {/* Quick Switch Tab */}
              <TabsContent value="switch" className="space-y-5 focus-visible:ring-0 focus-visible:ring-offset-0 outline-none">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-gray-800">Developer Quick-Switch Panel</h3>
                  <p className="text-xs text-gray-500 leading-normal">
                    Instantly switch between database profiles. Swap sessions to test dashboard metrics, permissions, and transactions.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {accounts.map((acc) => {
                    const isCurrent = acc.email === user?.email;
                    const switchingThis = isSwitching === acc.email;
                    
                    return (
                      <div
                        key={acc.id}
                        className={cn(
                          "p-4 rounded-xl border flex flex-col justify-between space-y-4 transition duration-200",
                          isCurrent
                            ? "bg-blue-50/40 border-blue-200 shadow-sm"
                            : "bg-gray-50/50 border-gray-100 hover:bg-gray-50/80 hover:border-gray-200"
                        )}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={cn(
                            "size-10 rounded-full font-bold flex items-center justify-center text-sm shadow-inner shrink-0",
                            isCurrent 
                              ? "bg-blue-600 text-white" 
                              : "bg-gray-200 text-gray-700"
                          )}>
                            {acc.name?.charAt(0).toUpperCase() || "U"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-gray-800 truncate flex items-center gap-1.5">
                              {acc.name}
                              {isCurrent && (
                                <span className="text-[9px] bg-blue-600 text-white font-bold px-1.5 py-0.5 rounded-md">
                                  Current
                                </span>
                              )}
                            </h4>
                            <p className="text-xs text-gray-500 truncate mt-0.5">{acc.email}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2.5 border-t border-gray-100/60">
                          <span className={cn(
                            "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                            acc.role === "ADMIN" 
                              ? "bg-red-50 text-red-600 border border-red-100" 
                              : "bg-gray-100 text-gray-600 border border-gray-200"
                          )}>
                            {acc.role}
                          </span>
                          {!isCurrent && (
                            <Button
                              type="button"
                              disabled={isPending || !!isSwitching}
                              onClick={() => handleSwitch(acc.email)}
                              size="sm"
                              className="h-8 px-3 text-xs font-semibold bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-800 hover:border-gray-300 shadow-sm transition"
                            >
                              {switchingThis && (
                                <LuLoader className="size-3 animate-spin mr-1.5 text-gray-500" />
                              )}
                              Switch Profile
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>

              <FormError message={error} />
              <FormSuccess message={success} />

              {/* Action Buttons Footer Block */}
              <div className="flex items-center justify-between gap-3 pt-6 border-t border-gray-100">
                <Button
                  type="button"
                  disabled={isPending || !!isSwitching}
                  variant="outline"
                  onClick={async () => {
                    await signOut();
                  }}
                  className="w-1/2 h-10 rounded-lg border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 transition font-semibold text-sm"
                >
                  Sign out
                </Button>
                <Button
                  type="submit"
                  disabled={isPending || !!isSwitching}
                  className="w-1/2 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition duration-200 border-none"
                >
                  {isPending ? (
                    <span className="flex items-center gap-1.5">
                      <LuLoader className="size-4 animate-spin" /> Saving...
                    </span>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </Tabs>
      </CardContent>

      {/* Footer Navigation Links */}
      <CardFooter className="p-6 bg-gray-50/50 border-t border-gray-100 flex flex-col items-center space-y-4">
        <div>
          Go back to{" "}
          <Link
            href="/"
            className="text-blue-600 font-bold hover:text-blue-700 hover:underline text-sm transition"
          >
            Dashboard
          </Link>
        </div>
        <div className="flex gap-x-4 text-[11px] font-semibold text-gray-400">
          <Link href="/faq" className="hover:text-blue-600 transition">
            FAQ
          </Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-blue-600 transition">
            Terms & Conditions
          </Link>
        </div>
        <div className="text-[10px] text-gray-400 font-medium">
          © 2026 Finova. All rights reserved.
        </div>
      </CardFooter>
    </Card>
  );
};

export default Settings;
