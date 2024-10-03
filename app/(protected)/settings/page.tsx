"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SettingsSchema } from "@/schemas";
import React, { useEffect, useTransition } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LuSettings } from "react-icons/lu";
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
    <Card className="max-w-[460px] w-full">
      <CardHeader>
        <p className="flex items-center space-x-2 text-lg gap-2 justify-center font-bold">
          <LuSettings className="h-6 w-6" />
          Settings
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} type="text" />
                  </FormControl>
                  {user?.isOAuth && (
                    <FormDescription>
                      Other fields are disabled for Social login users
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            {user?.isOAuth ? null : (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isPending} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            type="password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            type="password"
                          />
                        </FormControl>
                        <FormMessage />
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
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-2 px-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Two-factor authentication</FormLabel>
                      <FormDescription>
                        Enable two-factor authentication for your account
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        disabled={isPending}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormError message={error} />
            <FormSuccess message={success} />
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="submit"
                disabled={isPending}
                variant="destructive"
                onClick={async () => {
                  await signOut();
                }}
              >
                Sign out
              </Button>
              <Button type="submit" variant={"outline"} disabled={isPending}>
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default Settings;
