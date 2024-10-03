import { z } from "zod";
import React, { useEffect, useTransition } from "react";
import {
  SheetContent,
  Sheet,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useOpenAccount } from "@/hooks/account/use-open-account";
import { FinancialAccountForm } from "@/components/forms/financial-account-form";
import { financialSchema } from "@/schemas/finance";
import {
  deleteFinancialAccountById,
  getFinancialAccountById,
  updateFinancialAccountById,
} from "@/actions/financial-account";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { FinancialAccount } from "@prisma/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useConfirm } from "@/hooks/use-confirm";

type FormValues = z.infer<typeof financialSchema>;

const EditAccountSheet = () => {
  const router = useRouter();
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure you want to delete this account?",
    "You are about to delete an account. This action cannot be undone."
  );
  const [account, setAccount] = React.useState<FinancialAccount | null>(null);
  const { isOpen, onClose, id } = useOpenAccount();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchAccount = () => {
      if (!id) return;
      setLoading(true);
      getFinancialAccountById(id)
        .then((response) => {
          if (response) {
            if (response.error) {
              toast.error(response.error);
            } else if (response.data) {
              setAccount(response.data);
              toast.success(`Account found: ${response.data.name}`);
            }
          }
        })
        .catch(() => {
          toast.error("An error occurred");
        })
        .finally(() => {
          setTimeout(() => {
            toast.dismiss();
            setLoading(false);
          }, 2000);
        });
    };
    fetchAccount();
    return () => {
      setAccount(null);
    };
  }, [id, isOpen, onClose]);

  const onSubmit = (data: FormValues) => {
    setError("");
    setSuccess("");
    if (!id) return;
    startTransition(() => {
      updateFinancialAccountById(id, data.name)
        .then((response) => {
          if (response) {
            if (response.error) {
              setError(response.error);
              toast.error(response.error);
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
    <div>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Update Account</SheetTitle>
            <SheetDescription>
              You can update the account details here.
            </SheetDescription>
          </SheetHeader>
          {loading ? (
            <div className="w-full space-y-2 mt-6">
              <Skeleton className="w-16 h-4" />
              <Skeleton className="w-full h-7" />
              <Skeleton className="w-full h-7" />
              <Skeleton className="w-full h-7" />
            </div>
          ) : (
            <>
              {account && (
                <FinancialAccountForm
                  onSubmit={onSubmit}
                  defaultValues={{ name: account.name }}
                  error={error}
                  success={success}
                  disabled={isPending}
                  id={account.id}
                  onDelete={async () => {
                    const ok = await confirm();
                    if (ok) {
                      deleteFinancialAccountById(account.id)
                        .then((response) => {
                          if (response) {
                            if (response.error) {
                              setError(response.error);
                              toast.error(response.error);
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
                    }
                  }}
                />
              )}
            </>
          )}
        </SheetContent>
      </Sheet>
      <ConfirmDialog />
    </div>
  );
};

export default EditAccountSheet;
