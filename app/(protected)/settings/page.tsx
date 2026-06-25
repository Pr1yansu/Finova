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
import { settings } from "@/actions/settings";
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

const Settings = () => {
  const user = useCurrentUser();
  const router = useRouter();
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [success, setSuccess] = React.useState<string | undefined>(undefined);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: user?.name ?? "",
      isTwoFactorEnabled: user?.isTwoFactorEnabled ?? false,
      email: user?.email ?? "",
    },
  });

  useEffect(() => {
    form.reset({
      name: user?.name ?? "",
      isTwoFactorEnabled: user?.isTwoFactorEnabled ?? false,
      email: user?.email ?? "",
    });
  }, [user, form]);

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

  return (
    <Card className="max-w-[480px] w-full border-none shadow-2xl rounded-2xl overflow-hidden bg-white/95 backdrop-blur-md">
      {/* Premium Profile Header Block */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-8 text-white flex flex-col items-center text-center relative">
        <div className="size-20 rounded-full bg-white/10 backdrop-blur-md border-4 border-white/30 flex items-center justify-center text-3xl font-extrabold text-white shadow-xl mb-3 hover:scale-105 transition duration-300 select-none">
          {user?.name?.charAt(0).toUpperCase() || "U"}
        </div>
        <h2 className="text-2xl font-bold tracking-tight font-montserrat">{user?.name || "User Profile"}</h2>
        <p className="text-xs text-blue-200/90 font-medium mt-0.5">{user?.email}</p>
        {user?.isOAuth && (
          <span className="mt-3 px-2.5 py-1 text-[10px] font-semibold bg-white/20 text-white rounded-full uppercase tracking-wider">
            Social Account
          </span>
        )}
      </div>

      <CardContent className="p-6 pt-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} type="text" className="h-10 border-gray-200 focus-visible:ring-blue-500 rounded-lg bg-white" />
                  </FormControl>
                  {user?.isOAuth && (
                    <FormDescription className="text-[11px] text-gray-400">
                      Profile details are managed by your social provider.
                    </FormDescription>
                  )}
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {user?.isOAuth ? null : (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Address</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isPending} type="email" className="h-10 border-gray-200 focus-visible:ring-blue-500 rounded-lg bg-white" />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Current Password</FormLabel>
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
                        <FormLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider">New Password</FormLabel>
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
              </>
            )}

            {user?.isOAuth ? null : (
              <FormField
                control={form.control}
                name="isTwoFactorEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-xl border border-gray-100 bg-gray-50/50 p-4 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm font-semibold text-gray-800">Two-Factor Auth</FormLabel>
                      <FormDescription className="text-xs text-gray-500 leading-normal max-w-[260px]">
                        Secure your account by requiring an email OTP code on login.
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
            )}

            <FormError message={error} />
            <FormSuccess message={success} />

            <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-100">
              <Button
                type="button"
                disabled={isPending}
                variant="outline"
                onClick={async () => {
                  await signOut();
                }}
                className="w-1/2 h-10 rounded-lg border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 transition font-medium"
              >
                Sign out
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="w-1/2 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-md hover:shadow-lg transition duration-200 border-none"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="p-6 bg-gray-50/50 border-t border-gray-100 flex flex-col items-center space-y-4">
        <div>
          Go back to{" "}
          <Link
            href="/"
            className="text-blue-600 font-semibold hover:text-blue-700 hover:underline text-sm transition"
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
