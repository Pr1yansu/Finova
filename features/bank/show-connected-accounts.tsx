"use client";
import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { getBankAccounts, storeTransactionsFromPlaid } from "@/actions/banks";
import { useShowBanks } from "@/hooks/use-show-banks";
import { useSession } from "next-auth/react";
import { FileSearch2, Landmark } from "lucide-react";
import AccountsFilter from "@/components/filter/accounts-filter";
import { getFinancialAccountByUserId } from "@/actions/financial-account";
import { FinancialAccount } from "@prisma/client";
import { toast } from "sonner";
import { AccountBase } from "plaid";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/use-confirm";

const ShowConnectedAccountsSheet = () => {
  const user = useSession().data?.user;
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure you want to import transactions?",
    "You are about to import transactions from this Bank. "
  );
  const { isOpen, onClose } = useShowBanks();
  const [data, setData] = useState<AccountBase[][]>([]);
  const [accounts, setAccounts] = useState<FinancialAccount[]>([]);
  const [accountId, setAccountId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user?.id && accountId) {
      setLoading(true);
      getBankAccounts(user.id as string, accountId).then((response) => {
        setLoading(false);
        if (response.error) {
          toast.error(response.error);
        } else {
          if (response.data) {
            setData(response.data);
          } else {
            setData([]);
          }
        }
      });
    }
  }, [user, accountId]);

  useEffect(() => {
    if (user?.id) {
      getFinancialAccountByUserId(user.id as string)
        .then((response) => {
          if (response.error) {
            console.error(response.error);
          } else if (response.data) {
            setAccounts(response.data);
          }
        })
        .catch(() => {
          toast.error("Error fetching accounts");
        });
    }
  }, [user]);

  if (!user?.id) {
    return null;
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-4">
          <Skeleton className="w-20 h-20" />
        </div>
      );
    }

    if (data.length > 0) {
      return (
        <div className="py-6 w-full text-center text-gray-500">
          <p className="mb-4">Data Loaded: {data.length} accounts found</p>
          <div className="grid grid-cols-2 gap-2   justify-center items-center">
            {data.map((account, index) => (
              <Button
                key={index}
                className="h-auto flex flex-col items-center justify-center border-dashed border-2 p-4"
                variant={"outline"}
                onClick={async () => {
                  const ok = await confirm();
                  if (ok) {
                    storeTransactionsFromPlaid(user.id as string, accountId)
                      .then((response) => {
                        if (response.error) {
                          toast.error(response.error);
                        } else {
                          if (response.success) {
                            toast.success(response.success);
                          }
                        }
                      })
                      .catch(() => {
                        toast.error("An error occurred");
                      });
                  }
                }}
              >
                <Landmark size={36} />
                <p className="mt-2">{account[0].name}</p>
                <p>{account[0].type}</p>
              </Button>
            ))}
          </div>
        </div>
      );
    } else {
      return (
        <div className="text-center border border-dashed p-6 w-full flex-col flex justify-center items-center text-gray-500">
          <FileSearch2 size={36} />
          <p className="text-gray-500 text-lg mt-4">No data</p>
        </div>
      );
    }
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              Your accounts are connected to the following banks
            </SheetTitle>
            <SheetDescription>
              You can view all your bank accounts and transactions from here.
              You can fetch transactions, view balances, and more. by clicking
              on the bank account.
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-2 mt-2">
            <AccountsFilter
              accounts={accounts}
              onSelected={(id) => setAccountId(id)}
              selected={accountId}
            />
            {renderContent()}
          </div>
        </SheetContent>
      </Sheet>
      <ConfirmDialog />
    </>
  );
};

export default ShowConnectedAccountsSheet;
