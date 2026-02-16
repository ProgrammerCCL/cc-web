"use client";

import { TStatusPageCJ } from "@/types/share";
import { Button } from "@/components/ui/button";
import {
  updateCashDetailsWmCancelOrErr,
  updateCashDetailsWmSyncfail,
  updateCashDetailsWmSyncSucces,
} from "@/lib/world-market/actions/updateTransaction";
import { cancelSale } from "@/lib/actions/sale.actions";
import { getWIPv2ById } from "@/lib/actions/wip.actions";
import { IDenomination, IMachineApiData } from "@/types/model";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { sendValue } from "@/lib/world-market/actions/syncTansaction";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { LoadingDialogCJComponent } from "@/components/shared/loading/loading-dialog-CJ.component";

function SaleProcessPage() {
  const router = useRouter();
  const calledRef = useRef(false);
  const search = useSearchParams();
  const [isUser, setUser] = useState("");
  const [massage, setMassage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [saleProcessData, setSaleProcessData] =
    useState<IMachineApiData | null>(null);
  const [processID, setProcessID] = useState(-1);
  const [memberData, setMemberData] = useState("");
  const [saleAmount, setSaleAmount] = useState("0");
  const [tranId, setTranId] = useState<string | null>(null);
  const [isCancelClicked, setIsCancelClicked] = useState(false);
  const [isReady, setIsReady] = useState<TStatusPageCJ>("start");

  const handlerGetSaleStatus = async () => {
    try {
      if (!processID || processID === -1) return;

      const { success, data } = await getWIPv2ById({
        id: processID.toString(),
      });
      if (success && data) {
        setSaleProcessData(data);
      }
    } catch (err: any) {
      console.error("[ERROR] handlerGetSaleStatus Failed", err.message);
      setIsReady("error");
      setMassage(
        "ไม่สามารถตรวจสอบสถานะการทำงานของเครื่องได้! กรุณาติดต่อเจ้าหน้าที่"
      );
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
      if (!saleProcessData) return;

      const { id } = saleProcessData;

      if (!id || !tranId) return;

      setIsCancelClicked(true);

      const result = await cancelSale({
        saleId: id,
        reqId: tranId,
        cancelRequest: true,
      });

      if (result.success) {
        // console.log("Sale canceled successfully.");
      } else {
        console.error("[ERROR] handleCancelSale Failed");
        setIsReady("error");
        setMassage(
          `ไม่สามารถยกเลิกรายการขายได้ ${result.error}! กรุณาติดต่อเจ้าหน้าที่`
        );
      }
    } catch (err: any) {
      console.error("[ERROR] handleCancelSale Failed", err.message);
      setIsReady("error");
      setMassage("ไม่สามารถยกเลิกรายการขายได้! กรุณาติดต่อเจ้าหน้าที่");
    }
  };

  // ฟังก์ชัน handlerUpdateCashDetails ที่รับ string
  const handlerUpdateCashDetails = async (
    transactionId: string,
    cashIn: IDenomination[],
    cashOut: IDenomination[],
    status: "wip" | "finish" | "cancel" | "error"
  ) => {
    try {
      calledRef.current = true;
      const saleAmountNum = Number(saleAmount);

      if (saleAmountNum <= 0 || isNaN(saleAmountNum) || !memberData) {
        return;
      }

      if (status === "finish") {
        const { error, message, data, httpStatus } = await sendValue(
          memberData,
          saleAmountNum,
          isUser
        );

        if (!error) {
          // ถ้า error เป็น false (เรียก API สำเร็จ)
          const updateSuccess = await updateCashDetailsWmSyncSucces(
            transactionId,
            cashIn,
            cashOut,
            status,
            httpStatus,
            message,
            data
          );

          if (updateSuccess) {
            setIsReady("finished");
          } else {
            setIsReady("error");
            setMassage("ไม่สามารถบันทึกฐานข้อมูลได้! กรุณาติดต่อเจ้าหน้าที่");
            console.error("[ERROR] handlerUpdateCashDetails Failed", {
              transactionId,
              cashIn,
              cashOut,
              status,
              message,
              httpStatus,
              data,
            });
          }
        } else {
          const updateSuccess = await updateCashDetailsWmSyncfail(
            transactionId,
            cashIn,
            cashOut,
            status,
            httpStatus,
            message,
            data
          );

          if (updateSuccess) {
            if (status === "finish") {
              setIsReady("finished");
            } else if (status === "cancel") {
              setIsReady("canceled");
            } else if (status === "error") {
              setIsReady("error");
            }
          } else {
            setIsReady("error");
            setMassage("ไม่สามารถบันทึกฐานข้อมูลได้! กรุณาติดต่อเจ้าหน้าที่");
            console.error("[ERROR] handlerUpdateCashDetails Failed", {
              transactionId,
              cashIn,
              cashOut,
              status,
              message,
              httpStatus,
              data,
            });
          }
        }
      } else {
        const updateSuccess = await updateCashDetailsWmCancelOrErr(
          transactionId,
          cashIn,
          cashOut,
          status
        );

        if (updateSuccess) {
          if (status === "cancel") {
            setIsReady("canceled");
          } else if (status === "error") {
            setIsReady("error");
            setMassage("เครื่องทอนเงินขัดข้อง! กรุณาติดต่อเจ้าหน้าที่");
          }
        } else {
          setIsReady("error");
          setMassage("ไม่สามารถบันทึกฐานข้อมูลได้! กรุณาติดต่อเจ้าหน้าที่");
          console.error("[ERROR] updateCashDetailsWmCancelOrErr");
        }
      }
    } catch (err: any) {
      console.error("[ERROR] handlerUpdateCashDetails Failed", err.message);
      setIsReady("error");
      setMassage("ไม่สามารถบันทึกฐานข้อมูลได้! กรุณาติดต่อเจ้าหน้าที่");
    }
  };

  const handleDialogClose = async () => {
    router.push("/pos-wm");
  };

  /* eslint-disable */

  //get status Transaction
  useEffect(() => {
    if (processID >= 0 && calledRef.current === false) {
      const intervalId = setInterval(() => {
        handlerGetSaleStatus();
      }, 2000);

      return () => clearInterval(intervalId);
    }
  }, [processID]);

  //การแปลงค่าid
  useEffect(() => {
    const wip = search.get("wip") || "";
    const transactionId = search.get("transactionId") || "";
    const amount = search.get("amount") || "";
    const memberid = search.get("memberId") || "";
    const userId = search.get("userId") || "";

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
    if (amount.length !== 0 && !isNaN(Number(amount))) {
      setSaleAmount(amount);
    }
    if (memberid.length !== 0) {
      setMemberData(memberid);
    }
    if (userId.length !== 0) {
      setUser(userId);
    }
  }, [search]);

  //Update status Transaction
  useEffect(() => {
    if (tranId === null) return;
    if (calledRef.current) return;

    if (saleProcessData) {
      const SPDDenoms = saleProcessData.denom || [];

      const cashInData = SPDDenoms.filter(
        (item) => item.iscashin === "true"
      ).map((item) => item);

      const cashOutData = SPDDenoms.filter(
        (item) => item.iscashin === "false"
      ).map((item) => item);

      if (saleProcessData.status === "Finished") {
        calledRef.current = true;
        handlerUpdateCashDetails(tranId, cashInData, cashOutData, "finish");
      } else if (saleProcessData.status === "ERROR") {
        calledRef.current = true;
        setIsCancelClicked(true);
        handlerUpdateCashDetails(tranId, cashInData, cashOutData, "error");
      } else if (saleProcessData.status === "CANCELED") {
        calledRef.current = true;
        handlerUpdateCashDetails(tranId, cashInData, cashOutData, "cancel");
      }
    }
  }, [saleProcessData, tranId]);

  useEffect(() => {
    if (isReady === "finished") {
      setIsOpen(true);
      setMassage("ทำรายการจ่ายเงินสำเร็จ");
      setTimeout(() => {
        router.push("/pos-wm");
      }, 2000);
    } else if (isReady === "canceled") {
      setIsOpen(true);
      setMassage("ยกเลิกรายการจ่ายเงินสำเร็จ");
      setTimeout(() => {
        router.push("/pos-wm");
      }, 2000);
    } else if (isReady === "error") {
      setIsOpen(true);
    }
  }, [isReady]);

  return (
    <>
      <LoadingDialogCJComponent
        isOpen={isOpen}
        massage={massage}
        status={isReady}
        handleDialogClose={handleDialogClose}
      />

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
            {!isCancelClicked && cashIn <= 0 && (
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
      </div>
    </>
  );

  /* eslint-enable */
}
export default SaleProcessPage;
