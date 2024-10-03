import { getFinancialAccountByUserId } from "@/actions/financial-account";
import { currentUser } from "@/lib/auth";
import React from "react";
import AccountsFilter from "../filter/accounts-filter";
import DateFilter from "../filter/date-filter";

const Filters = async () => {
  const user = await currentUser();
  if (!user) return null;
  const { data: accounts, error } = await getFinancialAccountByUserId(
    user.id as string
  );
  return (
    <div className="flex gap-2 items-center">
      <AccountsFilter accounts={error ? [] : accounts} />
      <DateFilter />
    </div>
  );
};

export default Filters;
