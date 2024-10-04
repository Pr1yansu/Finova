import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusIcon } from "@radix-ui/react-icons";
import React from "react";
import OpenAccountSheetBtn from "./client/open-account-sheet";

import { getFinancialAccounts } from "@/actions/financial-account";
import ClientTable from "./client/client-table";
import { Search } from "lucide-react";
import ShowAllBankAccountsBtn from "./client/show-all-bank-accounts";
import { currentUser } from "@/lib/auth";
import { getUserById } from "@/data/user";

interface Props {
  searchParams: {
    search: string;
  };
}

const Accounts = async ({ searchParams }: Props) => {
  const user = await currentUser();

  if (!user || !user?.id) {
    return (
      <div className="flex items-center justify-center h-full w-full text-center">
        <h4 className="text-lg font-semibold text-gray-500">
          You need to be logged in to view this page
        </h4>
      </div>
    );
  }

  const dbUser = await getUserById(user?.id as string);

  const { data, error } = await getFinancialAccounts(searchParams.search || "");
  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="flex md:flex-row gap-y-2 md:items-center md:justify-between">
          <CardTitle className="line-clamp-1 text-xl">Accounts</CardTitle>
          <div className="flex gap-2 items-center">
            <OpenAccountSheetBtn>
              <>
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Account
              </>
            </OpenAccountSheetBtn>
            <ShowAllBankAccountsBtn user={dbUser || null}>
              <>
                <Search className="h-5 w-5 mr-2" />
                Connected Banks
              </>
            </ShowAllBankAccountsBtn>
          </div>
        </CardHeader>
        <CardContent>
          <ClientTable data={data} error={error} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Accounts;
