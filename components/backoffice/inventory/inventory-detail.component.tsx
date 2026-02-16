"use client";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { IInventoryItem } from "@/types/model";
import React from "react";
import Image from "next/image";
import { Label } from "@/components/ui/label";

interface IInventoryDetailComponentProps {
  data: IInventoryItem[];
  isEdit: boolean;
  onDataChange: (itemId: string, value: number) => void;
}

// Inner component
const FieldLabel = ({
  value,
  danger,
  editable,
  notAllow,
}: {
  value?: string;
  danger?: boolean;
  editable?: boolean;
  notAllow?: boolean;
}) => {
  return (
    <Label
      className={cn(
        "px-6 py-2 rounded-md text-lg bg-slate-200/50",
        danger && "bg-red-500 opacity-95",
        editable && "bg-slate-50 border border-slate-300",
        notAllow && "bg-slate-100 text-slate-200"
      )}
    >
      {notAllow ? "X" : value}
    </Label>
  );
};

// Main component
export const InventoryDetailComponent = ({
  data,
  isEdit,
  onDataChange,
}: IInventoryDetailComponentProps) => {
  const onUpdateData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    onDataChange(id, Number(value) || 0);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center text-lg text-gray-800">
            Denom
          </TableHead>
          <TableHead className="text-center text-lg text-gray-800">
            Inventory
          </TableHead>
          <TableHead className="text-center text-lg text-gray-800">
            Stacker
          </TableHead>
          <TableHead className="text-center text-lg text-gray-800">
            Cassette
          </TableHead>
          <TableHead className="text-center text-lg text-gray-800">
            Refill Point
          </TableHead>
          <TableHead className="text-center text-lg text-gray-800">
            Stacker Min
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length > 0 ? (
          data.map((row) => (
            <TableRow key={row.denom} className="text-center">
              <TableCell className="pt-2 font-medium">
                <Image
                  className="mx-auto size-auto"
                  src={row.imgURL!}
                  alt={row.denom}
                  width={row.value >= 20 ? 100 : 45}
                  height={row.value >= 20 ? 100 : 45}
                  priority
                />
                {row.value}
              </TableCell>

              <TableCell className="mx-auto p-0">
                <FieldLabel value={row.inventoryQty.toFixed(0) || "0"} />
              </TableCell>

              <TableCell className="p-0">
                {typeof row.statusStacker === "number" &&
                row.statusStacker < 20 ? (
                  <FieldLabel
                    value={row.inStacker.toFixed(0) || "0"}
                    danger={Number(row.inStacker) < Number(row.stackerMin || 0)}
                  />
                ) : (
                  <FieldLabel notAllow />
                )}
              </TableCell>

              <TableCell className="p-0">
                <FieldLabel value={row.inCassette.toFixed(0) || "0"} />
              </TableCell>

              <TableCell className="p-0">
                {typeof row.statusStacker === "number" &&
                row.statusStacker < 20 ? (
                  isEdit ? (
                    <Input
                      id={`${row.denom}-refillPoint`}
                      type="number"
                      className="mx-auto h-9 w-20 rounded-lg border-2 border-black bg-yellow-400  text-center"
                      value={row.refillPoint || 0}
                      min={0} // กำหนดค่าต่ำสุด
                      max={100} // กำหนดค่าสูงสุด
                      onChange={onUpdateData} // บันทึกเมื่อคลิกออกจาก input
                    />
                  ) : (
                    <FieldLabel
                      value={row.refillPoint?.toFixed(0) || "0"}
                      editable
                    />
                  )
                ) : (
                  <FieldLabel notAllow />
                )}
              </TableCell>

              <TableCell className="p-0">
                {typeof row.statusStacker === "number" &&
                row.statusStacker < 20 ? (
                  isEdit ? (
                    <Input
                      id={`${row.denom}-stackerMin`}
                      type="number"
                      className="mx-auto h-9 w-20 rounded-lg border-2 border-black bg-yellow-400  text-center"
                      value={row.stackerMin || 0}
                      min={0} // กำหนดค่าต่ำสุด
                      max={100} // กำหนดค่าสูงสุด
                      onChange={onUpdateData} // บันทึกเมื่อคลิกออกจาก input
                    />
                  ) : (
                    <FieldLabel
                      value={row.stackerMin?.toFixed(0) || "0"}
                      editable
                    />
                  )
                ) : (
                  <FieldLabel notAllow />
                )}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="w-full p-4 py-8 ">
              <div className="rounded-lg bg-slate-100 py-4 text-center text-lg italic text-slate-400">
                -- No Data --
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
