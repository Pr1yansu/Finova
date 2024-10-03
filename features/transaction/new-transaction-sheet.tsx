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
import { transactionSchema } from "@/schemas/finance";
import { useNewTransaction } from "@/hooks/transaction/use-new-transaction";
import { createTransaction } from "@/actions/transactions";
import { FinancialTransactionForm } from "@/components/forms/financial-transaction-form";
import { FinancialAccount, FinancialCategory } from "@prisma/client";
import { createFinancialCategory } from "@/actions/financial-categories";
import { createFinancialAccount } from "@/actions/financial-account";

type FormValues = z.infer<typeof transactionSchema>;

interface NewTransactionSheetProps {
  accounts: FinancialAccount[] | [];
  categories: FinancialCategory[] | [];
}

const NewTransactionSheet = ({
  accounts,
  categories,
}: NewTransactionSheetProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [success, setSuccess] = React.useState<string | undefined>(undefined);
  const { isOpen, onClose } = useNewTransaction();

  const onSubmit = (data: FormValues) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      createTransaction(data)
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

  const onCreateCategory = (name: string) => {
    startTransition(() => {
      createFinancialCategory({ name })
        .then((response) => {
          if (response) {
            if (response.error) {
              if (response.error instanceof Array) {
                setError(response.error.join(", "));
                toast.error(response.error.join(", "));
              } else {
                setError(response.error);
                toast.error(response.error);
              }
            } else if (response.success) {
              setSuccess(response.success);
              toast.success(response.success);
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

  const onCreateAccount = (name: string) => {
    startTransition(() => {
      createFinancialAccount({ name })
        .then((response) => {
          if (response) {
            if (response.error) {
              if (response.error instanceof Array) {
                setError(response.error.join(", "));
                toast.error(response.error.join(", "));
              } else {
                setError(response.error);
                toast.error(response.error);
              }
            } else if (response.success) {
              setSuccess(response.success);
              toast.success(response.success);
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

  const categoryOptions = (categories ?? []).map((category) => ({
    label: category.name,
    value: category.id,
  }));

  const accountOptions = (accounts ?? []).map((account) => ({
    label: account.name,
    value: account.id,
  }));

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New Transaction</SheetTitle>
          <SheetDescription>
            Create a new Transaction to start tracking your expenses.
          </SheetDescription>
        </SheetHeader>
        <FinancialTransactionForm
          onSubmit={onSubmit}
          error={error}
          success={success}
          accounts={accountOptions}
          categories={categoryOptions}
          onCreateCategory={onCreateCategory}
          onCreateAccount={onCreateAccount}
          defaultValues={{
            accountId: "",
            categoryId: "",
            amount: Number.NaN,
            notes: "",
            date: new Date(),
            payee: "",
          }}
          disabled={isPending}
        />
      </SheetContent>
    </Sheet>
  );
};

export default NewTransactionSheet;
