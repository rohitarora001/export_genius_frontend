"use client";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import moment from "moment";

// props interface
interface DatePickerProps {
    selectedDate: Date | null;
    onDateChange: (date: Date) => void;
    disabledDates?: (date: Date) => boolean;
    buttonLabel?: string;
    className?: string;
}

const DatePicker = ({
    selectedDate,
    onDateChange,
    disabledDates = (date: Date) =>
        date < new Date(new Date().setDate(new Date().getDate() - 1)),
    buttonLabel = "mm:dd:yy",
    className = "",
}: DatePickerProps) => {
    const [open, setOpen] = useState(false);

    const handleDateChange = (date: Date | undefined) => {
        if (date) {
            onDateChange(date);
            setOpen(false);
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn("pl-3 text-left font-normal", className)}
                >
                    <span>{selectedDate ? format(selectedDate, 'dd/MM/yy') : buttonLabel}</span>
                    <CalendarDays className="ml-auto h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={selectedDate || undefined}
                    onSelect={handleDateChange}
                    disabled={disabledDates}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );
}

export default DatePicker