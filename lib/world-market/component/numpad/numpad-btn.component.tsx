import React from "react";
import { Button } from "@/components/ui/button"; // คอมโพเนนต์ Button ที่คุณใช้เอง

interface INumPadBtnProps {
  value: string;
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
      className={`h-12 rounded-md border border-slate-400 text-center text-2xl font-normal ${className}`}
      onClick={() => onClick(value)}
      disabled={disabled}
    >
      {value}
    </Button>
  );
};
