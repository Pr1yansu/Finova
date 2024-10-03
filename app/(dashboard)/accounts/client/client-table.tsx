"use client";
import React from "react";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { FinancialAccount } from "@prisma/client";
import { bulkDeleteFinancialAccounts } from "@/actions/financial-account";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const ClientTable = ({
  data,
  error,
}: {
  data?: FinancialAccount[];
  error?: string;
}) => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  return (
    <div>
      <DataTable
        columns={columns}
        data={error ? [] : data || []}
        onDelete={(row) => {
          setLoading(true);
          const ids = row.map((r) => r.original.id);
          bulkDeleteFinancialAccounts(ids)
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
