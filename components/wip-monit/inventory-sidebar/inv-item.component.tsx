"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { IInventoryItem } from "@/types/model";
import { formatCurrency, getStockLevelStyles } from "@/lib/utils/inv-monit";
import { Loader2 } from "lucide-react";

// ========================
// InventoryItem
// ========================

interface InventoryItemProps {
  item: IInventoryItem;
  index: number;
}

export function InventoryItem({ item, index }: InventoryItemProps) {
  return (
    <div className="flex flex-col rounded-md bg-slate-300 p-[6px] transition-colors hover:bg-slate-200">
      <div className="flex items-center justify-end gap-2">
        <span className=" font-semibold text-gray-900 ">
          {formatCurrency(item.value)}
        </span>
        <div
          className={cn(
            "w-[60px] rounded-md py-[6px] text-center font-bold transition-colors ",
            getStockLevelStyles(item)
          )}
        >
          {formatCurrency(item.inStacker)}
        </div>
      </div>
    </div>
  );
}

// ========================
// InventoryLoadingSpinner
// ========================
interface InventoryLoadingSpinnerProps {
  message?: string;
}

export function InventoryLoadingSpinner({
  message = "กำลังโหลดข้อมูล...",
}: InventoryLoadingSpinnerProps) {
  return (
    <div className="flex items-center space-x-1 text-gray-600">
      <Loader2 className="size-4 animate-spin" />
      <span className="text-sm">{message}</span>
    </div>
  );
}
