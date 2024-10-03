import { z } from "zod";
import React, { useTransition } from "react";
import {
  SheetContent,
  Sheet,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { financialSchema } from "@/schemas/finance";
import { useNewCategory } from "@/hooks/category/use-new-category";
import { createFinancialCategory } from "@/actions/financial-categories";
import { FinancialCategoryForm } from "@/components/forms/financial-category-form";

type FormValues = z.infer<typeof financialSchema>;

const NewCategorySheet = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [success, setSuccess] = React.useState<string | undefined>(undefined);
  const { isOpen, onClose } = useNewCategory();

  const onSubmit = (data: FormValues) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      createFinancialCategory(data)
        .then((response) => {
          if (response) {
            if (response.error) {
              if (response.error instanceof Array) {
                setError(response.error[0].message);
                toast.error(response.error[0].message);
              } else {
                setError(response.error);
                toast.error(response.error);
              }
            } else if (response.success) {
              setSuccess(response.success);
              toast.success(response.success);
              onClose();
              router.refresh();
            }
          }
        })
        .catch(() => {
          setError("An error occurred");
          toast.error("An error occurred");
        })
        .finally(() => {
          setTimeout(() => {
            setError("");
            setSuccess("");
            toast.dismiss();
          }, 5000);
        });
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New Category</SheetTitle>
          <SheetDescription>
            Create a new Category to start tracking your expenses.
          </SheetDescription>
        </SheetHeader>
        <FinancialCategoryForm
          onSubmit={onSubmit}
          defaultValues={{ name: "" }}
          error={error}
          success={success}
          disabled={isPending}
        />
      </SheetContent>
    </Sheet>
  );
};

export default NewCategorySheet;
