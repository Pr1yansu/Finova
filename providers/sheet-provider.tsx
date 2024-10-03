"use client";
import React from "react";
import { useMountedState } from "react-use";
import NewAccountSheet from "@/features/accounts/new-account-sheet";
import EditAccountSheet from "@/features/accounts/edit-account-sheet";
import EditCategorySheet from "@/features/category/edit-category-sheet";
import NewCategorySheet from "@/features/category/new-category-sheet";
import NewTransactionSheet from "@/features/transaction/new-transaction-sheet";
import { FinancialAccount, FinancialCategory } from "@prisma/client";
import EditTransactionSheet from "@/features/transaction/edit-transaction-sheet";
import ShowConnectedAccountsSheet from "@/features/bank/show-connected-accounts";

interface SheetProviderProps {
  financialAccount?: FinancialAccount[];
  financialCategories?: FinancialCategory[];
  financialAccountError?: string | null;
  financialCategoriesError?: string | null;
}

const SheetProvider = ({
  financialAccount,
  financialCategories,
  financialAccountError,
  financialCategoriesError,
}: SheetProviderProps) => {
  const isMounted = useMountedState();
  if (!isMounted) return null;
  return (
    <>
      <NewAccountSheet />
      <EditAccountSheet />
      <NewCategorySheet />
      <EditCategorySheet />
      <NewTransactionSheet
        accounts={financialAccountError ? [] : financialAccount || []}
        categories={financialCategoriesError ? [] : financialCategories || []}
      />
      <EditTransactionSheet
        accounts={financialAccountError ? [] : financialAccount || []}
        categories={financialCategoriesError ? [] : financialCategories || []}
      />
      <ShowConnectedAccountsSheet />
    </>
  );
};

export default SheetProvider;
