"use client";

import { toast } from "@/components/ui/use-toast";
import { MoneyDetail } from "@/constants";
import { getInventory } from "@/lib/actions/inventory.actions";
import { IInventoryItem } from "@/types/model";
import React, { createContext, useContext, useEffect, useState } from "react";

interface IInventoryContext {
  machineInventory: IInventoryItem[];
  isInvFetching: boolean;
  fetchInventory: (setZero?: boolean) => void;
}

// * start: one cycle for context
const InventoryContext = createContext<IInventoryContext | undefined>(
  undefined
);

export function InventoryContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [machineInventory, setMachineInventory] = useState<IInventoryItem[]>(
    []
  );
  const [isInvFetching, setIsInvFetching] = useState(false);

  const fetchInventory = async (setZero: boolean = true) => {
    if (isInvFetching) return;

    if (setZero) {
      setMachineInventory([]);
    }

    setIsInvFetching(true);
    try {
      const { success, data } = await getInventory();
      if (success && data!.length > 0) {
        const newData = MoneyDetail.map((inv) => {
          const invIdx = data!.findIndex((data) => data.value === inv.value);

          if (invIdx >= 0) {
            const { label, denom, imgURL } = inv;
            return {
              ...data![invIdx],
              label,
              denom,
              imgURL,
            };
          } else {
            return inv;
          }
        }).filter(
          (inv) =>
            typeof inv.statusCassette === "number" && inv.statusCassette < 20
        );

        setMachineInventory(newData);
      } else {
        setMachineInventory([]);
      }
    } catch (err: any) {
      console.error("[ERROR] getInventery Failed", err.message);
      toast({
        variant: "destructive",
        title: `Error: getInventery Failed ${err.message}`,
        description: `Fetch Inventory Failed.`,
      });
      setMachineInventory([]);
    } finally {
      setIsInvFetching(false);
    }
  };

  /* eslint-disable */
  useEffect(() => {
    fetchInventory();
  }, []);
  /* eslint-enable */

  return (
    <InventoryContext.Provider
      value={{ machineInventory, isInvFetching, fetchInventory }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventoryContext() {
  const context = useContext(InventoryContext);

  if (context === undefined) {
    throw new Error(
      "useInventoryContext must be used whithin a InventoryContextProvider"
    );
  }

  return context;
}
