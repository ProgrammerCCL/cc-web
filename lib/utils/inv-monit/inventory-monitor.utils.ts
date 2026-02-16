import { IInventoryItem } from "@/types/model";

type TStockLevel = "SAFE" | "WARNING" | "DANGER" | "CRITICAL";

const INVENTORY_COLORS = {
  SAFE: "bg-green-500 text-white",
  WARNING: "bg-orange-400 text-white",
  DANGER: "bg-red-300 text-red-700",
  CRITICAL: "bg-red-600 text-white",
} as const;

export const getStockLevel = (inv: IInventoryItem): TStockLevel => {
  const minLv = inv.stackerMin || 0;
  const current = inv.inStacker;

  if (current > minLv + 20) {
    return "SAFE";
  }
  if (current > minLv + 10) {
    return "WARNING";
  }
  if (current > minLv) {
    return "DANGER";
  }
  return "CRITICAL";
};

export const getStockLevelStyles = (inv: IInventoryItem): string => {
  const level = getStockLevel(inv);
  return INVENTORY_COLORS[level];
};

export const formatCurrency = (value: number): string => {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

export const filterActiveInventory = (
  inventory: IInventoryItem[]
): IInventoryItem[] => {
  return inventory.filter((inv) => inv.stackerMin !== 0);
};
