"use client";
import { z } from "zod";
import { TrashIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { transactionSchema } from "@/schemas/finance";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import FormError from "@/components/form-error";
import FormSuccess from "@/components/form-success";
import Select from "@/components/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Textarea } from "@/components/ui/textarea";
import { AmountInput } from "@/components/ui/amount-input";
import { convertAmountToMiliUnits } from "@/lib/utils";
import { useEffect } from "react";

type FormValues = z.infer<typeof transactionSchema>;

type Props = {
  id?: string;
  defaultValues?: FormValues;
  onSubmit: (data: FormValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
  error?: string;
  success?: string;
  categories?: { label: string; value: string }[];
  accounts?: { label: string; value: string }[];
  onCreateCategory: (name: string) => void;
  onCreateAccount: (name: string) => void;
};

export const FinancialTransactionForm = ({
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
  id,
  error,
  success,
  accounts,
  categories,
  onCreateCategory,
  onCreateAccount,
}: Props) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: defaultValues,
  });

  const handleSubmit = (data: FormValues) => {
    if (data.categoryId?.toLowerCase().trim() === "uncategorized") {
      data.categoryId = "";
    }
    const amount = convertAmountToMiliUnits(data.amount);
    onSubmit({ ...data, amount });
  };

  const handleDelete = () => {
    onDelete?.();
  };

  useEffect(() => {
    if (!id) return;

    form.reset(defaultValues);
  }, [id, defaultValues, form]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 pt-4"
      >
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Date <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <DatePicker
                  value={field.value}
                  onChange={(date) => field.onChange(date)}
                  disable={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="accountId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Account <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Select
                  placeholder="Select an account"
                  options={accounts}
                  onCreate={onCreateAccount}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Select
                  placeholder="Select an category"
                  options={categories}
                  onCreate={onCreateCategory}
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="payee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Payee <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter the payee"
                  disabled={disabled}
                  type="text"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Notes <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value ?? ""}
                  placeholder="Enter the notes"
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Amount <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <AmountInput
                  onChange={(value) => {
                    if (!value) return field.onChange(null);
                    field.onChange(parseFloat(value));
                  }}
                  value={field.value?.toString() || ""}
                  disabled={disabled}
                  placeholder="Enter the amount"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormError message={error} />
        <FormSuccess message={success} />
        <Button
          type="submit"
          className="w-full"
          disabled={disabled}
          variant={!!id ? "outline" : "default"}
        >
          {id ? "Save changes" : "Create Transaction"}
        </Button>
        {!!id && (
          <Button
            type="button"
            variant="destructive"
            className="w-full"
            onClick={handleDelete}
            disabled={disabled}
          >
            <TrashIcon className="size-5 mr-2" />
            Delete Transaction
          </Button>
        )}
      </form>
    </Form>
  );
};
