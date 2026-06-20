"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  onChange: ((d: Date | undefined) => void) | undefined;
  defaultDate?: Date | undefined;
}

export function DatePicker({
  onChange,
  defaultDate = undefined,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(defaultDate);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={onChange === undefined}
          variant="outline"
          id="date"
          className="justify-start font-normal bg-white "
        >
          {date ? date.toLocaleDateString() : "Select date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          defaultMonth={date}
          captionLayout="dropdown"
          onSelect={(date) => {
            setDate(date);
            if (onChange) {
              onChange(date);
            }
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
