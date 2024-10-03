import React from "react";
import { cn, formatCurrency, formatPercentage } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { IconType } from "react-icons/lib";
import { CountUp } from "@/components/ui/count-up";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const boxVariants = cva("rounded-md p-3", {
  variants: {
    variant: {
      default: "bg-blue-500/20",
      success: "bg-emerald-500/20",
      danger: "bg-destructive/20",
      warning: "bg-yellow-500/20",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const iconVariants = cva("size-6", {
  variants: {
    variant: {
      default: "fill-blue-500",
      success: "fill-emerald-500",
      danger: "fill-destructive",
      warning: "fill-yellow-500",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type BoxVariants = VariantProps<typeof boxVariants>;
type IconVariants = VariantProps<typeof iconVariants>;

interface DataCardProps extends BoxVariants, IconVariants {
  title: string;
  value?: number;
  dateRange: string;
  percentageChange?: number;
  icon: IconType;
}

const DataCard = ({
  title,
  value = 0,
  dateRange,
  percentageChange = 0,
  variant,
  icon: Icon,
}: DataCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center gap-x-4">
        <div className="space-y-2">
          <CardTitle className="text-2xl line-clamp-1">{title}</CardTitle>
          <CardDescription className="line-clamp-1">
            {dateRange}
          </CardDescription>
        </div>
        <div className={cn("shrink-0", boxVariants({ variant }))}>
          <Icon className={cn("m-auto", iconVariants({ variant }))} />
        </div>
      </CardHeader>
      <CardContent>
        <h1 className="font-bold text-2xl break-all line-clamp-1 mb-2">
          <CountUp
            preserveValue
            start={0}
            end={value}
            decimals={2}
            formattingFn={formatCurrency}
          />
        </h1>
        <p
          className={cn(
            "text-muted-foreground text-sm line-clamp-1",
            percentageChange > 0 ? "text-emerald-500" : "text-destructive"
          )}
        >
          {formatPercentage(percentageChange)} from last period
        </p>
      </CardContent>
    </Card>
  );
};

export default DataCard;
