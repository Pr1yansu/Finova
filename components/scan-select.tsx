"use client";
import React from "react";
import { Button } from "./ui/button";
import ImageChooser from "./image-chooser";
import ScanUsingCamera from "./scan-using-camera";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "./ui/input";
import { convertAmountToMiliUnits, formatCurrency } from "@/lib/utils";
import { createTransaction } from "@/actions/transactions";
import AccountsFilter from "./filter/accounts-filter";
import { FinancialAccount } from "@prisma/client";
import { useRouter } from "next/navigation";

interface ScanSelectProps {
  onCancel: () => void;
  accounts: FinancialAccount[] | [];
}

const ScanSelect = ({ onCancel, accounts }: ScanSelectProps) => {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const [data, setData] = React.useState<{
    amount: string | null;
    date: string | null;
    payee: string | null;
    notes: string | null;
  } | null>(null);
  const [payee, setPayee] = React.useState<string | null>(null);
  const [notes, setNotes] = React.useState<string | null>(null);
  const [amount, setAmount] = React.useState<string | null>(null);
  const [openAccountSelector, setOpenAccountSelector] = React.useState(false);
  const [accountId, setAccountId] = React.useState<string | null>(null);

  const handleImageChange = async (image: File) => {
    try {
      setLoading(true);
      setData(null);

      const formData = new FormData();
      formData.append("file", image);

      const response = await fetch("http://localhost:8000/ocr/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to extract text.");
      }

      const data = (await response.json()) as {
        amount: string | null;
        date: string | null;
        payee: string | null;
        notes: string | null;
      };

      setData(data);

      toast.success("Text extracted successfully!");
    } catch {
      toast.error("An error occurred while processing the image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex gap-2 max-sm:flex-wrap min-h-60">
        <ImageChooser disable={loading} onImageChange={handleImageChange} />
        <ScanUsingCamera disable={loading} onImageChange={handleImageChange} />
      </div>

      {data !== null && (
        <div className="mt-4 bg-gray-100 p-4 rounded mb-4">
          <h3 className="font-bold">Extracted Text:</h3>
          <p>
            please select and
            {Object.keys(data).filter((key) => !data[key as keyof typeof data])
              .length > 0
              ? " fill in the missing fields"
              : ""}{" "}
            to continue
          </p>
          <Table>
            <TableCaption>
              Extracted data from the image. Please verify the data.
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Date</TableHead>
                <TableHead>Payee</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">
                  {data.date ? (
                    data.date
                  ) : (
                    <Input
                      type="date"
                      onChange={(e) =>
                        setData({ ...data, date: e.target.value })
                      }
                    />
                  )}
                </TableCell>
                <TableCell>
                  {data.payee ? (
                    data.payee
                  ) : (
                    <Input
                      type="text"
                      onChange={(e) => setPayee(e.target.value)}
                    />
                  )}
                </TableCell>
                <TableCell>
                  {data.notes ? (
                    data.notes
                  ) : (
                    <Input
                      type="text"
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {data.amount !== null ? (
                    formatCurrency(parseFloat(data.amount))
                  ) : (
                    <Input
                      type="number"
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}

      {openAccountSelector && (
        <div className="mb-4">
          <AccountsFilter
            onSelected={(accountId) => {
              setAccountId(accountId);
            }}
            selected={accountId || ""}
            accounts={accounts}
          />
        </div>
      )}

      <div className="flex w-full items-center justify-between">
        <Button onClick={onCancel} variant={"outline"} size={"sm"}>
          Cancel
        </Button>
        <Button
          onClick={() => {
            if (!data) {
              toast.error("Please extract text from the image first.");
              return;
            }
            setData({
              amount: amount ? amount : data?.amount,
              date: data?.date,
              notes: notes ? notes : data?.notes,
              payee: payee ? payee : data?.payee,
            });

            if (data.date === null) {
              toast.error("Please enter a date.");
              return;
            }

            if (data.payee === null) {
              toast.error("Please enter a payee.");
              return;
            }

            if (data.amount === null) {
              toast.error("Please enter an amount.");
              return;
            }

            setOpenAccountSelector(true);

            if (accountId === null) {
              toast.error("Please select an account.");
              return;
            }

            setLoading(true);

            createTransaction({
              amount: convertAmountToMiliUnits(parseInt(data.amount)),
              date: new Date(data.date),
              payee: data.payee,
              notes: data.notes,
              accountId: accountId,
            })
              .then((res) => {
                if (res.error) {
                  if (res.error instanceof Array) {
                    let message = "";
                    res.error.forEach((error) => {
                      message += error.message;
                    });

                    toast.error(message);
                  } else {
                    toast.error(res.error);
                  }
                } else {
                  toast.success("Transaction created successfully.");
                  router.push("/");
                }
              })
              .finally(() => {
                setOpenAccountSelector(false);
                setTimeout(() => {
                  setData(null);
                  setLoading(false);
                  toast.dismiss();
                }, 1000);
              });
          }}
          size={"sm"}
          disabled={loading || !data}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default ScanSelect;
