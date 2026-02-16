import React from "react";
import { Separator } from "../ui/separator";

interface IMachineInvTitle {
  title: string;
  amount: {
    recycle: number;
    cassette: number;
  };
}

export const MachineInvTitle = ({ title, amount }: IMachineInvTitle) => {
  const stackerAmount = amount.recycle || 0;
  const cassetteAmount = amount.cassette || 0;
  return (
    <div>
      <div className="flex flex-col items-center justify-between md:flex-row">
        <div>
          <h3 className="text-xl font-bold">{title}</h3>
          <span className="text-xs italic text-slate-400"></span>
        </div>
        <div className="flex-center gap-4">
          <div className="flex flex-col items-end">
            {/* <span className="text-xs text-slate-500">Recycle Module:</span> */}
            <span className="text-xs text-slate-500">กล่อง เงินทอน:</span>
            <span>{`${stackerAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ฿`}</span>
          </div>

          <Separator
            className="h-[36px] w-[2px] bg-slate-400"
            orientation="vertical"
          />

          <div className="flex flex-col items-end">
            {/* <span className="text-xs text-slate-500">Collection Cassette:</span> */}
            <span className="text-xs text-slate-500">กล่อง ยอดขาย:</span>
            <span>{`${cassetteAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ฿`}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
