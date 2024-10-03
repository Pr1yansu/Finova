import { FinancialAccount, Premium, User } from "@prisma/client";
import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  PlaidLinkOnSuccess,
  PlaidLinkOptions,
  usePlaidLink,
} from "react-plaid-link";
import { useRouter } from "next/navigation";
import { createPlaidLinkToken, exchangePublicToken } from "@/actions/plaid";
import { toast } from "sonner";
import { Landmark } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AccountsFilter from "./filter/accounts-filter";
import {
  getFinancialAccountByUserId,
  savePlaidIdToFinancialAccount,
} from "@/actions/financial-account";
import { useSubscriptionModal } from "@/hooks/use-subscription";

interface ExtendedUser extends User {
  Premium: Premium[];
}

interface PlaidLinkBankButtonProps {
  user: ExtendedUser;
}

const PlaidLinkBankButton = ({ user }: PlaidLinkBankButtonProps) => {
  const router = useRouter();
  const { onOpen } = useSubscriptionModal();
  const [token, setToken] = useState<string>("");
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [accounts, setAccounts] = useState<FinancialAccount[] | null>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [accessToken, setAccessToken] = useState<string>("");

  useEffect(() => {
    createPlaidLinkToken(user).then((response) => {
      if (response.error) {
        toast.error(response.error);
      } else {
        if (response.link_token) {
          setToken(response.link_token);
        }
      }
    });
  }, [user]);

  useEffect(() => {
    getFinancialAccountByUserId(user.id as string).then((response) => {
      if (response.error) {
        toast.error(response.error);
      }
      if (response.data) {
        setAccounts(response.data);
      }
    });
  }, [user]);

  const onSuccess = useCallback<PlaidLinkOnSuccess>(
    async (public_token: string) => {
      const { access_token, error, item_id } = await exchangePublicToken({
        publicToken: public_token,
        user,
      });

      if (error) {
        toast.error(error);
        return;
      }

      if (access_token && item_id) {
        setAccessToken(access_token);
        setOpenDialog(true);
      }
    },
    [user]
  );

  const config: PlaidLinkOptions = {
    token,
    onSuccess,
    onExit: () => {
      toast.info("Bank account connection cancelled");
    },
  };

  const { open, ready } = usePlaidLink(config);

  if (openDialog) {
    return (
      <>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Select an account to link to your bank account
              </DialogTitle>
              <DialogDescription>
                Select an account to link to your bank account
              </DialogDescription>
            </DialogHeader>
            <AccountsFilter
              accounts={accounts || []}
              onSelected={(accountId) => {
                setSelectedAccountId(accountId);
              }}
              selected={selectedAccountId}
            />
            <DialogFooter>
              <Button
                onClick={() => {
                  setOpenDialog(false);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (selectedAccountId.length < 1) {
                    toast.error("Please select an account.");
                    return;
                  }
                  savePlaidIdToFinancialAccount(selectedAccountId, accessToken)
                    .then((response) => {
                      if (response.error) {
                        toast.error(response.error);
                      } else {
                        if (response.success) {
                          toast.success(response.success);
                          router.refresh();
                          setOpenDialog(false);
                        }
                      }
                    })
                    .catch(() => {
                      toast.error("An error occurred");
                    });
                }}
              >
                Link Account
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <Button
        size={"icon"}
        variant={"outline"}
        onClick={() => {
          if (!user || !user.Premium.length || !user.Premium[0].active) {
            toast.error("Please upgrade to premium to use this feature");
            onOpen();
            return;
          }
          open();
        }}
        disabled={!ready}
      >
        <Landmark className="h-4 w-4" />
      </Button>
    </>
  );
};

export default PlaidLinkBankButton;
