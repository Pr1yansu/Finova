import { z } from "zod";
import React, { useEffect, useTransition } from "react";
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
import {
  deleteTransactionById,
  getTransactionById,
  updateTransactionById,
} from "@/actions/transactions";
import { FinancialTransactionForm } from "@/components/forms/financial-transaction-form";
import {
  FinancialAccount,
  FinancialCategory,
  Transactions,
} from "@prisma/client";
import { createFinancialCategory } from "@/actions/financial-categories";
import { createFinancialAccount } from "@/actions/financial-account";
import { useOpenTransaction } from "@/hooks/transaction/use-open-transaction";
import { convertAmountToUnits } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useConfirm } from "@/hooks/use-confirm";

type FormValues = z.infer<typeof transactionSchema>;

interface NewTransactionSheetProps {
  accounts: FinancialAccount[] | [];
  categories: FinancialCategory[] | [];
}

const EditTransactionSheet = ({
  accounts,
  categories,
}: NewTransactionSheetProps) => {
  const router = useRouter();
  const [ConfirmModal, confirm] = useConfirm(
    "Are you sure you want to delete this Transaction?",
    "You are about to delete a Transaction. This action cannot be undone."
  );
  const [isPending, startTransition] = useTransition();
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [transaction, setTransaction] = React.useState<Transactions | null>(
    null
  );
  const [success, setSuccess] = React.useState<string | undefined>(undefined);
  const { isOpen, onClose, id } = useOpenTransaction();

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    getTransactionById(id)
      .then((response) => {
        if (response) {
          if (response.error) {
            toast.error(response.error);
          } else if (response.data) {
            setTransaction(response.data);
          }
        }
      })
      .catch(() => {
        toast.error("An error occurred");
      })
      .finally(() => {
        setIsLoading(false);
        toast.dismiss();
      });
  }, [id]);

  const onSubmit = (data: FormValues) => {
    setError("");
    setSuccess("");
    if (!id) return;
    startTransition(() => {
      updateTransactionById(id, data)
        .then((response) => {
          if (response) {
            if (response.error) {
              if (response.error instanceof Array) {
                setError(response.error[0].message);
                toast.error(response.error[0].message);
              } else {
                console.log(response.error);

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
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Update Transaction</SheetTitle>
            <SheetDescription>
              Update a transaction to keep your records accurate.
            </SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="w-16 h-4" />
              <Skeleton className="w-full h-10" />
              <Skeleton className="w-16 h-4" />
              <Skeleton className="w-full h-10" />
              <Skeleton className="w-16 h-4" />
              <Skeleton className="w-full h-10" />
              <Skeleton className="w-16 h-4" />
              <Skeleton className="w-full h-16" />
              <Skeleton className="w-full h-8" />
              <Skeleton className="w-full h-8" />
            </div>
          ) : (
            <>
              {transaction && (
                <FinancialTransactionForm
                  id={transaction.id}
                  onSubmit={onSubmit}
                  error={error}
                  success={success}
                  accounts={accountOptions}
                  categories={categoryOptions}
                  onCreateCategory={onCreateCategory}
                  onCreateAccount={onCreateAccount}
                  defaultValues={{
                    accountId: transaction.financialAccountId,
                    categoryId: transaction.categoryId,
                    amount: convertAmountToUnits(transaction.amount),
                    notes: transaction.notes,
                    date: new Date(transaction.date),
                    payee: transaction.payee,
                  }}
                  disabled={isPending}
                  onDelete={async () => {
                    const ok = await confirm();
                    if (!ok) return;
                    deleteTransactionById(transaction.id).then((response) => {
                      if (response) {
                        if (response.error) {
                          toast.error(response.error);
                        } else if (response.success) {
                          toast.success(response.success);
                          onClose();
                          router.refresh();
                        }
                      }
                    });
                  }}
                />
              )}
            </>
          )}
        </SheetContent>
      </Sheet>
      <ConfirmModal />
    </>
  );
};

export default EditTransactionSheet;
