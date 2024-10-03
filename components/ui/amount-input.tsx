import CurrencyInput from "react-currency-input-field";
import { Info, MinusCircle, PlusCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type AmountInputProps = {
  value: string;
  onChange: (value?: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

export const AmountInput = ({
  value,
  onChange,
  placeholder,
  disabled,
}: AmountInputProps) => {
  const parsedValue = parseFloat(value.replace(/[^0-9.-]+/g, ""));

  const isIncome = parsedValue > 0;
  const isExpense = parsedValue < 0;

  const onReverseValue = () => {
    onChange((parseFloat(value) * -1).toString());
  };

  return (
    <div className="relative">
      <TooltipProvider>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={onReverseValue}
              aria-label="Reverse value"
              className={cn(
                "bg-slate-400 hover:bg-slate-500 absolute top-0.5 left-0.5 rounded-md p-2 transition",
                isIncome && "bg-emerald-500 hover:bg-emerald-600",
                isExpense && "bg-rose-500 hover:bg-rose-600"
              )}
            >
              {!parsedValue && <Info className="size-4 text-white" />}
              {isIncome && <MinusCircle className="size-4 text-white" />}
              {isExpense && <PlusCircle className="size-4 text-white" />}
            </button>
          </TooltipTrigger>
          <TooltipContent>
            Use [+] for income or [-] for expenses
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <CurrencyInput
        prefix="₹"
        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-9"
        placeholder={placeholder}
        value={isNaN(parsedValue) ? "" : value}
        decimalScale={2}
        decimalsLimit={2}
        onValueChange={onChange}
        disabled={disabled}
      />
      <p className="text-xs text-muted-foreground mt-2">
        {isIncome && "Income"}
        {isExpense && "Expense"}
        {!parsedValue && "Enter amount"}
      </p>
    </div>
  );
};
