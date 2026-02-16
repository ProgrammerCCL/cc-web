"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { useMachineContext } from "@/context";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { IDenomination } from "@/types/model";
import { getInventory } from "@/lib/actions/inventory.actions";
import {
  createExchangeDispense,
  createExchangeSale,
  getExchangeFee,
  updateExchangeDetails,
} from "@/lib/actions/exchange.actions";
import { CircleChevronLeft } from "lucide-react";
import { getWIPv2ById } from "@/lib/actions/wip.actions";
import { IDenomQty } from "@/types/withdraw";
import { useSession } from "next-auth/react";
import { calculateDenom } from "@/lib/utils";
import { ErrorAlertWithDetails, WipDispenseDialog } from "@/components/dialogs";
import { WithdrawDetails } from "@/components/withdraw";
import { Separator } from "@/components/ui/separator";

type TExchangeStatus =
  | "init"
  | "ready"
  | "wip-sale"
  | "wip-loading"
  | "wip-dispense"
  | "finishing"
  | "finished"
  | "error"
  | "loading";

interface IExchangeState {
  status: TExchangeStatus;
  sale: {
    amount: number;
    fee: number;
    total: number;
  };
  dispense: {
    amount: number;
    details: IDenomQty[];
  };
  available: {
    amount: number;
    details: IDenomQty[];
  };
  dialogMsgs: string[];
  errMsgs: string[];
}

interface IWipInfo {
  wipId: number;
  transId: string;
}

// INIT STATE
const INIT_STATE = {
  status: "init",
  sale: {
    amount: 0,
    fee: 0,
    total: 0,
  },
  dispense: {
    amount: 0,
    details: [],
  },
  available: {
    amount: 0,
    details: [],
  },
  dialogMsgs: [],
  errMsgs: [],
} as IExchangeState;

