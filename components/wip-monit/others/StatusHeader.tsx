import React from "react";

interface StatusHeaderProps {
  statusText: string;
}

export function StatusHeader({ statusText }: StatusHeaderProps) {
  return (
    <div className="flex-center h-[170px] w-full rounded-lg bg-blue-700 bg-gradient-to-r">
      <h2 className="text-center text-4xl font-semibold text-white md:text-6xl">
        {statusText}
      </h2>
    </div>
  );
}
