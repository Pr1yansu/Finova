"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import Actions from "./actions";
import {
  FinancialAccount,
  FinancialCategory,
  Transactions,
} from "@prisma/client";
import { format } from "date-fns";
import { convertAmountToUnits, formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import AccountColumn from "../columns/account-column";
import CategoryColumn from "../columns/category-column";

interface Transaction extends Transactions {
  category: FinancialCategory | null;
  financialAccount: FinancialAccount;
}

export const columns: ColumnDef<Transaction>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0 h-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => format(new Date(row.original.date), "dd MMM, yyyy"),
  },
  {
    accessorKey: "payee",
    header: "Payee",
  },
  {
    header: "Amount",
    cell: ({ row }) => {
      return (
        <Badge variant={row.original.amount > 0 ? "primary" : "destructive"}>
          {formatCurrency(convertAmountToUnits(row.original.amount))}
        </Badge>
      );
    },
  },
  {
    accessorKey: "category.name",
    header: "Category",
    cell: ({ row }) => (
      <CategoryColumn
        id={row.original.id}
        categoryId={row.original.categoryId}
        categoryName={row.original.category?.name}
      />
    ),
  },
  {
    accessorKey: "financialAccount.name",
    header: "Account",
    cell: ({ row }) => (
      <AccountColumn
        accountId={row.original.financialAccountId}
        accountName={row.original.financialAccount.name}
      />
    ),
  },
  {
    id: "Actions",
    cell: ({ row }) => <Actions id={row.original.id} />,
  },
];
