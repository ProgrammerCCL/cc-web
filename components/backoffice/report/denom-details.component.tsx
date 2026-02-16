import { IDenomQty } from "@/types/withdraw";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import React from "react";
import { Separator } from "@/components/ui/separator";

interface IDenomDetailsProps {
  amount: number;
  cashIn: IDenomQty[];
  cashOut: IDenomQty[];
}

// Inner component
const DetailsComponents = ({ denoms }: { denoms: IDenomQty[] }) => {
  return (
    <div className="w-[160px] flex-col gap-2 space-y-1.5">
      <div className="flex-between w-full">
        <span className="">Denomination</span>
        <span className="">Qty</span>
      </div>
      {denoms.length > 0 ? (
        denoms.map((d) => (
          <div key={`in-${d.key}`} className="flex-between w-full">
            <span> - {d.value}</span>
            <span>{d.qty}</span>
          </div>
        ))
      ) : (
        <div className="w-full text-center italic text-slate-500">- None -</div>
      )}
    </div>
  );
};

// Main component
export const DenomDetailsReport = ({
  amount,
  cashIn,
  cashOut,
}: IDenomDetailsProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="font-bold">
          {Number(amount).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </TooltipTrigger>
        <TooltipContent className="space-y-3 p-2 text-xs">
          <div className="w-full space-y-2 rounded-lg bg-green-50 p-2">
            <p className="font-bold">Cash In</p>
            <DetailsComponents denoms={cashIn} />
          </div>

          <Separator />

          <div className="w-full space-y-2 rounded-lg bg-red-50 p-2">
            <p className="font-bold">Cash Out</p>
            <DetailsComponents denoms={cashOut} />
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
