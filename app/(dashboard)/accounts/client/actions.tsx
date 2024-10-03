"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useOpenAccount } from "@/hooks/account/use-open-account";
import { useConfirm } from "@/hooks/use-confirm";
import { deleteFinancialAccountById } from "@/actions/financial-account";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ActionsProps {
  id: string;
}

const Actions = ({ id }: ActionsProps) => {
  const { onOpen } = useOpenAccount();
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure you want to delete this account?",
    "You are about to delete an account. This action cannot be undone."
  );
  const handleDelete = async () => {
    setLoading(true);
    const ok = await confirm();
    if (ok) {
      deleteFinancialAccountById(id)
        .then((res) => {
          if (res) {
            if (res.error) {
              toast.error(res.error);
            } else {
              toast.success(res.success);
              router.refresh();
            }
          }
        })
        .catch(() => {
          toast.error("An error occurred");
        })
        .finally(() => {
          toast.dismiss();
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  };
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="p-0 size-8"
            aria-label="More options"
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="space-y-1">
          <DropdownMenuItem
            onClick={() => {
              onOpen(id);
            }}
            aria-label="Edit"
            disabled={loading}
          >
            <Edit className="mr-2 h-4 w-4" />
            <p>Edit</p>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDelete}
            aria-label="Delete"
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:text-destructive-foreground focus:bg-destructive/90 focus:text-destructive-foreground"
          >
            <Trash className="mr-2 h-4 w-4" />
            <p>Delete</p>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDialog />
    </>
  );
};

export default Actions;
