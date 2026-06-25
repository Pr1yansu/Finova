"use client";
import React, { useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { seedDemoData } from "@/actions/seed";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2, ArrowRight } from "lucide-react";

interface DemoSeederBannerProps {
  isEmpty: boolean;
}

const DemoSeederBanner = ({ isEmpty }: DemoSeederBannerProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  if (!isEmpty) return null;

  const handleSeed = () => {
    startTransition(() => {
      seedDemoData()
        .then((res) => {
          if (res.error) {
            toast.error(res.error);
          } else if (res.success) {
            toast.success(res.success);
            router.refresh();
          }
        })
        .catch(() => {
          toast.error("An unexpected error occurred. Please try again.");
        });
    });
  };

  return (
    <Card className="border-none shadow-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 text-white rounded-2xl overflow-hidden mb-8 transition hover:shadow-2xl duration-300">
      <CardContent className="p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4 text-left">
          <div className="bg-white/15 p-3 rounded-xl backdrop-blur-md shrink-0 border border-white/10 hidden sm:block">
            <Sparkles className="h-6 w-6 text-amber-300 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight font-montserrat flex items-center gap-2">
              Welcome to your Finova Dashboard!
              <Sparkles className="h-5 w-5 text-amber-300 sm:hidden inline" />
            </h3>
            <p className="text-sm text-blue-100/90 leading-relaxed max-w-2xl">
              It looks like you don&apos;t have any transactions yet. Get started instantly by populating your account with a rich, realistic set of demo transactions, accounts, and categories to see the charts and reports in action.
            </p>
          </div>
        </div>
        <Button
          onClick={handleSeed}
          disabled={isPending}
          className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-6 py-5 rounded-xl transition duration-200 shrink-0 shadow-lg hover:shadow-xl hover:scale-[1.02] flex items-center gap-2 border-none text-sm w-full md:w-auto justify-center"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-blue-700" />
              Generating Data...
            </>
          ) : (
            <>
              Get Started with Demo Data
              <ArrowRight className="h-4 w-4 text-blue-700" />
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DemoSeederBanner;
