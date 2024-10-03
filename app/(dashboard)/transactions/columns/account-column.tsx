import { useOpenAccount } from "@/hooks/account/use-open-account";
import React from "react";

const AccountColumn = ({
  accountId,
  accountName,
}: {
  accountId: string;
  accountName: string;
}) => {
  const { onOpen } = useOpenAccount();
  return (
    <button
      className="text-blue-500 hover:underline"
      onClick={() => onOpen(accountId)}
    >
      {accountName}
    </button>
  );
};

export default AccountColumn;
