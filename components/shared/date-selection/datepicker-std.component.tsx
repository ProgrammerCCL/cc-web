"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import moment, { Moment } from "moment";

interface IDatePickerProps {
  date?: Moment;
  setDate: (m: Moment | undefined) => void;
}

export function DatePicker({ date, setDate }: IDatePickerProps) {
  const handleSelectDate = (date: Date | undefined) => {
    setDate(moment(date));
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[140px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 size-4" />
          {date ? (
            date.utcOffset(7).format("YYYY-MM-DD")
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date?.toDate()}
          onSelect={handleSelectDate}
          // initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
