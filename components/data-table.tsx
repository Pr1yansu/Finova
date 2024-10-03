"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  SortingState,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Trash } from "lucide-react";
import { useConfirm } from "@/hooks/use-confirm";
import UploadBtn from "./csv-upload-btn";
import PlaidLinkBankButton from "./plaid-bank-button";
import { Premium, User } from "@prisma/client";
import ScanTransactionReceiptsButton from "./scan-transaction-receipt";

interface ExtendedUser extends User {
  Premium: Premium[];
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onDelete: (rows: Row<TData>[]) => void;
  disabled?: boolean;
  onUpload?: (results: any) => void;
  user?: ExtendedUser | null;
  onScan?: () => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onDelete,
  disabled = false,
  onUpload,
  user,
  onScan,
}: DataTableProps<TData, TValue>) {
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure you want to delete these rows?",
    "You are about to delete some rows. This action cannot be undone."
  );
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});

  const [input, setInput] = React.useState<string>("");
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
    },
  });

  React.useEffect(() => {
    const debouncedFn = () => {
      const params = new URLSearchParams(searchParams);
      if (input) {
        params.set("search", input);
      } else {
        params.delete("search");
      }
      replace(`${pathname}?${params.toString()}`);
    };

    const debounced = setTimeout(debouncedFn, 150);
    return () => clearTimeout(debounced);
  }, [input, searchParams, replace, pathname]);

  return (
    <div>
      <ConfirmDialog />
      <div className="mb-4 flex justify-between">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type="text"
          placeholder="Search"
          className="max-w-xs"
        />
        <div className="flex gap-2 items-center">
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <Button
              size={"sm"}
              variant="destructive"
              disabled={disabled}
              onClick={async () => {
                const ok = await confirm();
                if (ok) {
                  onDelete(table.getFilteredSelectedRowModel().rows);
                  table.setRowSelection({});
                }
              }}
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete ({table.getFilteredSelectedRowModel().rows.length})
            </Button>
          )}
          <div className="flex gap-2 items-center w-full">
            {onUpload && <UploadBtn onUpload={onUpload} />}
            {onScan && <ScanTransactionReceiptsButton onScan={onScan} />}
            {user && <PlaidLinkBankButton user={user} />}
          </div>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
