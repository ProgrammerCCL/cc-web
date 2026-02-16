"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import React, { useMemo } from "react";
import { Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useInventoryContext } from "@/context";
import { Separator } from "@/components/ui/separator";

import { LoadingDialog } from "@/components/shared/loading";
import { IMachineInventoryDisplayProps } from "@/types/machine";
import { MachineInventoryDisp, MachineInvTitle } from "@/components/machine";

function InventoryPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { machineInventory, isInvFetching } = useInventoryContext();

  if (!session?.user.permissions.includes("BACK_OFFICE")) {
    router.push("/operation");
  }

  const { noteStacker, coinStacker, noteCassette, coinCassette } =
    useMemo(() => {
      let noteCassette = {
        qty: 0,
        min: 0,
        capacity: 0,
        status: 22,
        cassette: true,
        label: "Cassette",
        cassetteAmount: 0,
      } as IMachineInventoryDisplayProps;
      let coinCassette = {
        qty: 0,
        min: 0,
        capacity: 0,
        status: 22,
        cassette: true,
        label: "Cassette",
        cassetteAmount: 0,
      } as IMachineInventoryDisplayProps;
      const noteStacker = [] as IMachineInventoryDisplayProps[];
      const coinStacker = [] as IMachineInventoryDisplayProps[];

      for (const invRow of machineInventory) {
        const statusStacker =
          typeof invRow.statusStacker === "number" ? invRow.statusStacker : 22;

        const statusCassette =
          typeof invRow.statusCassette === "number"
            ? invRow.statusCassette
            : 22;

        const inStacker =
          typeof invRow.inStacker === "number" ? invRow.inStacker : 0;
        const inCassette =
          typeof invRow.inCassette === "number" ? invRow.inCassette : 0;

        // type = 1 -> NOTE
        // type = 2 -> COIN
        // statusCassette > 4 -> error or N/A
        if (
          !invRow.type ||
          invRow.type < 1 ||
          invRow.type > 2 ||
          statusCassette > 4
        ) {
          continue;
        }

        const rowStackerData = {
          denom: invRow.value,
          qty: inStacker,
          min: invRow.stackerMin || 0,
          capacity: invRow.capStacker || 0,
          status: statusStacker,
        };

        // Note
        if (invRow.type === 1) {
          // aggregate NOTE cassette
          noteCassette = {
            ...noteCassette,
            qty: noteCassette.qty + inCassette,
            capacity: invRow.capCassette || 0,
            status: statusCassette,
            cassetteAmount:
              Number(noteCassette.cassetteAmount) + inCassette * invRow.value,
          };

          // add rowStackerData to array
          if (statusStacker <= 4) {
            noteStacker.push(rowStackerData);
          }
        }

        // Coin
        if (invRow.type === 2) {
          // aggregate COIN cassette
          coinCassette = {
            ...coinCassette,
            qty: coinCassette.qty + inCassette,
            capacity: invRow.capCassette || 0,
            status: statusCassette,
            cassetteAmount:
              Number(coinCassette.cassetteAmount) + inCassette * invRow.value,
          };

          // add rowStackerData to array
          if (statusStacker <= 4) {
            coinStacker.push(rowStackerData);
          }
        }
      }

      return {
        noteStacker: noteStacker.sort((a, b) => b.denom! - a.denom!),
        coinStacker: coinStacker.sort((a, b) => b.denom! - a.denom!),
        noteCassette,
        coinCassette,
      };
    }, [machineInventory]);

  const isConfig = session?.user.permissions.some((p) => p === "INV_CONFIG");

  return (
    <div className="custom-scrollbar relative mx-auto flex h-[calc(100vh-4rem)] flex-col gap-4 overflow-y-auto p-4 pb-16 pt-6 xl:w-4/5">
      <LoadingDialog isOpen={isInvFetching} />
      {/* Header */}
      <div className="flex-between">
        <div>
          <h1 className="text-2xl font-bold">Machine Inventory - Status</h1>
          <h2 className="text-slate-500">สถาณะเครื่องจัดการเงินสด</h2>
        </div>

        <Link
          href={isConfig ? "/inventory/config" : "#"}
          className={cn(
            "flex items-center gap-2 rounded-md bg-blue-800 px-4 py-2 text-white hover:bg-red-500",
            isConfig ? "" : "hidden"
          )}
        >
          <Settings size={40} />
          <div className="text-center">
            <p className="text-lg font-bold">Config - ตั้งค่าเงินทอน</p>
          </div>
        </Link>
      </div>

      <Separator />

      <div className="space-y-6 rounded-lg bg-slate-50 p-4">
        {/* NOTE */}
        <div className="space-y-2 rounded-lg bg-white p-4 shadow-md">
          <MachineInvTitle
            title="Note Machine - เครื่องธนบัตร"
            amount={{
              recycle: noteStacker.reduce(
                (agg, stk) => agg + Number(stk.denom) * stk.qty,
                0
              ),
              cassette: noteCassette.cassetteAmount || 0,
            }}
          />

          <Separator />

          <div className="custom-scrollbar flex w-full items-center justify-center gap-2 overflow-x-auto overscroll-contain p-2">
            {noteStacker.map((stacker, idx) => (
              <MachineInventoryDisp
                key={`${stacker.denom}-${idx}`}
                {...stacker}
              />
            ))}

            <Separator
              orientation="vertical"
              className="h-[80px] w-[2px] bg-slate-400"
            />
            <MachineInventoryDisp {...noteCassette} />
          </div>
        </div>

        {/* COIN */}
        <div className="space-y-2 rounded-lg bg-white p-4 shadow-md">
          <MachineInvTitle
            title="Coin Machine - เครื่องเหรียญ"
            amount={{
              recycle: coinStacker.reduce(
                (agg, stk) => agg + Number(stk.denom) * stk.qty,
                0
              ),
              cassette: coinCassette.cassetteAmount || 0,
            }}
          />

          <Separator />

          <div className="custom-scrollbar flex w-full items-center justify-center gap-2 overflow-x-auto overscroll-contain p-2">
            {coinStacker.map((stacker, idx) => (
              <MachineInventoryDisp
                key={`${stacker.denom}-${idx}`}
                {...stacker}
              />
            ))}

            <Separator
              orientation="vertical"
              className="h-[80px] w-[2px] bg-slate-400"
            />
            <MachineInventoryDisp {...coinCassette} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default InventoryPage;
