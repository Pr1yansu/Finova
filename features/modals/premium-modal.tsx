"use client";
import React from "react";
import { createOrderId } from "@/actions/order";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useConfirm } from "@/hooks/use-confirm";
import { useSubscriptionModal } from "@/hooks/use-subscription";
import { Check } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function PremiumModal() {
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure you want to upgrade to the VIP pack?",
    "This will unlock premium features and take your experience to the next level!"
  );
  const user = useSession().data?.user;
  const router = useRouter();
  const { isOpen, onClose } = useSubscriptionModal();

  const handlePayment = async () => {
    try {
      const ok = await confirm();
      if (!ok) {
        return;
      }
      const { id, amount } = await createOrderId();
      if (!id) {
        toast.error("Failed to create order");
        return;
      }

      if (typeof window.Razorpay === "undefined") {
        toast.error("Razorpay SDK not loaded");
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount,
        currency: "INR",
        name: "FINOVA",
        order_id: id,
        handler: async (response: any) => {
          try {
            const serverRes = await fetch("/api/payment-success", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                amount,
              }),
            });
            if (!serverRes.ok) {
              throw new Error("Failed to complete payment");
            }

            const resJson = await serverRes.json();

            if (resJson.error) {
              throw new Error(resJson.error);
            }

            toast.success("Payment successful!");
            router.refresh();
          } catch (error) {
            console.error(error);
            toast.error("Failed to complete payment");
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: {
          color: "#3399cc",
        },
      };
      onClose();
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      toast.error("Failed to initiate payment");
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              Upgrade to VIP Pack
            </DialogTitle>
            <DialogDescription className="text-center">
              Unlock premium features and take your experience to the next
              level!
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 items-center gap-4">
              <div className="space-y-2">
                {[
                  "OCR: Scan and digitize documents effortlessly",
                  "Bank Connect: Seamlessly link your Indian bank accounts",
                  "CSV Upload: Import data from multiple sources",
                  "Multiple Charts: Visualize your data like a pro",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center items-center space-x-2">
              <span className="text-3xl font-bold">₹9</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
              onClick={handlePayment}
            >
              Upgrade Now and Get more features!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ConfirmDialog />
    </>
  );
}
