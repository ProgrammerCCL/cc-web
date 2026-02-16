import { cn } from "@/lib/utils";
import React from "react";

export const BoxContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "mt-4 rounded-md bg-white  p-4  shadow-lg md:px-10",
        className
      )}
    >
      {children}
    </div>
  );
};
