"use client";

import React, { useEffect, useRef } from "react";
import { NumpadButton } from "../minipos/numpad";
import { Input } from "../ui/input";
import { toast } from "../ui/use-toast";
import { cn } from "@/lib/utils";
import { ChevronsDown, ChevronsRight, Slash } from "lucide-react";

const INIT_VAL = "0";

export const WithdrawAmount = ({
  amount,
  available,
  onAmountChange,
  isError,
  disabled,
}: {
  amount: number;
  available: number;
  onAmountChange: (a: number) => void;
  isError?: boolean;
  disabled?: boolean;
}) => {
  const dipsAmount = useRef(INIT_VAL);

  const handleNumpadClick = (value: string) => {
    let amountStr = INIT_VAL;

    switch (value) {
      case "C":
        break;
      case "Del":
        amountStr = amountStr.length > 1 ? amountStr.slice(0, -1) : INIT_VAL;
        break;
      default:
        amountStr = `${dipsAmount.current !== INIT_VAL ? dipsAmount.current : ""}${value}`;
        break;
    }

    try {
      const newAmount = Number(amountStr);
      dipsAmount.current = amountStr;
      onAmountChange(newAmount);
    } catch (err) {
      toast({
        title: "ข้อมูลไม่ถูกต้อง",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    dipsAmount.current = amount.toString();
  }, [amount]);

  return (
    <div className="mt-8 flex flex-col gap-3 px-3">
      <div
        className="flex-between mx-auto w-full rounded-lg bg-white p-2 text-2xl font-bold  shadow-md
"
      >
        <div className="flex flex-col text-cyan-950">
          <span>ระบุยอดเงิน</span>
          <ChevronsDown size={30} />
        </div>
        <Slash size={45} />
        <div className="flex flex-col items-end text-[#3a6aa1]">
          <ChevronsRight size={30} />
          <span>เลือกจำนวณ</span>
        </div>
      </div>
      {/* <h1 className="mx-auto text-center text-2xl font-bold text-cyan-950">
        กรุณาระบุยอดที่ต้องการถอน (บาท)
      </h1> */}
      <div className="mx-auto h-[70px] w-full overflow-hidden rounded-lg border-2 border-blue-950 bg-white text-right text-[48px]">
        <span className="m-2">
          {amount.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      </div>
      <div className="flex w-full justify-center">
        <div className="flex w-full flex-col items-center justify-center">
          <div className="mx-auto mt-1 grid w-full grid-cols-3 gap-3 rounded-lg text-[25px]">
            <NumpadButton
              value="7"
              onClick={handleNumpadClick}
              disabled={disabled}
            />
            <NumpadButton
              value="8"
              onClick={handleNumpadClick}
              disabled={disabled}
            />
            <NumpadButton
              value="9"
              onClick={handleNumpadClick}
              disabled={disabled}
            />
            <NumpadButton
              value="4"
              onClick={handleNumpadClick}
              disabled={disabled}
            />
            <NumpadButton
              value="5"
              onClick={handleNumpadClick}
              disabled={disabled}
            />
            <NumpadButton
              value="6"
              onClick={handleNumpadClick}
              disabled={disabled}
            />
            <NumpadButton
              value="1"
              onClick={handleNumpadClick}
              disabled={disabled}
            />
            <NumpadButton
              value="2"
              onClick={handleNumpadClick}
              disabled={disabled}
            />
            <NumpadButton
              value="3"
              onClick={handleNumpadClick}
              disabled={disabled}
            />
            <NumpadButton
              value="0"
              className="col-span-2"
              onClick={handleNumpadClick}
              disabled={disabled}
            />
            <NumpadButton
              value="C"
              className="bg-red-200"
              onClick={handleNumpadClick}
              disabled={disabled}
            />
          </div>

          <div
            className={cn(
              "mt-3 w-full justify-center rounded-md bg-[#3a6aa1] px-4 py-2",
              isError ? "bg-red-900" : ""
            )}
          >
            <p className="text-2xl font-bold text-white">
              ยอดคงเหลือในเครื่อง (บาท)
            </p>
            <div className="mt-2 h-[50px]">
              <Input
                type="text"
                readOnly
                value={(available - amount).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                className={cn(
                  "text-end text-3xl",
                  isError ? "text-red-500" : ""
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