const MIN_CHANGE = 999;
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function ExchangePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { machineUsed } = useMachineContext();
  const { data: session } = useSession();

  const excStatus = useRef<TExchangeStatus>("init");
  const wipRef = useRef<IWipInfo | null>(null);
  const wipDenoms = useRef<IDenomination[]>([]);

  const [transId, setTransId] = useState<string | null>(null);

  const [isClient, setIsClient] = useState(false);
  const [formState, setFormState] = useState<IExchangeState>(INIT_STATE);

  const handleStatusChange = (status: TExchangeStatus) => {
    excStatus.current = status;
    setFormState((prev) => ({ ...prev, status }));
  };

  const handleDialgMsgChange = (
    field: "dialogMsgs" | "errMsgs",
    value: string[]
  ) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
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
        sale: {
          ...prev.sale,
          amount,
          total: amount === 0 ? amount : amount + prev.sale.fee,
        },
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
    if (excStatus.current === "loading") return;

    handleStatusChange("loading");
    try {
      const { success, data, error } = await getInventory();
      const fee = await getExchangeFee();

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

        // Reduce minimum changes for sale process : 999THB
        const reduceRes = calculateDenom(MIN_CHANGE, available.details);
        if (reduceRes.success) {
          available.amount = available.amount - MIN_CHANGE;
          available.details = available.details.map((detail) => {
            const idx = reduceRes.denoms.findIndex(
              (res) => res.key === detail.key
            );
            if (idx < 0) {
              return detail;
            }

            return {
              ...detail,
              qty: detail.qty - reduceRes.denoms[idx].qty,
            };
          });
        } else {
          handleStatusChange("error");
          toast({
            title: "เงินที่มีในเครื่อง : ไม่พอให้แลก",
            variant: "destructive",
          });
          setFormState({ ...INIT_STATE, status: "error" });
          excStatus.current = "error";
        }

        // Update status manully
        setFormState({
          ...INIT_STATE,
          status: "ready",
          sale: { ...INIT_STATE.sale, fee },
          available,
        });
        excStatus.current = "ready";
      }
    } catch (err: any) {
      console.error("[ERROR] getInventery Failed", err.message);
    }
  };

  const checkProcessStatus = async () => {
    if (!["wip-sale", "wip-dispense"].includes(excStatus.current)) {
      return;
    }

    const wipId = wipRef.current?.wipId;

    if (!wipId) {
      console.error("[ERROR] wipID not found");
      return;
    }

    try {
      const { success, data, error } = await getWIPv2ById({
        id: wipId.toString(),
      });

      if (!success || !data) {
        handleStatusChange("error");
        handleDialgMsgChange("errMsgs", [
          "เกิดข้อผิดพลาด ระหว่างการทำรายการ",
          "กรุณาติดต่อเจ้าหน้าที่",
          "---",
          "Get WIP status : Failed",
          `:${error}`,
        ]);
        return;
      }

      // Sale Process
      if (excStatus.current === "wip-sale") {
        const received = data.cashin || 0;
        const amount = data.amount || 0;
        const diff = amount - received;

        handleDialgMsgChange("dialogMsgs", [
          `เติมเงินแล้ว : ${received}`,
          `${diff > 0 ? "ขาดอีก" : "รับเงินทอน"} : ${Math.abs(diff)} `,
        ]);

        // Sale : finished
        if (["FINISH", "FINISHED"].includes(data.status.toUpperCase())) {
          // triggle startDispenseProcess
          wipDenoms.current = data.denom;
          startDispenseProcess();
        }
        // Dispense Process
      } else if (excStatus.current === "wip-dispense") {
        // Dispense : finished
        if (["FINISH", "FINISHED"].includes(data.status.toUpperCase())) {
          // triggle finishingProcess
          wipDenoms.current = [...wipDenoms.current, ...data.denom];
          startFinishingProcess();
        }
      } else if (data.status === "ERROR") {
        handleStatusChange("error");
        handleDialgMsgChange("errMsgs", [
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
      handleDialgMsgChange("errMsgs", [
        "เกิดข้อผิดพลาด ระหว่างการทำรายการ",
        "กรุณาติดต่อเจ้าหน้าที่",
        "---",
        "Get WIP status : Failed",
        `:${err.message || "-"}`,
      ]);
    }
  };

  const startExchangeProcess = async () => {
    if (!machineUsed || !machineUsed.id || excStatus.current !== "ready") {
      return;
    }

    const machineId = machineUsed.id;
    const amount = formState.sale.total;
    const denominations = formState.dispense.details.map((d) => ({
      denom: d.key,
      qty: d.qty,
    }));

    try {
      const { success, wipId, id, error } = await createExchangeSale({
        machineId,
        amount,
        denominations,
      });

      if (success && wipId && id) {
        wipRef.current = { wipId, transId: id };
        setTransId(id);
        handleStatusChange("wip-sale");
        handleDialgMsgChange("dialogMsgs", [
          "ชำระเงินแล้ว : 0",
          `ขาดอีก : ${amount}`,
        ]);

        return;
      }

      toast({
        title: "คำสังเติมเงิน ผิดพลาด",
        description: error || "Something went wrong at server side.",
        variant: "destructive",
      });
    } catch (err: any) {
      console.error("[ERROR] startExchangeProcess Failed", err.message);
      toast({
        title: "คำสังเติมเงิน ผิดพลาด",
        description: err.message || "Something went wrong at server side.",
        variant: "destructive",
      });
    }
  };

  const startDispenseProcess = async () => {
    const transId = wipRef.current?.transId || "";

    if (
      !machineUsed ||
      !machineUsed.id ||
      excStatus.current !== "wip-sale" ||
      transId.length === 0
    ) {
      return;
    }

    handleStatusChange("wip-loading");

    const machineId = machineUsed.id;
    const amount = formState.dispense.amount;
    const denominations = formState.dispense.details.map((d) => ({
      denom: d.key,
      qty: d.qty,
    }));

    try {
      await delay(3000);
      const { success, wipId, error } = await createExchangeDispense({
        transId,
        machineId,
        amount,
        denominations,
      });

      if (!success || !wipId || error) {
        console.error("[ERROR] startDispenseProcess failed :", error);
        handleStatusChange("error");
        handleDialgMsgChange("errMsgs", [
          "เกิดข้อผิดพลาด ระหว่างการทำรายการ",
          "กรุณาติดต่อเจ้าหน้าที่",
          "---",
          "startDispenseProcess : Failed",
          `:${error || "-"}`,
        ]);
        return;
      }

      handleStatusChange("wip-dispense");
      handleDialgMsgChange("dialogMsgs", [
        "กรุณาตรวจสอบเงินที่ได้รับ",
        "เครื่องจ่ายธนบัตรได้ ครั้งละ 10 ฉบับ",
      ]);

      wipRef.current = { transId, wipId: wipId! };
    } catch (err: any) {
      console.error("[ERROR] startDispenseProcess failed :", err.message);
      handleStatusChange("error");
      handleDialgMsgChange("errMsgs", [
        "เกิดข้อผิดพลาด ระหว่างการทำรายการ",
        "กรุณาติดต่อเจ้าหน้าที่",
        "---",
        "startDispenseProcess : Failed",
        `:${err.message || "-"}`,
      ]);
    }
  };

  const startFinishingProcess = async () => {
    // Make sure that only allow status = "wip".
    if (excStatus.current !== "wip-dispense") return;

    // Change status imediatly.
    handleStatusChange("finishing");

    const transId = wipRef.current?.transId;

    if (!transId) {
      console.error("[ERROR] startFinishingProcess : transId not found");
      return;
    }

    const fee = formState.sale.fee || 0;
    const amount = formState.sale.amount;

    const { cashIn, cashOut } = wipDenoms.current.reduce(
      (agg, d) => {
        const iscashin = d.iscashin;
        const adjIsCashIn =
          typeof iscashin === "boolean" ? iscashin : iscashin === "true";

        const key = adjIsCashIn ? "cashIn" : "cashOut";

        return {
          ...agg,
          [key]: [...agg[key], { denom: d.denom, qty: d.qty, iscashin }],
        };
      },
      { cashIn: [], cashOut: [] } as {
        cashIn: IDenomination[];
        cashOut: IDenomination[];
      }
    );

    try {
      const success = await updateExchangeDetails({
        transId,
        cashOut,
        cashIn,
        amount,
        fee,
      });

      if (!success) {
        handleStatusChange("error");
        handleDialgMsgChange("errMsgs", [
          "เกิดข้อผิดพลาด ระหว่างการทำรายการ",
          "กรุณาติดต่อเจ้าหน้าที่",
          "---",
          "Finallized transation : Failed",
        ]);
      }

      // finished
      handleStatusChange("finished");
    } catch (err: any) {
      handleStatusChange("error");
      handleDialgMsgChange("errMsgs", [
        "เกิดข้อผิดพลาด ระหว่างการทำรายการ",
        "กรุณาติดต่อเจ้าหน้าที่",
        "---",
        "Finallized transation : Failed",
        `:${err.message || "-"}`,
      ]);
    }
  };

  /* eslint-disable */
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Start interval
  useEffect(() => {
    if (transId) {
      const intervalId = setInterval(async () => {
        await checkProcessStatus();
      }, 3000);

      return () => clearInterval(intervalId);
    }
  }, [transId]);

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
  /* eslint-enable */

  const dialogTitle = useMemo(() => {
    switch (formState.status) {
      case "wip-sale":
        return "กรุณาชำระเงิน";
      case "wip-dispense":
        return "กรุณารับเงิน ที่เลือกไว้";
      case "finished":
        return "ทำรายการสำเร็จ";
      default:
        return "";
    }
  }, [formState]);

  const dialogAmount = useMemo(() => {
    switch (formState.status) {
      case "wip-sale":
        return formState.sale.total;
      case "wip-dispense":
        return formState.sale.amount;
      case "finished":
        return formState.sale.amount;
      default:
        return "";
    }
  }, [formState]);

  return (
    <div className="mx-auto size-full max-w-[1100px] rounded-lg bg-slate-50 px-3">
      <ErrorAlertWithDetails
        open={formState.errMsgs.length > 0}
        msgs={formState.errMsgs}
      />

      <WipDispenseDialog
        title={dialogTitle}
        amount={dialogAmount.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
        open={[
          "wip-loading",
          "wip-sale",
          "wip-dispense",
          "finishing",
          "finished",
        ].includes(excStatus.current)}
        finished={excStatus.current === "finished"}
        msgs={formState.dialogMsgs}
        onClose={() => router.push("/admin")}
      />

      <div className="flex gap-4 ">
        <div className="w-1/2 space-y-6 px-8 py-4">
          {/* title */}
          <h1 className="mx-auto text-center text-3xl font-bold text-cyan-950">
            รายการแลกเงิน
          </h1>

          {/* amount */}
          <div className="mx-auto flex w-5/6 flex-1 flex-col gap-2">
            <h3 className="text-center text-xl font-bold text-cyan-950">
              จำนวนเงิน
            </h3>
            <div className="w-full overflow-hidden rounded-md border-2 border-blue-950 text-right text-[27px]">
              <span className="m-2">
                {formState.dispense.amount.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>

          {/* fee */}
          <div className="mx-auto flex w-5/6 flex-1 flex-col gap-2">
            <h3 className="text-center text-xl font-bold text-cyan-950">
              ค่าธรรมเนียม
            </h3>
            <div className="w-full overflow-hidden rounded-md border-2 border-blue-950 text-right text-[27px]">
              <span className="m-2">
                {formState.sale.fee.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>

          <Separator />

          {/* total amount */}
          <div className="mx-auto flex w-5/6 flex-1 flex-col gap-2">
            <h3 className="text-center text-xl font-bold text-cyan-950">
              ยอดรวมที่ต้องจ่าย
            </h3>
            <div className="w-full overflow-hidden rounded-md border-2 border-blue-950 bg-yellow-200 text-right text-[27px]">
              <span className="m-2">
                {formState.sale.total.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>

          <Separator />

          {/* <div className="mx-auto flex w-5/6 flex-1 flex-col gap-2">
            <h3 className="text-center text-xl font-bold text-cyan-950">
              เติมเงินแล้ว
            </h3>
            <div className="w-full overflow-hidden rounded-md border-2 border-blue-950 text-right text-[27px]">
              <span className="m-2">{0}</span>
            </div>
          </div> */}
        </div>

        <div className="mt-5 w-1/2 flex-col rounded-t-sm ">
          <WithdrawDetails
            amount={formState.dispense.details}
            available={formState.available.details}
            onDetailChange={handleDispenseDetailsChange}
            disabled={!["ready"].includes(formState.status)}
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
                formState.sale.amount <= 0 || formState.status !== "ready"
              }
              onClick={() => startExchangeProcess()}
            >
              ยืนยัน
            </Button>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default ExchangePage;
