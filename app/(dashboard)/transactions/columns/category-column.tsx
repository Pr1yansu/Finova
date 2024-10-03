import { useOpenCategory } from "@/hooks/category/use-open-category";
import { useOpenTransaction } from "@/hooks/transaction/use-open-transaction";
import { TriangleAlert } from "lucide-react";
import React from "react";

const CategoryColumn = ({
  categoryId,
  categoryName,
  id,
}: {
  categoryId?: string | null;
  categoryName?: string | null;
  id: string;
}) => {
  const { onOpen } = useOpenCategory();
  const { onOpen: onOpenTransaction } = useOpenTransaction();
  if (!categoryId) {
    return (
      <button
        className="border-red-300 bg-red-100 text-red-500 flex gap-1 py-1 px-2 rounded-md text-xs"
        onClick={() => onOpenTransaction(id)}
      >
        <TriangleAlert className="w-4 h-4 mr-1" />
        Uncategorized
      </button>
    );
  }
  return (
    <button
      className="text-blue-500 hover:underline"
      onClick={() => onOpen(categoryId)}
    >
      {categoryName}
    </button>
  );
};

export default CategoryColumn;
