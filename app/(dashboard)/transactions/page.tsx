import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ClientTable from "./client/client-table";
import { getTransactions } from "@/actions/transactions";
import { getFinancialAccountByUserId } from "@/actions/financial-account";
import { currentUser } from "@/lib/auth";
import { getUserById } from "@/data/user";

interface Props {
  searchParams: {
    search: string;
    accountId: string;
    from: string;
    to: string;
  };
}

const Transactions = async ({ searchParams }: Props) => {
  const search = searchParams.search;
  const user = await currentUser();

  const dbUser = await getUserById(user?.id as string);

  const { data, error } = await getTransactions({
    search,
    accountId: searchParams.accountId,
    from: searchParams.from,
    to: searchParams.to,
  });

  if (!user || !user?.id) {
    <div className="flex items-center justify-center h-full w-full text-center">
      <h4 className="text-lg font-semibold text-gray-500">
        You need to be logged in to view this page
      </h4>
    </div>;
  }

  const { data: accounts } = await getFinancialAccountByUserId(
    user?.id as string
  );

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm relative">
        <CardHeader className="flex md:flex-row gap-y-2 md:items-center md:justify-between">
          <CardTitle className="line-clamp-1 text-xl">Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientTable
            data={data}
            error={error}
            accounts={accounts || []}
            user={dbUser}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Transactions;
