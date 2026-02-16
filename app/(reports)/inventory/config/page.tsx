"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { CircleChevronLeft } from "lucide-react";

import { InventoryDetailComponent } from "@/components/backoffice/inventory";
import { LoadingDialog } from "@/components/shared/loading";

// import { getInventory, patchInventory } from "@/lib/actions/inventory.actions";
import { patchInventory } from "@/lib/actions/inventory.actions";

import { IInventoryItem } from "@/types/model";

// import { MoneyDetail } from "@/constants";
import { useInventoryContext } from "@/context";

const INV_CONF_PERM = ["BACK_OFFICE", "INV_CONFIG"];

function InventoryConfigPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();
  const { machineInventory, isInvFetching, fetchInventory } =
    useInventoryContext();

  const [inventoryData, setInventoryData] =
    useState<IInventoryItem[]>(machineInventory);

  const [isEdit, setIsEdit] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  // const [isLoading, setIsLoading] = useState(true);

  if (!INV_CONF_PERM.every((p) => session?.user.permissions.includes(p))) {
    router.push("/operation");
  }

  const submitDataToAPI = async () => {
    if (isSubmitted) return;

    setIsSubmitted(true);
    try {
      const { success, error } = await patchInventory(
        inventoryData.map((invItem) => ({
          denom: invItem.denom,
          stackerMin: invItem.stackerMin || 0,
          refillPoint: invItem.refillPoint || 0,
        }))
      );

      if (success) {
        toast({
          variant: "success",
          title: `Update success.`,
          description: `Inventory updated successfully.`,
        });

        setIsEdit(false);
        fetchInventory();
      } else {
        toast({
          variant: "destructive",
          title: `Fail ${error}.`,
          description: `Inventory updated fail.`,
        });
      }
    } catch (err: any) {
      console.error("[ERROR] getInventery Failed", err.message);
      toast({
        variant: "destructive",
        title: `Error: getInventery Failed ${err.message}`,
        description: `Fetch Inventory Failed.`,
      });
    } finally {
      setIsSubmitted(false);
    }
  };

  const cancelEditHandler = () => {
    setIsEdit(false);
    fetchInventory();
  };

  const handleDataUpdate = (itemId: string, value: number) => {
    const [denom, field] = itemId.split("-");
    setInventoryData((prev) =>
      prev.map((inv) => {
        return inv.denom === denom ? { ...inv, [field]: value } : inv;
      })
    );
  };

  /* eslint-disable */
  useEffect(() => {
    // fetchInventory();
  }, []);

  useEffect(() => {
    setInventoryData(machineInventory);
  }, [machineInventory]);
  /* eslint-enable */

  return (
    <div className="custom-scrollbar relative mx-auto h-[calc(100vh-4rem)] w-full overflow-y-auto pb-16 pt-6 xl:w-4/5">
      <LoadingDialog isOpen={isInvFetching} />

      <InventoryDetailComponent
        data={inventoryData}
        isEdit={isEdit}
        onDataChange={handleDataUpdate}
      />

      <div className="flex justify-end gap-4 p-5">
        {inventoryData.length > 0 ? (
          !isEdit ? (
            <Button
              className="h-full w-1/2 text-2xl md:w-1/4"
              onClick={() => setIsEdit(true)}
              // disabled={isEdit === false}
            >
              แก้ไข
            </Button>
          ) : (
            <>
              <Button
                className="flex h-full w-1/2 gap-3 border-2 border-blue-950 bg-white text-2xl text-blue-950 hover:text-white md:w-1/4"
                onClick={() => cancelEditHandler()}
              >
                <CircleChevronLeft width={22} height={22} />
                ยกเลิก
              </Button>

              <Button
                className="h-full w-1/2 text-2xl md:w-1/4"
                onClick={() => submitDataToAPI()}
                disabled={isSubmitted}
              >
                {isSubmitted ? "กำลังบันทึก..." : "บันทึก"}
              </Button>
            </>
          )
        ) : null}
      </div>
    </div>
  );
}

export default InventoryConfigPage;
