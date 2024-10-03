"use client";
import { z } from "zod";
import { TrashIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { financialSchema } from "@/schemas/finance";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import FormError from "../form-error";
import FormSuccess from "../form-success";

type FormValues = z.infer<typeof financialSchema>;

type Props = {
  id?: string;
  defaultValues?: FormValues;
  onSubmit: (data: FormValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
  error?: string;
  success?: string;
};

export const FinancialCategoryForm = ({
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
  id,
  error,
  success,
}: Props) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(financialSchema),
    defaultValues: defaultValues,
  });

  const handleSubmit = (data: FormValues) => {
    onSubmit(data);
  };

  const handleDelete = () => {
    onDelete?.();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 pt-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Cash, Bank, Credit Card"
                  {...field}
                  type="text"
                  disabled={disabled}
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
          {id ? "Save changes" : "Create Category"}
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
            Delete Category
          </Button>
        )}
      </form>
    </Form>
  );
};
