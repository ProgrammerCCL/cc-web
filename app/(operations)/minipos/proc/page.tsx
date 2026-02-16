"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { IDenomination, IMachineApiData } from "@/types/model";
import { DialogComponent } from "@/components/shared/container";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { updateCashDetails } from "@/lib/actions/transactionUpdate.actions";
import { cancelSale, getMachineSaleStatus } from "@/lib/actions/sale.actions";

function SaleProcessPage() {
  const router = useRouter();
  const { toast } = useToast();
  const calledRef = useRef(false);
  const search = useSearchParams();
  const [massage, setMassage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [saleProcessData, setSaleProcessData] =
    useState<IMachineApiData | null>(null);
  const [isError, setIsError] = useState(false);
  const [processID, setProcessID] = useState(-1);
  const [isReady, setIsReady] = useState("start");
  const [tranId, setTranId] = useState<string | null>(null);

  const handlerRefreshSaleStatus = async (saleId: number) => {
    try {
      const { success, data } = await getMachineSaleStatus(saleId);
      if (success && data) {
        setSaleProcessData(data);
      }
    } catch (err: any) {
      setIsReady("error");
      console.error("[ERROR] handlerRefreshSaleStatus Failed", err.message);
    }
  };

  const { cashIn, amount, change } = useMemo(() => {
    const cashIn = saleProcessData?.cashin || 0;
    const amount = saleProcessData?.amount || 0;
    const change = cashIn - amount;
    return { cashIn, amount, change };
  }, [saleProcessData]);

  /* API Cancelsale */
  const handleCancelSale = async () => {
    try {
      if (!saleProcessData) {
        return;
      }

      const { id } = saleProcessData;

      if (!id || !tranId) {
        return;
      }

      const result = await cancelSale({
        saleId: id,
        reqId: tranId,
        cancelRequest: true,
      });

      if (result.success) {
        // console.log("Sale canceled successfully.");
      } else {
        setIsReady("error");
        console.error("[ERROR] action cancelSale Failed", {
          result,
        });
        toast({
          title: "ยกเลิกการขายไม่สำเร็จ",
          description: "เกิดข้อผิดพลาด! กรุณาติดต่อเจ้าหน้าที่",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      setIsReady("error");
      console.error("[ERROR] action cancelSale Failed", err.message);
    }
  };

  // ฟังก์ชัน handlerUpdateCashDetails ที่รับ string
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
          setIsReady("finish");
        } else if (status === "cancel") {
          setIsReady("cancel");
        } else if (status === "error") {
          setIsReady("error");
        }
      } else {
        setIsReady("error");
        console.error("[ERROR] action updateCashDetails Failed", {
          updateSuccess,
        });
        toast({
          title: "บันทึกข้อมูลการขายไม่สำเร็จ",
          description: "เกิดข้อผิดพลาด! กรุณาติดต่อเจ้าหน้าที่",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      setIsReady("error");
      console.error("[ERROR] handlerUpdateCashDetails Failed", err.message);
    }
  };

  const handleDialogClose = async () => {
    setIsOpen(false);
  };

  /* eslint-disable */

  //get input cashin
  useEffect(() => {
    if (processID >= 0) {
      const intervalId = setInterval(() => {
        handlerRefreshSaleStatus(processID);
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [processID]);

  //การแปลงค่าid
  useEffect(() => {
    const wip = search.get("wip") || "";
    const transactionId = search.get("transactionId") || ""; // รับค่า transactionId จาก URL

    if (wip.length === 0 || transactionId.length === 0) {
      redirect("/404");
    }

    if (wip.length !== 0) {
      const wipNum = Number(wip);
      setProcessID(wipNum >= 0 ? wipNum : -1);
    }
    if (transactionId.length !== 0) {
      setTranId(transactionId);
    }
  }, [search]);

  useEffect(() => {
    if (calledRef.current) return;

    if (saleProcessData) {
      if (tranId === null) {
        return;
      }

      const SPDDenoms = saleProcessData.denom || [];

      const cashInData = SPDDenoms.filter(
        (item) => item.iscashin === "True"
      ).map((item) => item);

      const cashOutData = SPDDenoms.filter(
        (item) => item.iscashin === "False"
      ).map((item) => item);

      if (saleProcessData.status === "Finished") {
        calledRef.current = true;
        handlerUpdateCashDetails(
          tranId,
          cashInData,
          cashOutData,
          saleProcessData.amount,
          "finish"
        );
      } else if (saleProcessData.status === "ERROR") {
        calledRef.current = true;
        handlerUpdateCashDetails(
          tranId,
          cashInData,
          cashOutData,
          saleProcessData.amount,
          "error"
        );
      } else if (saleProcessData.status === "CANCELED") {
        calledRef.current = true;
        handlerUpdateCashDetails(
          tranId,
          cashInData,
          cashOutData,
          saleProcessData.amount,
          "cancel"
        );
      }
    }
  }, [saleProcessData, tranId]);

  useEffect(() => {
    if (isReady === "finish") {
      toast({
        title: "Sale Success",
        description: `ทำรายการขายสำเร็จ!`,
        variant: "success",
      });
      setTimeout(() => {
        router.push("/minipos");
      }, 3000);
    } else if (isReady === "cancel") {
      toast({
        title: "Cancel Sale Success",
        description: `ยกเลิกรายการขายสำเร็จ!`,
        variant: "success",
      });
      setTimeout(() => {
        router.push("/minipos");
      }, 3000);
    } else if (isReady === "ERROR") {
      setIsError(true);
      setMassage("เครื่องเกิดข้อผิดพลาด! กรุณาติดต่อเจ้าหน้าที่");
    }
  }, [isReady]);

  return (
    <div className="flex h-screen w-screen items-center justify-center gap-2">
      <div className="flex min-h-[550px] min-w-[450px] flex-col items-center justify-between gap-3 rounded-md border-2 border-slate-400 p-3 py-7">
        <h1 className="text-5xl font-bold">Mini POS</h1>
        <div className="flex w-5/6 flex-col gap-8 rounded-lg bg-gray-200 p-3 ">
          <div>
            <div className="flex justify-between px-4">
              <span className="text-xl font-bold">ยอดขาย</span>
              <span className="text-xl font-bold">
                {amount.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
          <div>
            <div className="flex justify-between px-4">
              <span className="text-xl font-bold">ยอดเงินที่รับ</span>
              <span className="text-xl font-bold">
                {cashIn.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
          {change > 0 ? (
            <div>
              <div className="flex justify-between px-4">
                <span className="text-xl font-bold">เงินทอน</span>
                <span className="text-xl font-bold">
                  {change.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          ) : change < 0 && cashIn > 0 ? (
            <div>
              <div className="flex justify-between px-4">
                <span className="text-xl font-bold">ขาดอีก</span>
                <span className="text-xl font-bold">
                  {Math.abs(change).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          ) : null}
        </div>
        {change > 0 && (
          <div className="flex justify-center mt-2">
            <span className="text-lg font-semibold text-green-500">
              กรุณารับเงินทอน
            </span>
          </div>
        )}
        <div className="flex justify-center">
          {cashIn <= 0 && (
            <Button
              type="button"
              variant="default"
              style={{ width: "350px", height: "60px", fontSize: "1.5rem" }}
              onClick={() => handleCancelSale()}
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
      {isReady === "ERROR" ? (
        <DialogComponent
          isOpen={isOpen}
          isError={isError}
          massage={massage}
          onCloseCallback={() => handleDialogClose()}
        />
      ) : null}
    </div>
  );
}
export default SaleProcessPage;
