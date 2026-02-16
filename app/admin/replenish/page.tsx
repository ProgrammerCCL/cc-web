"use client";

import {
  deleteTransaction,
  updateCashDetails,
} from "@/lib/actions/transactionUpdate.actions";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { useMachineContext } from "@/context";
import { useSession } from "next-auth/react";
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
import { endRefill, postRefill } from "@/lib/actions/replenish.actions";
import { AddingchangeComponents } from "@/components/backoffice/adding";
import { IBathItem, IDenomination, IMachineApiData } from "@/types/model";

const DISP_TEMPLATE = [...DEFAULT_REFILL_NOTE, ...DEFAULT_REFILL_COIN];

function AdminReplinishPage() {
  const router = useRouter();
  const { toast } = useToast();
  const calledRef = useRef(false);
  const { dismissAll } = useToast();
  const { data: session } = useSession();
  const [massage, setMassage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { machineUsed } = useMachineContext();
  const [isError, setIsError] = useState(false);
  const [isReady, setIsReady] = useState("start");
  const [isClient, setIsClient] = useState(false);
  const { disableAll, enableAll } = useSidebarContext();
  const [wipId, setWipId] = useState<number | null>(null);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [transId, setTransId] = useState<string | null>(null);
  const [refillMoney, setRefillMoney] = useState<IBathItem[]>([]);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [headerFinish, setHeaderFinish] = useState("เครื่องกำลังทำงาน");
  const [RepProcessData, setRepProcessData] = useState<IMachineApiData | null>(
    null
  );

  // step 1 : ตรวจสอบสถานะเงินในเครื่อง
  const checkInventory = async () => {
    try {
      setIsOpen(true);
      setHeaderFinish("กำลังตรวจสอบความพร้อมเครื่อง");
      setMassage("กรุณารอสักครู่");

      const { success, data, error, message } = await getInventory();

      setIsOpen(false);

      const stackers = data
        ? data.filter(
            (d) => typeof d.statusStacker === "number" && d.statusStacker <= 4
          )
        : [];

      if (success && stackers.length > 0) {
        // update display refill money
        const rMoney = [] as IBathItem[];
        for (const stack of stackers) {
          const template = DISP_TEMPLATE.find(
            (tp) => Number(tp.key) === Number(stack.value)
          );
          if (!template) {
            continue;
          }

          if (stack.inStacker > 0 || stack.refillPoint > 0) {
            rMoney.push({
              ...template,
              stock: stack.inStacker,
              cash: 0,
              needed: stack.refillPoint || 0,
            });
          }
        }

        setRefillMoney(rMoney);

        // update total stacker value
        setTotalValue(
          stackers.reduce((agg, st) => agg + st.value * st.inStacker, 0)
        );
      } else if (success && message) {
        setIsReady("not-start");
        console.error("[ERROR] action getInventory Failed", {
          success,
          message,
        });
        toast({
          title: "ไม่สามารถเติมเงินได้",
          description: message + ": กรุณาตรวจสอบสถานะกล่องเงิน",
          variant: "destructive",
        });
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

  // step 2 : เริ่มการเติมเงินทอน
  const handleStartRefill = async () => {
    if (!machineUsed) return;

    try {
      const machineId = machineUsed.id;

      if (!machineId) return;

      const dataResponde = await postRefill(machineId);

      if (dataResponde.success && dataResponde.wipId && dataResponde.id) {
        setWipId(dataResponde.wipId);
        setTransId(dataResponde.id);
        setIsReady("wip");
        setIsOverlayVisible(true);
        disableAll();
      } else {
        console.error("[ERROR] action postRefill Failed", { dataResponde });
        toast({
          title: "Create Refill Error",
          description:
            "ไม่สามารถเติมเงินได้! กรุณาตรวจสอบความพร้อมเครื่อง หรือติดต่อเจ้าหน้าที่",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      setIsReady("error");
      setMassage("เริ่มทำรายการเติมเงินทอน ผิดพลาด !!");
      console.error("[ERROR] handleStartRefill Failed", err.message);
    }
  };

  // step 3 : ตรวจสอบสถานะรายการ
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleGetRefillStatus = async () => {
    try {
      if (!wipId) return;

      const { success, data, error } = await getWIPv2ById({
        id: wipId.toString(),
      });

      if (success && data) {
        const denoms: IDenomination[] =
          typeof data.denom === "string" ? JSON.parse(data.denom) : data.denom;
        const dataToSet = { ...data, denom: denoms };

        setRefillMoney((prev) => {
          const updatedRMoney = [...prev];

          dataToSet.denom.forEach((denom) => {
            const existingIndex = updatedRMoney.findIndex(
              (rMoney) => Number(rMoney.key) === Number(denom.denom)
            );

            if (existingIndex >= 0) {
              // ถ้าพบ ก็อัปเดตค่า cash
              updatedRMoney[existingIndex] = {
                ...updatedRMoney[existingIndex],
                cash: Number(denom.qty),
              };
            } else {
              // ถ้าไม่พบ ก็สร้างข้อมูลใหม่
              const template = DISP_TEMPLATE.find(
                (tp) => Number(tp.key) === Number(denom.denom)
              );
              if (template) {
                updatedRMoney.push({
                  ...template,
                  stock: 0,
                  cash: Number(denom.qty),
                  needed: 0,
                });
              }
            }
          });

          updatedRMoney.sort((a, b) => {
            return Number(b.key) - Number(a.key);
          });

          return updatedRMoney;
        });
        setRepProcessData(data);
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

  // step 4 : ยืนยันการเติมเงินทอน
  const handleRefillEnd = async () => {
    if (!RepProcessData) return;
    try {
      const procId = RepProcessData.id;
      const refillSuccess = await endRefill(procId);

      if (refillSuccess) {
        setIsReady("end");
      } else {
        setIsReady("error");
        setMassage("การตรวจสอบสถานะการทำรายการผิดพลาด !!");
        console.error("[ERROR] action endRefill Failed", { refillSuccess });
      }
    } catch (err: any) {
      setIsReady("error");
      setMassage("ยืนยันข้อมูลการทำรายการเติมเงินทอนผิดพลาด !!");
      console.error("[ERROR] handleRefillEnd Failed", err.message);
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
            description: `ทำรายการขายสำเร็จ!`,
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
      console.error("[ERROR] handleDeleteTransaction Failed", err.message);
    }
  };

  // ตรวจสอบข้อมูลจำนวนเงินที่ฝาก ป้องกันข้อมูลผิดพลาด
  const { cashIn } = useMemo(() => {
    try {
      const cashIn = RepProcessData?.cashin || 0;
      return { cashIn };
    } catch (err: any) {
      setIsReady("error");
      setMassage("การตรวจสอบจำนวนเงินที่ฝากผิดพลาด !!");
      console.error("[ERROR] handlerFinishRefill Failed", err.message);
      return { cashIn: 0 };
    }
  }, [RepProcessData]);

  // กดปิด Dialog กรณีเกิด Error
  const handleDialogClose = async () => {
    setIsOpen(false);
    dismissAll();
    enableAll();
  };

  // กดกลับหน้าหลัก
  const onClickBackHome = async () => {
    dismissAll();
    router.push("/admin");
  };

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
          handleGetRefillStatus();
        }, 3000);

        return () => clearInterval(intervalId);
      } else {
        console.warn("[WARN] wipId is not a number:", wipId);
      }
    }
  }, [isReady, wipId, handleGetRefillStatus]);

  useEffect(() => {
    if (calledRef.current) return;
    if (RepProcessData) {
      if (!transId) return;
      const SPDDenoms = RepProcessData.denom || [];

      const cashInData = SPDDenoms.filter(
        (item) => item.iscashin === "True"
      ).map((item) => item);

      const cashOutData = SPDDenoms.filter(
        (item) => item.iscashin === "False"
      ).map((item) => item);

      if (RepProcessData.status === "Finished") {
        calledRef.current = true;
        if (RepProcessData.amount > 0) {
          handlerUpdateCashDetails(
            transId,
            cashInData,
            cashOutData,
            RepProcessData.amount,
            "finish"
          );
        } else {
          handleDeleteTransaction(transId);
        }
      } else if (RepProcessData.status === "ERROR") {
        calledRef.current = true;
        handlerUpdateCashDetails(
          transId,
          cashInData,
          cashOutData,
          RepProcessData.amount,
          "error"
        );
      }
    }
  }, [RepProcessData, transId]);

  useEffect(() => {
    if (isReady === "finished") {
      enableAll();
    } else if (isReady === "canceled") {
      enableAll();
    } else if (isReady === "error") {
      setIsOpen(true);
      setIsError(true);
      setHeaderFinish("กรุณาติดต่อเจ้าหน้าที่ Error !! ");
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

      <div className="relative h-screen w-screen shrink-0 overflow-hidden bg-slate-200 pb-20 pr-16">
        <div className="flex size-full border-b-indigo-200 p-2">
          {/* Left Side Adding Change */}
          <div className="custom-scrollbar grid w-3/5 grid-cols-3 content-start gap-2 overflow-y-auto bg-slate-200">
            {refillMoney.map((item) => {
              return (
                <div key={item.key} className="h-[250px]">
                  <AddingchangeComponents item={item} />
                </div>
              );
            })}
          </div>

          {/* Right Side Summary */}
          <div className="relative ml-1 size-full w-1/3 flex-1 overflow-hidden rounded-lg bg-white ">
            <div className="bg-slate-900 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold text-white">เติมเงินทอน</h1>
                  <h3 className="text-xl text-white">
                    Adding money for change
                  </h3>
                </div>
              </div>
            </div>

            <div className="m-5">
              <Card className="flex h-[170px] justify-between border-black bg-white p-5 shadow-md">
                <div className="bg-white">
                  <Image
                    src="/assets/images/money_total.png"
                    alt="Cash in icon"
                    width={65}
                    height={55}
                    className="hidden object-cover lg:block"
                  />
                </div>
                <div className="flex w-full flex-col md:w-auto">
                  <p className="m-2 text-center text-2xl font-extrabold text-black md:text-left xl:text-4xl">
                    เงินทอนคงเหลือ (บาท)
                  </p>
                  <p className="mt-3 break-words text-center text-2xl font-medium text-black md:text-right md:text-5xl 900px:text-4xl">
                    {totalValue.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </Card>
            </div>

            <div className="m-5">
              <Card className="flex h-[170px] justify-between border-black bg-white p-5 shadow-md">
                <div className="bg-white">
                  <Image
                    src="/assets/images/money_in.png"
                    alt="Cash in icon"
                    width={65}
                    height={55}
                    className="hidden object-cover lg:block"
                  />
                </div>
                <div>
                  <p className="m-2 text-center text-2xl font-extrabold text-black md:text-left xl:text-4xl">
                    เงินทอนเติมเพิ่ม (บาท)
                  </p>
                  <p className="mt-9 text-end text-5xl font-medium text-black">
                    {cashIn.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </Card>
            </div>

            <div className="flex-center absolute bottom-0 w-full gap-5 p-6">
              {isReady === "start" ||
              isReady === "error" ||
              isReady === "not-start" ? (
                <React.Fragment>
                  <Button
                    className="flex h-[75px] w-full items-center justify-center gap-2 border-2 border-blue-950 bg-white text-2xl text-blue-950 shadow-sm shadow-black hover:text-white"
                    onClick={onClickBackHome}
                    disabled={isOverlayVisible}
                  >
                    <CircleChevronLeft width={30} height={30} />
                    กลับหน้าหลัก
                  </Button>

                  {isReady === "start" ? (
                    <Button
                      className="h-[75px] w-full border-2 border-blue-950 bg-blue-800 text-2xl shadow-sm shadow-black"
                      onClick={() => handleStartRefill()}
                      disabled={refillMoney.length === 0}
                    >
                      เริ่มเติ่มเงิน
                    </Button>
                  ) : null}
                </React.Fragment>
              ) : isReady === "wip" && RepProcessData ? (
                <div className="w-full">
                  <p className="mb-10  text-center text-3xl">
                    กรุณาเติมเงินทอน แล้วกดปุ่มยืนยัน
                  </p>{" "}
                  <Button
                    className="h-[85px] w-full gap-2 border-2 border-blue-950 bg-slate-600 text-2xl shadow-md hover:text-white"
                    onClick={() => handleRefillEnd()}
                  >
                    ยืนยัน
                  </Button>
                </div>
              ) : isReady === "finished" || isReady === "canceled" ? (
                <div className="flex-center absolute bottom-0 w-full gap-5 p-7">
                  <Button
                    className="flex h-[85px] w-full items-center justify-center gap-2 border-2 border-blue-950 bg-red-500 p-7 text-2xl shadow-sm hover:text-white"
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

      {isReady === "error" ? (
        <DialogComponent
          isOpen={isOpen}
          isError={isError}
          massage={massage}
          onCloseCallback={handleDialogClose}
          headerFinish={headerFinish}
        />
      ) : null}
    </div>
  );
}

export default AdminReplinishPage;
