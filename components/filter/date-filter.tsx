"use client";
import React from "react";
import { DateRange } from "react-day-picker";
import { format, subDays } from "date-fns";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { formatDateRange } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose,
} from "@/components/ui/popover";

const DateFilter = () => {
  const params = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const from = params.get("from") || undefined;
  const to = params.get("to") || undefined;

  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo, 30);

  const paramsState = {
    from: from ? new Date(from) : defaultFrom,
    to: to ? new Date(to) : defaultTo,
  };

  const [date, setDate] = React.useState<DateRange | undefined>(paramsState);

  const replaceUrl = (date: DateRange | undefined) => {
    const searchParams = new URLSearchParams(params.toString());
    if (date) {
      searchParams.set("from", format(date.from || defaultFrom, "yyyy-MM-dd"));
      searchParams.set("to", format(date.to || defaultTo, "yyyy-MM-dd"));
    } else {
      searchParams.delete("from");
      searchParams.delete("to");
    }
    replace(`${pathname}?${searchParams.toString()}`);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          disabled={false}
          size={"sm"}
          variant={"outline"}
          className="w-auto h-9 px-3 font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus:ring-offset-0 focus:ring-transparent outline-none text-white focus:bg-white/30 transition gap-2"
        >
          <span>{formatDateRange(paramsState)}</span>
          <ChevronDown size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-full">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={(date) => {
            setDate(date);
            replaceUrl(date);
          }}
          numberOfMonths={2}
          disabled={false}
        />
        <div className="p-4 w-full flex items-center gap-x-2">
          <PopoverClose asChild>
            <Button
              size="sm"
              variant="outline"
              disabled={!date?.from || !date?.to}
              onClick={() => {
                if (!date) return;
                setDate(undefined);
                replaceUrl(undefined);
              }}
            >
              Clear
            </Button>
          </PopoverClose>
          <PopoverClose asChild>
            <Button
              size="sm"
              variant="outline"
              disabled={!date?.from || !date?.to}
              onClick={() => {
                replaceUrl(date);
              }}
            >
              Apply
            </Button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DateFilter;
