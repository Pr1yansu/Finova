import React from "react";
import Header from "@/components/header/header";
import SheetProvider from "@/providers/sheet-provider";
import { getFinancialCategoriesByUserId } from "@/actions/financial-categories";
import { getFinancialAccountByUserId } from "@/actions/financial-account";
import { currentUser } from "@/lib/auth";
import ModalProvider from "@/providers/modal-provider";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await currentUser();
  const [
    { data: financialAccount, error: financialAccountError },
    { data: financialCategories, error: financialCategoriesError }
  ] = await Promise.all([
    getFinancialAccountByUserId(user?.id as string),
    getFinancialCategoriesByUserId(user?.id as string)
  ]);
  return (
    <div>
      <SheetProvider
        financialAccount={financialAccount}
        financialCategories={financialCategories}
        financialAccountError={financialAccountError}
        financialCategoriesError={financialCategoriesError}
      />
      <ModalProvider />
      <Header />
      <div className="px-4 lg:px-14">{children}</div>
    </div>
  );
};

export default DashboardLayout;
