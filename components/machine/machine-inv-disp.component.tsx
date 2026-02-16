import React from "react";
import { cn } from "@/lib/utils";
import { IMachineInventoryDisplayProps } from "@/types/machine";
import { randomInt } from "crypto";

export const MachineInventoryDisp = (props: IMachineInventoryDisplayProps) => {
  const { qty, min, capacity, status, denom, label, icon, cassette } = props;

  const arrKey = denom
    ? denom.toString()
    : label || (randomInt(1000).toString() as string);

  if (status === 22) return null;

  const boxStyled =
    cassette && status <= 2
      ? "ok"
      : qty < min || status === 0 || status >= 4
        ? "danger"
        : status === 1 || status === 3
          ? "warning"
          : "ok";

  return icon ? (
    <div
      className={cn(
        "rounded-sm bg-gray-500 p-2",
        boxStyled === "danger"
          ? "bg-red-700"
          : boxStyled === "warning"
            ? "bg-yellow-500"
            : boxStyled === "ok"
              ? "bg-green-500"
              : ""
      )}
    ></div>
  ) : (
    <div className="relative flex w-[90px] flex-col">
      {/* label */}
      <div
        className={cn(
          "mt-2 text-center text-xs",
          boxStyled === "danger" ? "text-red-700 font-bold" : ""
        )}
      >
        {label}
        {denom
          ? `${Number(denom).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })} ฿`
          : null}

        {/* show ERR when status error */}
        {status >= 20 ? <span>{` (ERR) `}</span> : ""}
      </div>

      {/* 4 segment boxes */}
      <div className="flex-center relative mx-auto w-[45px] flex-col gap-0.5">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div
            key={`${idx}${arrKey}`}
            className={cn(
              "bg-slate-200 w-full rounded-md py-2",
              5 - idx - 1 <= status
                ? boxStyled === "danger"
                  ? "bg-red-700"
                  : boxStyled === "warning"
                    ? "bg-yellow-500"
                    : boxStyled === "ok"
                      ? "bg-green-500"
                      : ""
                : ""
            )}
          ></div>
        ))}
      </div>
      <div className="mt-2 flex flex-col gap-0.5 rounded-md border border-slate-100 p-1">
        <div className="flex-between border-b border-slate-100 text-xs font-bold text-slate-700">
          <span>QTY</span>
          <span>{qty}</span>{" "}
        </div>
        <div className="flex-between border-b border-slate-100 text-[10px] text-slate-400">
          <span>MIN</span>
          <span>{min}</span>{" "}
        </div>
        <div className="flex-between text-[10px] text-slate-400">
          <span>CAP.</span>
          <span>{capacity === 0 ? "n/a" : capacity}</span>{" "}
        </div>
      </div>
    </div>
  );
};
