"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface IEODStepProps {
  itemIndex: number;
  itemStep: number;
  label: string;
  currentIndex: number;
  currentStep: number;
  no?: string;
  showLabel?: boolean;
  finished?: boolean;
  className?: string;
}

export const EODStepComponent = ({
  itemIndex,
  itemStep,
  label,
  currentIndex,
  currentStep,
  no,
  showLabel,
  finished,
  className,
}: IEODStepProps) => {
  const thisIndex = itemIndex === currentIndex;
  const isFinished =
    finished ||
    itemIndex < currentIndex ||
    (thisIndex && itemStep < currentStep);
  const isCurrent = !isFinished && thisIndex && itemStep === currentStep;
  return (
    <div className={cn("flex-center flex-col", className)}>
      <div
        className={cn(
          "text-white flex-center size-[32px] rounded-full shadow",
          isFinished ? "bg-lime-600" : isCurrent ? "bg-blue-400" : "bg-blue-100"
        )}
      >
        {isFinished ? (
          <div className="text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        ) : no && no.length > 0 ? (
          <span>{no}</span>
        ) : null}
      </div>
      <p>{showLabel ? label : ""}</p>
    </div>
  );
};
