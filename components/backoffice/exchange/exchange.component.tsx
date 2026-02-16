"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { IInventoryItem } from "@/types/model";
import { Plus, Minus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DenomType {
  denom: string;
  qty: number;
}

interface WithDrawItemProps {
  items: IInventoryItem[] | undefined;
  setDenom: (newDenom: DenomType[]) => void;
  denom: DenomType[];
}

export function ExchangeDetailsComponent(props: WithDrawItemProps) {
  const { items, setDenom, denom } = props;

  const handleIncrease = (key: string) => {
    const found = denom.find((w) => w.denom === key);
    const item = items?.find((i) => i.denom === key);

    if (found && item && found.qty < item.inStacker) {
      const newDenom = denom.map((w) =>
        w.denom === key ? { ...w, qty: w.qty + 1 } : w
      );
      setDenom(newDenom);
    } else if (!found && item && item.inStacker > 0) {
      const newDenom = [...denom, { denom: key, qty: 1 }];
      setDenom(newDenom);
    }
  };

  const handleDecrease = (key: string) => {
    const found = denom.find((w) => w.denom === key);
    if (found && found.qty > 1) {
      const newDenom = denom.map((w) =>
        w.denom === key ? { ...w, qty: w.qty - 1 } : w
      );
      setDenom(newDenom);
    } else if (found) {
      const newDenom = denom.filter((w) => w.denom !== key);
      setDenom(newDenom);
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center text-lg text-gray-800">
            ราคา
          </TableHead>
          <TableHead className="text-center text-lg text-gray-800">
            ภาพจำลอง
          </TableHead>
          <TableHead className="text-center text-lg text-gray-800">
            จำนวนที่มี
          </TableHead>
          <TableHead className="w-[120px] text-center text-lg text-gray-800">
            จำนวนที่เลือก
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items?.map((row, index) =>
          row.value! >= 20 ? (
            <TableRow key={row.denom + index}>
              <TableCell className="w-[90px] p-0 text-center font-medium">
                {row.value}
              </TableCell>
              <TableCell className="mx-auto w-[130px] p-2">
                <Image
                  className="mx-auto"
                  src={row.imgURL!}
                  alt={row.denom}
                  width={100}
                  height={100}
                />
              </TableCell>

              <TableCell className="w-[120px] p-0 text-center">
                {denom.find((s) => s.denom === row.denom)
                  ? Number(row.inStacker) -
                    denom.find((s) => s.denom === row.denom)?.qty!
                  : row.inStacker}
              </TableCell>

              <TableCell className="p-0 text-right">
                <div className="grid grid-cols-3 justify-items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-3/4 hover:bg-slate-800 hover:text-white"
                    onClick={() => handleDecrease(row.denom)}
                  >
                    <Minus className="size-4" />
                  </Button>

                  <Input
                    type="number"
                    value={denom.find((w) => w.denom === row.denom)?.qty || 0}
                    readOnly
                    className={cn("text-end w-[70px]", {
                      " bg-yellow-400": denom.find((w) => w.denom === row.denom)
                        ?.qty,
                    })}
                  />

                  <Button
                    variant="outline"
                    size="icon"
                    className="w-3/4 hover:bg-slate-800 hover:text-white"
                    onClick={() => handleIncrease(row.denom)}
                  >
                    <Plus className="size-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ) : row.value! >= 1 ? (
            <TableRow key={row.denom + index}>
              <TableCell className=" w-[90px] p-0 text-center font-medium">
                {row.value}
              </TableCell>
              <TableCell className="w-[130px] p-2">
                <Image
                  className="mx-auto"
                  src={row.imgURL!}
                  alt={row.denom}
                  width={50}
                  height={50}
                />
              </TableCell>

              <TableCell className="w-[120px] p-0 text-center">
                {denom.find((s) => s.denom === row.denom)
                  ? Number(row.inStacker) -
                    denom.find((s) => s.denom === row.denom)?.qty!
                  : row.inStacker}
              </TableCell>

              <TableCell className="p-0 text-right">
                <div className="grid grid-cols-3 justify-items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-3/4 hover:bg-slate-800 hover:text-white"
                    onClick={() => handleDecrease(row.denom)}
                  >
                    <Minus className="size-4" />
                  </Button>

                  <Input
                    type="number"
                    value={denom.find((w) => w.denom === row.denom)?.qty || 0}
                    readOnly
                    className={cn("text-end w-[70px]", {
                      " bg-yellow-400": denom.find((w) => w.denom === row.denom)
                        ?.qty,
                    })}
                  />

                  <Button
                    variant="outline"
                    size="icon"
                    className="w-3/4 hover:bg-slate-800 hover:text-white"
                    onClick={() => handleIncrease(row.denom)}
                  >
                    <Plus className="size-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ) : null
        )}
      </TableBody>
    </Table>
  );
}
