import { z } from "zod";
import React, { useEffect, useTransition } from "react";
import {
  SheetContent,
  Sheet,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { financialSchema } from "@/schemas/finance";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { FinancialCategory } from "@prisma/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useConfirm } from "@/hooks/use-confirm";
import { useOpenCategory } from "@/hooks/category/use-open-category";
import {
  deletefinancialCategoryById,
  getfinancialCategoryById,
  updatefinancialCategoryById,
} from "@/actions/financial-categories";
import { FinancialCategoryForm } from "@/components/forms/financial-category-form";

type FormValues = z.infer<typeof financialSchema>;

const EditCategorySheet = () => {
  const router = useRouter();
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure you want to delete this Category?",
    "You are about to delete an Category. This action cannot be undone."
  );
  const [Category, setCategory] = React.useState<FinancialCategory | null>(
    null
  );
  const { isOpen, onClose, id } = useOpenCategory();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchCategory = () => {
      if (!id) return;
      setLoading(true);
      getfinancialCategoryById(id)
        .then((response) => {
          if (response) {
            if (response.error) {
              toast.error(response.error);
            } else if (response.data) {
              setCategory(response.data);
              toast.success(`Category found: ${response.data.name}`);
            }
          }
        })
        .catch(() => {
          toast.error("An error occurred");
        })
        .finally(() => {
          setTimeout(() => {
            toast.dismiss();
            setLoading(false);
          }, 2000);
        });
    };
    fetchCategory();
    return () => {
      setCategory(null);
    };
  }, [id, isOpen, onClose]);

  const onSubmit = (data: FormValues) => {
    setError("");
    setSuccess("");
    if (!id) return;
    startTransition(() => {
      updatefinancialCategoryById(id, data.name)
        .then((response) => {
          if (response) {
            if (response.error) {
              setError(response.error);
              toast.error(response.error);
            } else if (response.success) {
              setSuccess(response.success);
              toast.success(response.success);
              onClose();
              router.refresh();
            }
          }
        })
        .catch(() => {
          setError("An error occurred");
          toast.error("An error occurred");
        })
        .finally(() => {
          setTimeout(() => {
            setError("");
            setSuccess("");
            toast.dismiss();
          }, 5000);
        });
    });
  };

  return (
    <div>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Update Category</SheetTitle>
            <SheetDescription>
              You can update the Category details here.
            </SheetDescription>
          </SheetHeader>
          {loading ? (
            <div className="w-full space-y-2 mt-6">
              <Skeleton className="w-16 h-4" />
              <Skeleton className="w-full h-7" />
              <Skeleton className="w-full h-7" />
              <Skeleton className="w-full h-7" />
            </div>
          ) : (
            <>
              {Category && (
                <FinancialCategoryForm
                  onSubmit={onSubmit}
                  defaultValues={{ name: Category.name }}
                  error={error}
                  success={success}
                  disabled={isPending}
                  id={Category.id}
                  onDelete={async () => {
                    const ok = await confirm();
                    if (ok) {
                      deletefinancialCategoryById(Category.id)
                        .then((response) => {
                          if (response) {
                            if (response.error) {
                              setError(response.error);
                              toast.error(response.error);
                            } else if (response.success) {
                              setSuccess(response.success);
                              toast.success(response.success);
                              onClose();
                              router.refresh();
                            }
                          }
                        })
                        .catch(() => {
                          setError("An error occurred");
                          toast.error("An error occurred");
                        })
                        .finally(() => {
                          setTimeout(() => {
                            setError("");
                            setSuccess("");
                            toast.dismiss();
                          }, 5000);
                        });
                    }
                  }}
                />
              )}
            </>
          )}
        </SheetContent>
      </Sheet>
      <ConfirmDialog />
    </div>
  );
};

export default EditCategorySheet;
