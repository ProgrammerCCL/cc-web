"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface INumPadBtnProps {
  value: string;
  // saleAmount: number;
  onClick: (s: string) => void;
  className?: string;
  disabled?: boolean;
}

export const NumpadButton = ({
  value,
  onClick,
  className,
  disabled,
}: INumPadBtnProps) => {
  return (
    <Button
      variant={"outline"}
      className={cn(
        "rounded-md border border-slate-400 text-center h-12 text-2xl font-normal",
        className
      )}
      onClick={() => onClick(value)}
      disabled={disabled}
    >
      {value}
    </Button>
  );
};
