"use client";
import React, { useTransition } from "react";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import {
  FinancialAccount,
  FinancialCategory,
  Premium,
  Transactions,
  User,
} from "@prisma/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  bulkCreateTransactions,
  bulkDeleteTransactions,
} from "@/actions/transactions";
import ImportCard from "./import-card";
import OpenTransactionSheetBtn from "./open-transaction-sheet";
import { PlusIcon } from "lucide-react";
import { transactionSchema } from "@/schemas/finance";
import { z } from "zod";
import { useSelectAccount } from "@/hooks/use-select-account";
import { LuLoader2 } from "react-icons/lu";
import ScanSelect from "@/components/scan-select";
import { useSubscriptionModal } from "@/hooks/use-subscription";

interface Transaction extends Transactions {
  category: FinancialCategory | null;
  financialAccount: FinancialAccount;
}

export enum VARIANTS {
  LIST = "list",
  IMPORT = "import",
  SCAN = "scan",
}

const INITIAL_IMPORT_RESULTS = {
  data: [],
  errors: [],
  meta: {},
};

interface ExtendedUser extends User {
  Premium: Premium[];
}

const ClientTable = ({
  data,
  error,
  accounts,
  user,
}: {
  data?: Transaction[];
  error?: string;
  accounts: FinancialAccount[];
  user: ExtendedUser | null;
}) => {
  const router = useRouter();
  const { onOpen } = useSubscriptionModal();
  const [isPending, startTransition] = useTransition();
  const [AccountDialog, confirm] = useSelectAccount(accounts || []);
  const [variant, setVariant] = React.useState<VARIANTS>(VARIANTS.LIST);
  const [importResults, setImportResults] = React.useState(
    INITIAL_IMPORT_RESULTS
  );

  const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
    if (!user || !user.Premium.length || !user.Premium[0].active) {
      toast.error("Please upgrade to premium to use this feature");
      onOpen();
      return;
    }
    setVariant(VARIANTS.IMPORT);
    setImportResults(results);
  };

  const onScan = () => {
    if (!user || !user.Premium.length || !user.Premium[0].active) {
      toast.error("Please upgrade to premium to use this feature");
      onOpen();
      return;
    }
    setVariant(VARIANTS.SCAN);
  };

  const onCancel = () => {
    setVariant(VARIANTS.LIST);
    setImportResults(INITIAL_IMPORT_RESULTS);
  };

  const [loading, setLoading] = React.useState(false);

  const onSubmitImport = async (
    values: z.infer<typeof transactionSchema>[]
  ) => {
    const accountId = (await confirm()) as string;

    if (!accountId) {
      toast.error("Please select an account");
      return;
    }

    const transactions = values.map((value) => {
      return {
        ...value,
        accountId,
      };
    });

    startTransition(() => {
      bulkCreateTransactions(transactions)
        .then((res) => {
          if (res) {
            if (res.error) {
              toast.error(res.error);
            } else {
              toast.success(res.success);
              router.refresh();
            }
          }
        })
        .catch(() => {
          toast.error("An error occurred");
        })
        .finally(() => {
          toast.dismiss();
          onCancel();
        });
    });
  };

  if (variant === VARIANTS.SCAN) {
    return (
      <>
        <ScanSelect
          onCancel={() => setVariant(VARIANTS.LIST)}
          accounts={accounts}
        />
      </>
    );
  }

  if (variant === VARIANTS.IMPORT) {
    return (
      <>
        {isPending && (
          <div className="absolute top-0 left-0 bottom-0 right-0 rounded-md flex justify-center items-center bg-black/70 z-50">
            <div className="relative">
              <LuLoader2 className="m-auto size-8 text-white animate-spin mb-2" />
              <p className="text-center text-white">Importing Please wait...</p>
            </div>
          </div>
        )}
        <ImportCard
          data={importResults.data}
          onCancel={onCancel}
          onSubmit={onSubmitImport}
        />
        <AccountDialog />
      </>
    );
  }

  return (
    <div>
      <OpenTransactionSheetBtn>
        <>
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Transaction
        </>
      </OpenTransactionSheetBtn>
      <DataTable
        columns={columns}
        onUpload={onUpload}
        user={user}
        onScan={onScan}
        data={error ? [] : data || []}
        onDelete={(row) => {
          setLoading(true);
          const ids = row.map((r) => r.original.id);
          bulkDeleteTransactions(ids)
            .then((res) => {
              if (res) {
                if (res.error) {
                  toast.error(res.error);
                } else {
                  toast.success(res.success);
                  router.refresh();
                }
              }
            })
            .catch(() => {
              toast.error("An error occurred");
            })
            .finally(() => {
              toast.dismiss();
              setLoading(false);
            });
        }}
        disabled={loading}
      />
    </div>
  );
};

export default ClientTable;
