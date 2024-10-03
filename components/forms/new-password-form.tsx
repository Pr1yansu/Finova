"use client";
import { Suspense, useState, useTransition } from "react";
import { z } from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import CardWrapper from "@/components/wrappers/card-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FormError from "@/components/form-error";
import FormSuccess from "@/components/form-success";
import { NewPasswordSchema } from "@/schemas";
import { useRouter, useSearchParams } from "next/navigation";
import { newPassword } from "@/actions/new-password";

const NewPasswordForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const password = useWatch({
    control: form.control,
    name: "password",
  });

  const confirmPassword = useWatch({
    control: form.control,
    name: "confirmPassword",
  });

  const passwordsMatch = password === confirmPassword && password !== "";

  const onSubmit = (data: z.infer<typeof NewPasswordSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      newPassword(data, token)
        .then((data) => {
          if (data) {
            if (data.error) {
              if (Array.isArray(data.error)) {
                setError(
                  data.error[0].message + " " + data.error[0].path.join(" ")
                );
              } else {
                setError(data.error);
              }
            } else {
              setSuccess(data.success);
              form.reset();
              router.push("/auth/login");
            }
          }
        })
        .catch((error) => {
          if (error instanceof Error) {
            setError(error.message);
            return;
          }
          setError("An error occurred. Please try again.");
        });
    });
  };

  if (!token) {
    router.push("/auth/login");
  }

  return (
    <CardWrapper
      headerLabel="Forgot your password?"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    placeholder="********"
                    type="password"
                    className={`${
                      passwordsMatch ? "ring-emerald-500" : "ring-destructive"
                    }`}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="********"
                    type="password"
                    className={`${
                      passwordsMatch
                        ? "focus-visible:ring-emerald-500"
                        : "focus-visible:ring-destructive"
                    }`}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button type="submit" className="w-full" disabled={isPending}>
            Send reset email
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export const WrappedNewPasswordForm = () => {
  return (
    <Suspense fallback={null}>
      <NewPasswordForm />
    </Suspense>
  );
};
