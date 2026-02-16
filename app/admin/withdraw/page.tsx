"use client";

import React, { useEffect, useRef, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import {
  createDispense,
  updateCashDetails,
} from "@/lib/actions/dispense.actions";
import { getInventory } from "@/lib/actions/inventory.actions";
import { getWIPv2ById } from "@/lib/actions/wip.actions";

import { useMachineContext } from "@/context";

import { IDenomination } from "@/types/model";
import { IDenomQty } from "@/types/withdraw";

import { CircleChevronLeft } from "lucide-react";

import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { WithdrawAmount, WithdrawDetails } from "@/components/withdraw";
import { ErrorAlertWithDetails, WipDispenseDialog } from "@/components/dialogs";

type TDispenseStatus =
  | "init"
  | "ready"
  | "wip"
  | "finishing"
  | "finished"
  | "error"
  | "loading";

interface IDispenseState {
  status: TDispenseStatus;
  dispense: {
    amount: number;
    details: IDenomQty[];
  };
  available: {
    amount: number;
    details: IDenomQty[];
  };
  dialogMsgs: string[];
}

// INIT STATE
const INIT_STATE = {
  status: "init",
  dispense: {
    amount: 0,
    details: [],
  },
  available: {
    amount: 0,
    details: [],
  },
  dialogMsgs: [],
} as IDispenseState;

// Main function
function WithdrawPage() {
  const router = useRouter();
  const { machineUsed } = useMachineContext();
  const { data: session } = useSession();

  const dispenseStatus = useRef<TDispenseStatus>("init");

  const [isClient, setIsClient] = useState(false);
  const [formState, setFormState] = useState<IDispenseState>(INIT_STATE);

  const [wipId, setWipId] = useState<number | null>(null);
  const [transId, setTransId] = useState<string | null>(null);

  const handleStatusChange = (status: TDispenseStatus) => {
    dispenseStatus.current = status;
    setFormState((prev) => ({ ...prev, status }));
  };

  const handleDialgMsgChange = (dialogMsgs: string[]) => {
    setFormState((prev) => ({ ...prev, dialogMsgs }));
  };

  const handleDispenseAmountChange = (amount: number) => {
    setFormState((prev) => {
      let remain = amount;

      const sortedAvailable = [...prev.available.details].sort(
        (a, b) => b.value - a.value
      );

      const newDispenseDetails: IDenomQty[] = [];

      for (const denom of sortedAvailable) {
        if (remain <= 0) break;

        // Max number of this denom needed to cover 'remain'
        const needed = Math.floor(remain / denom.value);

        // Actual quantity we can dispense (cannot exceed what we have)
        const useQty = Math.min(needed, denom.qty);

        if (useQty > 0) {
          newDispenseDetails.push({
            key: denom.key,
            value: denom.value,
            qty: useQty,
          });
          // Reduce the remain by the total value we dispensed
          remain -= useQty * denom.value;
        }
      }

      return {
        ...prev,
        status: remain > 0 ? "error" : "ready",
        dispense: {
          amount,
          details: newDispenseDetails,
        },
      };
    });

    if (amount > formState.available.amount || isNaN(amount)) {
      // change status to : error
      handleStatusChange("error");

      toast({
        title: "เงินที่มีในเครื่อง : ไม่พอจ่าย",
        variant: "destructive",
      });
    }
  };

  const handleDispenseDetailsChange = (denom: IDenomQty) => {
    setFormState((prev) => {
      const dIdx = prev.available.details.findIndex(
        (d) => d.value === denom.value
      );

      if (dIdx < 0 || prev.available.details[dIdx].qty < denom.qty) {
        // Incorrect denom value or qty
        return prev;
      }

      const filtered = prev.dispense.details.filter(
        (d) => d.value !== denom.value
      );

      const details = [...filtered, denom];
      const amount = details.reduce((agg, itm) => agg + itm.value * itm.qty, 0);

      return {
        ...prev,
        dispense: {
          amount,
          details,
        },
      };
    });

    // change status to ready
    handleStatusChange("ready");
  };

  const fetchInventory = async () => {
    if (dispenseStatus.current === "loading") return;

    handleStatusChange("loading");
    try {
      const { success, data, error } = await getInventory();

      if (error) {
        toast({
          title: "พบข้อผิดพลาด",
          description: "ไม่สามารถเชื่อมต่อกับเครื่องได้",
          variant: "destructive",
        });
        console.error("[ERROR]", error);

        handleStatusChange("error");

        return;
      }

      if (success && data && data.length > 0) {
        // New
        const available = data.reduce(
          (prev, inv) => {
            if (inv.value < 1) {
              return prev;
            }

            const thisAmount = inv.value * inv.inStacker;
            return {
              amount: prev.amount + thisAmount,
              details: [
                ...prev.details,
                { value: inv.value, qty: inv.inStacker, key: inv.denom },
              ],
            };
          },
          { amount: 0, details: [] as IDenomQty[] }
        );

        // Update status manully
        setFormState({ ...INIT_STATE, status: "ready", available });
        dispenseStatus.current = "ready";
      }
    } catch (err: any) {
      console.error("[ERROR] getInventery Failed", err.message);
    }
  };

  // Create new WIP
  const startDispWIP = async () => {
    if (!machineUsed || !machineUsed.id || dispenseStatus.current !== "ready") {
      return;
    }

    const amount = formState.dispense.amount;
    const machineId = machineUsed.id;

    try {
      const { success, wipId, id, error } = await createDispense({
        machineId,
        amount,
        denominations: formState.dispense.details.map((d) => ({
          denom: d.key,
          qty: d.qty,
        })),
      });

      if (success && wipId && id) {
        setTransId(id);
        setWipId(wipId);
        toast({
          title: "เริ่มกระบวนการถอนเงิน",
          description: "เครื่องจ่าย ธนบัตร ครั้งละไม่เกิน 10 ฉบับ",
          variant: "success",
        });

        // change status to : wip
        handleStatusChange("wip");
      } else {
        console.error(
          "[ERROR]",
          error || "API returned unsuccessful startDispense."
        );
        toast({
          title: "คำสั่งถอนเงิน ผิดพลาด",
          description: error || "Create WIP Failed",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      console.error("[ERROR] startDispense Failed", err.message);
      toast({
        title: "คำสั่งถอนเงิน ผิดพลาด",
        description: err.message || "Something went wrong at server side.",
        variant: "destructive",
      });
    }
  };

  // Get WIP status
  const getDispensStatus = async (id: number | null, trxId: string | null) => {
    if (dispenseStatus.current !== "wip" || !id || !trxId) return;

    try {
      const { success, data, error } = await getWIPv2ById({
        id: id.toString(),
      });

      if (!success || !data) {
        handleStatusChange("error");
        handleDialgMsgChange([
          "เกิดข้อผิดพลาด ระหว่างการทำรายการ",
          "กรุณาติดต่อเจ้าหน้าที่",
          "---",
          "Get WIP status : Failed",
          `:${error}`,
        ]);
        return;
      }

      if (
        ["FINISH", "FINISHED"].includes(data.status.toUpperCase()) &&
        dispenseStatus.current === "wip"
      ) {
        // only get in this when status = wip
        await finishingDispense(trxId, data.denom, data.amount.toString());
      } else if (data.status === "ERROR") {
        handleStatusChange("error");
        handleDialgMsgChange([
          "เกิดข้อผิดพลาด ระหว่างการทำรายการ",
          "กรุณาติดต่อเจ้าหน้าที่",
          "---",
          "Machine status : ERROR",
          `:${error}`,
        ]);
      }
    } catch (err: any) {
      console.error("[ERROR] getDispense Failed", err.message);
      handleStatusChange("error");
      handleDialgMsgChange([
        "เกิดข้อผิดพลาด ระหว่างการทำรายการ",
        "กรุณาติดต่อเจ้าหน้าที่",
        "---",
        "Get WIP status : Failed",
        `:${err.message || "-"}`,
      ]);
    }
  };

  const finishingDispense = async (
    transactionId: string,
    cashOut: IDenomination[],
    amount: string
  ) => {
    // Make sure that only allow status = "wip".
    if (dispenseStatus.current !== "wip") return;

    // Change status imediatly.
    handleStatusChange("finishing");

    try {
      const finishSuccess = await updateCashDetails(
        transactionId,
        cashOut,
        amount
      );

      if (finishSuccess) {
        handleStatusChange("finished");
      } else {
        handleStatusChange("error");
        handleDialgMsgChange([
          "เกิดข้อผิดพลาด ระหว่างการทำรายการ",
          "กรุณาติดต่อเจ้าหน้าที่",
          "---",
          "Update transaction : Failed",
        ]);
      }
    } catch (err: any) {
      handleStatusChange("error");
      handleDialgMsgChange([
        "เกิดข้อผิดพลาด ระหว่างการทำรายการ",
        "กรุณาติดต่อเจ้าหน้าที่",
        "---",
        "Get WIP status : Failed",
        `:${err.message || "-"}`,
      ]);
    }
  };

  /* eslint-disable */
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && session) {
      if (!session.user.permissions.includes("CASH_DISPENSE")) {
        redirect("/admin");
      }

      if (!machineUsed) {
        redirect("/");
      }

      fetchInventory();
    }
  }, [isClient, session, machineUsed]);

  // Start interval
  useEffect(() => {
    if (wipId && transId) {
      const intervalId = setInterval(async () => {
        await getDispensStatus(wipId, transId);
      }, 3000);

      return () => clearInterval(intervalId);
    }
  }, [wipId, transId]);

  /* eslint-enable */

  return (
    <div className="mx-auto size-full max-w-[1100px] rounded-lg bg-slate-50 px-3">
      <ErrorAlertWithDetails
        open={formState.dialogMsgs.length > 0}
        msgs={formState.dialogMsgs}
      />

      <WipDispenseDialog
        title={
          formState.status === "finished" ? "ถอนเงินสำเร็จ" : "กำลังถอนเงิน..."
        }
        amount={formState.dispense.amount.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
        open={["wip", "finishing", "finished"].includes(dispenseStatus.current)}
        finished={dispenseStatus.current === "finished"}
        msgs={[
          "กรุณารับเงิน และตรวจสอบความถูกต้อง",
          "เครื่องจ่ายธนบัตรครั้งละ 10 ฉบับ",
        ]}
        onClose={() => router.push("/admin")}
      />

      <div className="flex gap-4 ">
        <div className="w-1/2 px-8 ">
          <WithdrawAmount
            amount={formState.dispense.amount}
            available={formState.available.amount}
            onAmountChange={handleDispenseAmountChange}
            isError={formState.status === "error"}
            disabled={["init", "loading", "wip", "finish"].includes(
              formState.status
            )}
          />
        </div>

        <div className="mt-5 w-1/2 flex-col rounded-t-sm ">
          <WithdrawDetails
            amount={formState.dispense.details}
            available={formState.available.details}
            onDetailChange={handleDispenseDetailsChange}
            disabled={["init", "loading", "wip", "finish"].includes(
              formState.status
            )}
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 p-5">
        {formState.status === "ready" ? (
          <>
            <Button
              className="flex h-full w-1/2 gap-3 border-2 border-blue-950 bg-white text-2xl text-blue-950 hover:text-white md:w-1/4"
              onClick={() => router.push("/admin")}
            >
              <CircleChevronLeft width={22} height={22} />
              กลับหน้าหลัก
            </Button>
            <Button
              className="h-full w-1/2 text-2xl md:w-1/4"
              disabled={
                formState.dispense.amount <= 0 || formState.status !== "ready"
              }
              onClick={() => startDispWIP()}
            >
              ยืนยัน
            </Button>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default WithdrawPage;
