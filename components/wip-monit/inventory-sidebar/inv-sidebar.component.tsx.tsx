"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { InventoryLoadingSpinner, InventoryItem } from "./inv-item.component";
import { formatCurrency } from "@/lib/utils/inv-monit";
import { useInventoryContext } from "@/context";

// internal util function
const getStatusColor = (status: number): string => {
  switch (status) {
    case 0:
      return "bg-green-500 text-white"; // EMPTY
    case 1:
      return "bg-green-500 text-white"; // NORMAL
    case 2:
      return "bg-green-500 text-white"; // NEAR_EMPTY
    case 3:
      return "bg-red-300 text-red-700"; // NEAR_FULL
    case 4:
      return "bg-red-500 text-white"; // FULL
    case 21:
      return "bg-gray-500 text-white"; // MISSING
    case 22:
      return "bg-gray-500 text-white"; // N/A
    default:
      return "bg-gray-500 text-white";
  }
};

// main component
export const InventorySidebar = () => {
  const { machineInventory } = useInventoryContext();
  const [hidden, setHidden] = useState(false);
  const [compState, setCompState] = useState<"loading" | "ready">("loading");

  const { invStacker, cassetteData } = useMemo(() => {
    // filter stacker
    const invStacker = machineInventory
      .filter((item) => Number(item.statusStacker) <= 4)
      .sort((a, b) => b.value - a.value);

    // calculate cassette data
    const notes = machineInventory.filter((item) => item.type === 1);
    const coins = machineInventory.filter((item) => item.type === 2);

    const inCassetteCoins = coins.reduce(
      (sum, item) => sum + Number(item.inCassette || 0),
      0
    );

    const inCassetteNotes = notes.reduce(
      (sum, item) => sum + Number(item.inCassette || 0),
      0
    );

    const statusCoin =
      coins.length > 0
        ? Math.max(...coins.map((item) => item.statusCassette || 0))
        : 0;

    const statusNote =
      notes.length > 0
        ? Math.max(...notes.map((item) => item.statusCassette || 0))
        : 0;

    const cassetteData = {
      totalCoins: inCassetteCoins,
      totalNotes: inCassetteNotes,
      statusCoin,
      statusNote,
    };

    return { invStacker, cassetteData };
  }, [machineInventory]);

  const handleHideTrigger = useCallback(() => {
    setHidden((prev) => !prev);
  }, []);

  useEffect(() => {
    if (compState === "loading" && machineInventory.length > 0) {
      setCompState("ready");
    }
  }, [compState, machineInventory]);

  return (
    <div className="fixed left-0 top-0 z-50  p-2">
      {/* === Header === */}
      <div
        className="w-full cursor-pointer rounded-sm border border-slate-200 bg-sky-200 p-2 shadow-sm transition-colors hover:border-blue-500 hover:bg-blue-50"
        onClick={handleHideTrigger}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleHideTrigger();
          }
        }}
      >
        <div className="flex items-center text-lg font-bold text-gray-900 hover:text-blue-600">
          {hidden ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
          {!hidden && <span className="ml-1">{"สถานะเงินสด"}</span>}
        </div>
      </div>

      {/* === Sidebar Body === */}
      {!hidden ? (
        <div className="mt-2 w-[150px] rounded-md border border-slate-200 bg-white/95 shadow-lg backdrop-blur-sm">
          <div className="p-2">
            {/* Header with Status */}
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">{"เงินทอน"}</h3>
            </div>

            {/* Loading State */}
            {compState === "loading" ? (
              <div className="py-4">
                <InventoryLoadingSpinner />
              </div>
            ) : (
              <div className="space-y-1 overflow-y-auto">
                {machineInventory.length > 0 ? (
                  <>
                    {
                      // stacker
                      invStacker.map((inv, idx) => (
                        <InventoryItem
                          key={`${inv.denom}-${inv.value}-${idx}`}
                          item={inv}
                          index={idx}
                        />
                      ))
                    }

                    {/* cassette */}
                    <div className="p-2">
                      <hr className="mb-4 border-t border-black" />

                      <div className="space-y-3">
                        <h3 className="text-base font-semibold text-gray-900">
                          กล่องเก็บเงิน
                        </h3>

                        {/* Notes */}
                        <div
                          className={`flex-center h-[50px] flex-col rounded-md px-2 text-base   ${getStatusColor(cassetteData.statusNote)}`}
                        >
                          <span className="text-xs">Notes:</span>
                          <span className="font-bold">
                            {formatCurrency(cassetteData.totalNotes ?? 0)}
                          </span>
                        </div>

                        {/* Coins */}
                        <div
                          className={`flex-center h-[50px] flex-col rounded-md px-2 text-base   ${getStatusColor(cassetteData.statusCoin)}`}
                        >
                          <span className="text-xs">Coins:</span>
                          <span className="font-bold">
                            {formatCurrency(cassetteData.totalCoins ?? 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="py-4 text-center text-sm text-gray-500">
                    ไม่มีข้อมูล
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};
