import { z } from "zod";
import React, { useTransition } from "react";
import {
  SheetContent,
  Sheet,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useNewAccount } from "@/hooks/account/use-new-account";
import { FinancialAccountForm } from "@/components/forms/financial-account-form";
import { financialSchema } from "@/schemas/finance";
import { createFinancialAccount } from "@/actions/financial-account";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type FormValues = z.infer<typeof financialSchema>;

const NewAccountSheet = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [success, setSuccess] = React.useState<string | undefined>(undefined);
  const { isOpen, onClose } = useNewAccount();

  const onSubmit = (data: FormValues) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      createFinancialAccount(data)
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
          <SheetTitle>New Account</SheetTitle>
          <SheetDescription>
            Create a new account to start tracking your expenses.
          </SheetDescription>
        </SheetHeader>
        <FinancialAccountForm
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

export default NewAccountSheet;
