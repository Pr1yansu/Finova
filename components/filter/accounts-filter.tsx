"use client";
import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FinancialAccount } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface AccountsFilterProps {
  accounts: FinancialAccount[] | [] | undefined;
  onSelected?: (accountId: string) => void;
  selected?: string;
}

const AccountsFilter = ({
  accounts,
  onSelected,
  selected,
}: AccountsFilterProps) => {
  const params = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const accountId = params.get("accountId") || undefined;

  return (
    <Select
      value={selected ? selected : accountId || "all"}
      onValueChange={(value) => {
        if (onSelected) {
          onSelected(value);
          return;
        }
        const searchParams = new URLSearchParams(params.toString());
        if (value === "all") {
          params.forEach((value, key) => {
            searchParams.delete(key);
          });
        } else {
          searchParams.set("accountId", value);
        }
        replace(`${pathname}?${searchParams.toString()}`);
      }}
      disabled={!accounts?.length}
    >
      <SelectTrigger
        className={cn(
          !onSelected &&
            "w-auto h-9 px-3 font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus:ring-offset-0 focus:ring-transparent outline-none text-white focus:bg-white/30 transition gap-2"
        )}
      >
        <SelectValue placeholder="Account" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Accounts</SelectItem>
        {accounts?.map((account) => (
          <SelectItem
            key={account.id}
            value={account.id}
            className="capitalize"
          >
            {account.name.toLowerCase()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default AccountsFilter;
