"use client";

import {
  deleteTransaction,
  updateCashDetails,
} from "@/lib/actions/transactionUpdate.actions";
import { useSession } from "next-auth/react";
import { useMachineContext } from "@/context";
import { Button } from "@/components/ui/button";
import { CircleChevronLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { redirect, useRouter } from "next/navigation";
import { getWIPv2ById } from "@/lib/actions/wip.actions";
import { useSidebarContext } from "@/context/sidebar.context";
import { getInventory } from "@/lib/actions/inventory.actions";
import { DialogComponent } from "@/components/shared/container";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { DEFAULT_REFILL_COIN, DEFAULT_REFILL_NOTE } from "@/constants";
import { endDeposit, postDeposit } from "@/lib/actions/deposit.actions";
import { AddingDepositComponents } from "@/components/backoffice/adding";
import { IBathItem, IDenomination, IMachineApiData } from "@/types/model";

const DISP_TEMPLATE = [...DEFAULT_REFILL_NOTE, ...DEFAULT_REFILL_COIN];

function PageDeposit() {
  const router = useRouter();
  const { toast } = useToast();
  const calledRef = useRef(false);
  const { dismissAll } = useToast();
  const { data: session } = useSession();
  const [remark, setRemark] = useState("");
  const [massage, setMassage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { machineUsed } = useMachineContext();
  const [isError, setIsError] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isReady, setIsReady] = useState("remark");
  const { disableAll, enableAll } = useSidebarContext();
  const [wipId, setWipId] = useState<number | null>(null);
  const [transId, setTransId] = useState<string | null>(null);
  const [changeMoney, setChangeMoney] = useState<IBathItem[]>([]);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [headerFinish, setHeaderFinish] = useState("เครื่องกำลังทำงาน");
  const [DepProcessData, setDepProcessData] = useState<IMachineApiData | null>(
    null
  );

  // step 1 : ตรวจสอบสถานะเงินในเครื่อง
  const checkInventory = async () => {
    try {
      setIsOpen(true);
      setHeaderFinish("กำลังตรวจสอบความพร้อมเครื่อง");
      setMassage("กรุณารอสักครู่");

      const { success, error, message } = await getInventory();

      setIsOpen(false);

      if (success && message) {
        const isCasetteError = message.some((m) => m.includes("ERROR"));
        const isCasetteFull = message.some((m) => m.includes("FULL"));
        if (isCasetteError || isCasetteFull) {
          setIsReady("not-start");
          console.error("[ERROR] action getInventory Failed", {
            success,
            message,
          });
          toast({
            title: "ไม่สามารถฝากงินได้",
            description: message + ": กรุณาตรวจสอบสถานะกล่องเงิน",
            variant: "destructive",
          });
        }
      } else if (error) {
        setIsReady("not-start");
        console.error("[ERROR] action getInventory Failed", {
          success,
          error,
        });
        toast({
          title: "ไม่สามารถตรวจสอบสถานะเงินได้",
          description: error + ": ตรวจสอบสถานะเงินไม่สำเร็จ",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      setIsReady("error");
      setMassage("การตรวจสอบสถานะเงินในเครื่องผิดพลาด !!");
      console.error("[ERROR] checkInventory Failed", err.message);
    }
  };

  // step 2 : เริ่มการฝากเงิน
  const handleStartDeposit = async () => {
    if (!machineUsed) return;
    const machineId = machineUsed.id;
    if (!machineId) return;
    try {
      const dataResponde = await postDeposit(machineId, remark);

      if (dataResponde.success && dataResponde.wipId && dataResponde.id) {
        setWipId(dataResponde.wipId);
        setTransId(dataResponde.id);
        setIsReady("wip");
        setIsOverlayVisible(true);
        disableAll();
      } else {
        console.error("[ERROR] action postDeposit Failed", { dataResponde });
        toast({
          title: "Start Deposit Error",
          description:
            "ไม่สามารถฝากเงินได้! กรุณาตรวจสอบความพร้อมเครื่อง หรือติดต่อเจ้าหน้าที่",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      setIsReady("error");
      setMassage("ไม่สามารถทำรายการฝากเงินได้ เกิดข้อผิดพลาด !!");
      console.error("[ERROR] handleStartDeposit Failed", err.message);
    }
  };

  // step 3 : ตรวจสอบสถานะรายการ
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleGetDepositStatus = async () => {
    try {
      if (!wipId) return;

      const { success, data, error } = await getWIPv2ById({
        id: wipId.toString(),
      });

      if (success && data) {
        const denoms =
          typeof data.denom === "string" ? JSON.parse(data.denom) : data.denom;
        const dataToSet = { ...data, denom: denoms };

        setDepProcessData(dataToSet);

        // Update changeMoney
        const chMoney = [] as IBathItem[];
        for (const item of data.denom) {
          if (item.iscashin === "false") {
            continue;
          }

          const chItem = DISP_TEMPLATE.find(
            (m) => Number(m.key) === Number(item.denom)
          );
          if (chItem) {
            chMoney.push({ ...chItem, cash: Number(item.qty) });
          }
        }
        setChangeMoney(chMoney);
        setDepProcessData(data);
      } else {
        setIsReady("error");
        setMassage("การตรวจสอบสถานะการทำรายการผิดพลาด !!");
        console.error("[ERROR] action getWIPv2ById Failed", { error });
      }
    } catch (err: any) {
      setIsReady("error");
      setMassage("การตรวจสอบสถานะการทำรายการผิดพลาด !!");
      console.error("[ERROR] handleGetRefillStatus Failed", err.message);
    }
  };

  // step 4 : ยืนยันการฝากเงิน
  const handleDepositEnd = async () => {
    if (!DepProcessData) return;
    try {
      const procId = DepProcessData.id;
      const DepositSuccess = await endDeposit(procId);

      if (DepositSuccess) {
        setIsReady("end");
      } else {
        setIsReady("error");
        setMassage("ยืนยันการฝากเงินไม่สำเร็จ !!");
        console.error("[ERROR] action endDeposit Failed", { DepositSuccess });
      }
    } catch (err: any) {
      setIsReady("error");
      setMassage("ยืนยันข้อมูลการทำรายการฝากเงินผิดพลาด !!");
      console.error("[ERROR] handleDepositEnd Failed", err.message);
    }
  };

  // step 5 :  อัพเดทฐานข้อมูล PG
  const handlerUpdateCashDetails = async (
    transactionId: string,
    cashIn: IDenomination[],
    cashOut: IDenomination[],
    amount: number,
    status: "wip" | "finish" | "cancel" | "error" // เพิ่มพารามิเตอร์สถานะ
  ) => {
    try {
      const updateSuccess = await updateCashDetails(
        transactionId,
        cashIn,
        cashOut,
        amount,
        status
      );

      if (updateSuccess) {
        if (status === "finish") {
          setIsReady("finished");
          toast({
            title: "Sale Success",
            description: `ทำรายการฝากสำเร็จ!`,
            variant: "success",
          });
        } else if (status === "error") {
          setIsReady("error");
          setMassage("เครื่องทอนเงินขัดข้อง !!");
          console.error("[ERROR] status Machine Error");
        }
      } else {
        setIsReady("error");
        setMassage("บันทึกข้อมูลการทำรายการฝากเงินผิดพลาด !!");
        console.error("[ERROR] action updateCashDetails Failed", {
          updateSuccess,
        });
      }
    } catch (err: any) {
      setIsReady("error");
      setMassage("บันทึกข้อมูลการทำรายการฝากเงินผิดพลาด !!");
      console.error("[ERROR] handlerUpdateCashDetails Failed", err.message);
    }
  };

  // step 5 :  ลบข้อมูลกรณีเริ่มการเติมเงินแล้วแต่ Cashin === 0
  const handleDeleteTransaction = async (transId: string) => {
    try {
      const success = await deleteTransaction(transId);

      if (success) {
        setIsReady("canceled");
      } else {
        setIsReady("error");
        setMassage("ยกเลิกข้อมูลการทำรายการฝากเงินผิดพลาด !!");
        console.error("[ERROR] action deleteTransaction Failed", { success });
      }
    } catch (err: any) {
      setIsReady("error");
      setMassage("ยกเลิกข้อมูลการทำรายการฝากเงินผิดพลาด !!");
      console.error("[ERROR] handleDeleteTransaction Failed", err.message);
    }
  };

  // กดปิด Dialog กรณีเกิด Error
  const handleDialogClose = async () => {
    setIsOpen(false);
    dismissAll();
    enableAll();
  };

  // กดกลับหน้าหลัก
  const onClickBackHome = async () => {
    dismissAll();
    enableAll();
    router.push("/admin");
  };

  // ตรวจสอบข้อมูลจำนวนเงินที่ฝาก ป้องกันข้อมูลผิดพลาด
  const { cashIn } = useMemo(() => {
    try {
      const cashIn = DepProcessData?.cashin || 0;
      return { cashIn };
    } catch (err: any) {
      setIsReady("error");
      setMassage("การตรวจสอบจำนวนเงินที่ฝากผิดพลาด !!");
      console.error("[ERROR] handlerFinishDeposit Failed", err.message);
      return { cashIn: 0 };
    }
  }, [DepProcessData]);

  /* eslint-disable */
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && session) {
      if (!session.user.permissions.includes("CASH_REPLENISH")) {
        redirect("/admin");
      }

      if (!machineUsed) {
        redirect("/operation");
      }

      checkInventory();
    }
  }, [isClient, session, machineUsed]);

  useEffect(() => {
    if (isReady === "wip" || isReady === "end") {
      if (typeof wipId === "number") {
        const intervalId = setInterval(() => {
          handleGetDepositStatus();
        }, 2000);

        return () => clearInterval(intervalId);
      } else {
        console.warn("[WARN] wipId is not a number:", wipId);
      }
    }
  }, [isReady, wipId, handleGetDepositStatus]);

  useEffect(() => {
    if (calledRef.current) return;

    if (DepProcessData) {
      if (!transId) {
        return;
      }

      const SPDDenoms = DepProcessData.denom || [];

      const cashInData = SPDDenoms.filter(
        (item) => item.iscashin === "True"
      ).map((item) => item);

      const cashOutData = SPDDenoms.filter(
        (item) => item.iscashin === "False"
      ).map((item) => item);

      if (DepProcessData.status === "Finished") {
        calledRef.current = true;
        if (DepProcessData.amount > 0) {
          handlerUpdateCashDetails(
            transId,
            cashInData,
            cashOutData,
            DepProcessData.amount,
            "finish"
          );
        } else {
          handleDeleteTransaction(transId);
        }
      } else if (DepProcessData.status === "ERROR") {
        calledRef.current = true;
        handlerUpdateCashDetails(
          transId,
          cashInData,
          cashOutData,
          DepProcessData.amount,
          "error"
        );
      }
    }
  }, [DepProcessData, transId]);

  useEffect(() => {
    if (isReady === "finished") {
      toast({
        title: "Refill Success",
        description: `ทำรายการเติมเงินสำเร็จ รับใบเสร็จ`,
        variant: "success",
      });
      enableAll();
    } else if (isReady === "error") {
      setIsOpen(true);
      setIsError(true);
      setHeaderFinish("กรุณาติดต่อเจ้าหน้าที่ !! ");
      enableAll();
    }
  }, [isReady]);

  /* eslint-enable */

  return (
    <div>
      <DialogComponent
        isOpen={isOpen}
        massage={massage}
        isError={isError}
        headerFinish={headerFinish}
      />

      <div className="relative mx-auto h-screen w-screen shrink-0 overflow-hidden pb-20 md:w-11/12 xl:max-w-[90vw]">
        <div className="mt-2 flex size-full rounded-lg border border-slate-300 p-2">
          {isReady === "remark" ? (
            <div className="flex size-full flex-col items-center justify-center">
              <div className="w-full rounded-lg border-2 border-blue-950 bg-white p-6 shadow-md md:w-1/2">
                <h2 className="mb-4 text-center text-3xl">
                  กรุณากรอกเหตุผลการฝากยอดขาย
                </h2>
                <textarea
                  className="w-full rounded-md border border-gray-300 p-4 text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={5}
                  placeholder="พิมพ์เหตุผลที่นี่..."
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                />
                <div className="mt-6 flex w-full justify-between gap-4">
                  <button
                    className="hover:bg-customButonBlack flex w-full items-center justify-center gap-2 rounded-md border border-blue-950 bg-slate-50 py-2 text-2xl text-blue-950 shadow-sm shadow-black transition hover:text-white"
                    onClick={onClickBackHome}
                  >
                    <CircleChevronLeft width={26} height={26} />
                    กลับหน้าหลัก
                  </button>
                  <button
                    className="hover:bg-customButonBlack w-full rounded-md border border-blue-950 bg-blue-800 py-2 text-2xl text-white shadow-sm shadow-black transition disabled:bg-gray-400"
                    onClick={() => setIsReady("start")}
                    disabled={!remark.trim()}
                  >
                    ยืนยัน
                    <br />
                    ฝากยอดขาย
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          <div className="relative size-full flex-1 overflow-hidden rounded-lg bg-white">
            <div className="bg-slate-900 p-6">
              <h1 className="text-4xl font-bold text-white">ฝากยอดขาย</h1>
              <h3 className="text-xl text-white">Deposit</h3>
            </div>

            <div className="mx-4 mt-4 flex h-[100px] items-center justify-between rounded-lg border border-black p-4">
              <p className="text-5xl font-extrabold">รวมยอดเงินที่นับได้</p>
              <p className="text-5xl font-extrabold">{`${cashIn.toLocaleString("en-US", { minimumFractionDigits: 2 })} ฿`}</p>
            </div>

            <div className="grid flex-1 grid-cols-5 overflow-y-auto">
              {changeMoney.map((item) => (
                <AddingDepositComponents
                  key={item.key}
                  item={item}
                  denomIn={item.cash}
                />
              ))}
            </div>

            <div className="flex-center absolute bottom-0 w-full gap-5 p-6">
              {["start", "finish", "error", "not-start"].includes(isReady) ? (
                <>
                  <div className="flex w-full justify-between gap-5">
                    <Button
                      className="flex h-[90px] w-1/3 items-center justify-center gap-2 border-2 border-blue-950 bg-white text-3xl text-blue-950 shadow-sm shadow-black hover:text-white"
                      onClick={onClickBackHome}
                      disabled={isOverlayVisible}
                    >
                      <CircleChevronLeft width={30} height={30} />
                      กลับหน้าหลัก
                    </Button>

                    {isReady === "start" && (
                      <Button
                        className="h-[90px] w-1/3 border-2 border-blue-950 bg-blue-800 text-3xl shadow-sm shadow-black"
                        onClick={() => handleStartDeposit()}
                      >
                        เริ่มฝากเงิน
                      </Button>
                    )}
                  </div>
                </>
              ) : isReady === "wip" && DepProcessData ? (
                <div className="flex w-full justify-between gap-5">
                  <p className="mb-10 grow text-center text-3xl">
                    กรุณาใส่เงินที่ต้องการฝาก แล้วกดปุ่มยืนยัน
                  </p>
                  <Button
                    className="h-[90px] w-1/3 border-2 border-blue-950 bg-slate-600 text-3xl shadow-sm shadow-black hover:text-white"
                    onClick={handleDepositEnd}
                  >
                    ยืนยัน
                  </Button>
                </div>
              ) : isReady === "finished" || isReady === "canceled" ? (
                <div className="flex w-full justify-center gap-5 p-7">
                  <Button
                    className="flex h-[90px] w-1/3 items-center justify-center gap-2 border-2 border-blue-950 bg-red-500 p-7 text-3xl shadow-sm shadow-black hover:text-white"
                    onClick={onClickBackHome}
                  >
                    <CircleChevronLeft width={30} height={30} />
                    กลับหน้าหลัก
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {isReady === "error" && (
        <DialogComponent
          isOpen={isOpen}
          isError={isError}
          massage={massage}
          onCloseCallback={handleDialogClose}
          headerFinish={headerFinish}
        />
      )}
    </div>
  );
}

export default PageDeposit;
