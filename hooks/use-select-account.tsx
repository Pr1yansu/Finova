import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FinancialAccount } from "@prisma/client";
import { createFinancialAccount } from "@/actions/financial-account";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Select from "@/components/select";
import { useSession } from "next-auth/react";

export const useSelectAccount = (
  acc: FinancialAccount[]
): [() => JSX.Element, () => Promise<unknown>] => {
  const session = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<FinancialAccount[]>([]);
  const [selectValue, setSelectValue] = useState<string | undefined>(undefined);
  const [promise, setPromise] = useState<{
    resolve: (value: string | undefined) => void;
  } | null>(null);

  const confirm = useCallback(
    () =>
      new Promise((resolve) => {
        setPromise({ resolve });
      }),
    []
  );

  const handleClose = useCallback(() => {
    setPromise(null);
  }, []);

  const handleConfirm = (selectedValue: string | undefined) => {
    promise?.resolve(selectedValue);
    handleClose();
  };

  const handleCancel = () => {
    promise?.resolve(undefined);
    handleClose();
  };

  useEffect(() => {
    if (!session.data?.user) return;
    setAccounts(acc);
  }, [session.data?.user, acc]);

  const onCreateAccount = (name: string) => {
    setLoading(true);
    createFinancialAccount({
      name: name,
    })
      .then((res) => {
        if (res) {
          if (res.success) {
            toast.success(res.success);
            router.refresh();
          }
          if (res.error) {
            if (res.error instanceof Array) {
              toast.error(res.error.join(", "));
            } else {
              toast.error(res.error);
            }
          }
        }
      })
      .catch(() => {
        toast.error("An error occurred while creating account");
      })
      .finally(() => {
        setLoading(false);
        setTimeout(() => {
          toast.dismiss();
        }, 2500);
      });
  };

  const ConfirmDialog = useCallback(() => {
    return (
      <Dialog open={promise !== null} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Account</DialogTitle>
            <DialogDescription>
              Please select an account to continue
            </DialogDescription>
          </DialogHeader>
          <Select
            onChange={(value) => setSelectValue(value)}
            disabled={loading}
            onCreate={onCreateAccount}
            options={accounts.map((account) => ({
              label: account.name,
              value: account.id,
            }))}
            placeholder="Select Account"
            value={selectValue}
          />
          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              onClick={() => handleConfirm(selectValue)}
              variant={"destructive"}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }, [
    promise,
    accounts,
    loading,
    onCreateAccount,
    handleClose,
    handleConfirm,
    handleCancel,
  ]);

  return [ConfirmDialog, confirm];
};
