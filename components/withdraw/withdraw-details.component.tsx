"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { cn } from "@/lib/utils";
// import { IInventoryItem } from "@/types/model";
import { Plus, Minus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IDenomQty } from "@/types/withdraw";
import { MoneyDetail } from "@/constants";
import { useEffect, useState } from "react";

const MIN_NOTE_VAL = 20;

const DISP_DETAILS = MoneyDetail.filter((md) => md.value >= 1)
  .map((md) => ({
    key: md.denom,
    label: md.label!,
    value: md.value,
    imgURL: md.imgURL!,
    qty: 0,
    stacker: 0,
    type: md.value >= MIN_NOTE_VAL ? "note" : "coin",
  }))
  .sort((a, b) => b.value - a.value);

// Main Component
export function WithdrawDetails({
  amount,
  available,
  onDetailChange,
  // isError,
  disabled,
}: {
  amount: IDenomQty[];
  available: IDenomQty[];
  onDetailChange: (denom: IDenomQty) => void;
  isError?: boolean;
  disabled?: boolean;
}) {
  const [dispDetails, setDispDetails] = useState(DISP_DETAILS);

  useEffect(() => {
    setDispDetails((prev) =>
      prev.map((disp) => {
        const idx = amount.findIndex((item) => item.value === disp.value);

        if (idx < 0) {
          return { ...disp, qty: 0 };
        }

        return {
          ...disp,
          qty: amount[idx].qty,
        };
      })
    );
  }, [amount]);

  useEffect(() => {
    setDispDetails((prev) =>
      prev.map((disp) => {
        const idx = available.findIndex((item) => item.value === disp.value);

        if (idx < 0) {
          return { ...disp, stacker: 0 };
        }

        return {
          ...disp,
          key: available[idx].key,
          stacker: available[idx].qty,
        };
      })
    );
  }, [available]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="rounded-l-md bg-[#3a6aa1] text-center font-bold text-white">
            ราคา
          </TableHead>
          <TableHead className="bg-[#3a6aa1] text-center font-bold text-white">
            ภาพจำลอง
          </TableHead>
          <TableHead className="bg-[#3a6aa1] text-center font-bold text-white">
            จำนวนที่มี
          </TableHead>
          <TableHead className="w-[120px] rounded-r-md bg-[#3a6aa1] text-center font-bold text-white">
            จำนวนที่เลือก
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {dispDetails.map((row, index) => (
          <TableRow key={`${index}:${row.value}`}>
            <TableCell className="w-[90px] p-0 text-center font-medium">
              {row.label}
            </TableCell>
            <TableCell className="mx-auto w-[100px] p-2">
              <Image
                className="mx-auto"
                src={row.imgURL}
                alt={row.value.toString()}
                width={row.type === "note" ? 100 : 50}
                height={row.type === "note" ? 100 : 50}
                style={{ width: "auto", height: "45px" }}
              />
            </TableCell>

            <TableCell className="w-[100px] p-0 text-center">
              {row.stacker}
            </TableCell>

            <TableCell className="w-[150px] p-0 text-right">
              <div className="grid grid-cols-3 justify-items-center gap-4">
                {/* Start: button remove number */}
                <Button
                  variant="outline"
                  size="icon"
                  className="w-3/4 hover:bg-slate-800 hover:text-white"
                  onClick={() =>
                    onDetailChange({
                      key: row.key,
                      value: row.value,
                      qty: row.qty - 1,
                    })
                  }
                  disabled={row.qty === 0 || disabled}
                >
                  <Minus className="size-[16px]" />
                </Button>
                {/* End: button remove number */}

                <Input
                  value={row.qty}
                  readOnly
                  className={cn(
                    "text-center w-[70px] no-focus no-active",
                    row.qty > 0 ? "bg-yellow-200" : ""
                  )}
                />

                {/* Start: button add number */}
                <Button
                  variant="outline"
                  size="icon"
                  className="w-3/4 hover:bg-slate-800 hover:text-white"
                  onClick={() =>
                    onDetailChange({
                      key: row.key,
                      value: row.value,
                      qty: row.qty + 1,
                    })
                  }
                  disabled={row.qty >= row.stacker || disabled}
                >
                  <Plus className="size-[16px]" />
                </Button>
                {/* End: button add number */}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
