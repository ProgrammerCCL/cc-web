"use client";

import {
  useMachineContext,
  useSidebarContext,
  useRemoveCasseteContext,
} from "@/context";
import {
  CI05REM,
  CI10REM,
  CI10XREM,
  CI50REM,
} from "@/components/removeCassete";
import {
  createFinishRemoveCassete,
  createRemoveCassete,
  createRemoveUnlockCasset,
} from "@/lib/actions/removeCassete.action";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { redirect, useRouter } from "next/navigation";
import { getWIPv2ById } from "@/lib/actions/wip.actions";
import React, { useEffect, useRef, useState } from "react";
import { IDenomination, IMachineApiData } from "@/types/model";
import { getInventory } from "@/lib/actions/inventory.actions";
import { DialogComponent } from "@/components/shared/container";
import { updateCashDetails } from "@/lib/actions/transactionUpdate.actions";

function RemoveCaseetePage() {
  const router = useRouter();
  const { toast } = useToast();
  const calledRef = useRef(false);
  const { dismissAll } = useToast();
  const { data: session } = useSession();
  const [massage, setMassage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { machineUsed } = useMachineContext();
  const [isError, setIsError] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [cassetAmount, setCassetAmount] = useState(0);
  const { disableAll, enableAll } = useSidebarContext();
  const { setStatusMachine } = useRemoveCasseteContext();
  const [RemoveReady, setRemoveReady] = useState("start");
  const [wipId, setWipId] = useState<number | null>(null);
  const [transId, setTransId] = useState<string | null>(null);
  const [headerFinish, setHeaderFinish] = useState("เครื่องกำลังทำงาน");
  const [RemProcessData, setRemProcessData] = useState<IMachineApiData | null>(
    null
  );

  const [cassetData, setCassetData] = useState<
    Array<{ denom: string; qty: number }>
  >([]);

  // step 1 : ตรวจสอบสถานะเงินในเครื่อง
  const checkInventory = async () => {
    try {
      setIsOpen(true);
      setHeaderFinish("กำลังตรวจสอบความพร้อมเครื่อง");
      setMassage("กรุณารอสักครู่");

      const { success, data, error } = await getInventory();

      setIsOpen(false);

      if (success && data && data.length > 0) {
        const formattedDataCasset = data.map((item: any) => ({
          denom: Number(item.denom) || 0,
          qty: Number(item.inCassette) || 0,
        }));

        setCassetData(
          formattedDataCasset.map((item) => ({
            denom: item.denom.toFixed(2),
            qty: item.qty,
          }))
        );
        const totalCasset = formattedDataCasset.reduce((total, item) => {
          return total + item.denom * item.qty;
        }, 0);
        setCassetAmount(totalCasset);
      } else if (error) {
        setRemoveReady("error");
        console.error("[ERROR] action getInventory Failed", {
          success,
          error,
        });
        toast({
          title: "ไม่สามารถตรวจสอบสถานะเงินได้",
          description: error || "ตรวจสอบสถานะเงินไม่สำเร็จ",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      setRemoveReady("error");
      setMassage("การตรวจสอบสถานะเงินในเครื่องผิดพลาด !!");
      console.error("[ERROR] checkInventory Fial", err.message);
    }
  };

  // step 2 : เริ่มการนำเงินออกจากกล่องเ
  const handleStartRemoveCassete = async () => {
    if (!machineUsed) return;

    const cassetAmountNum = Number(cassetAmount);
    const machineId = machineUsed.id;

    try {
      if (!machineId) return;

      // ฟอร์แมตข้อมูล denom ที่ qty > 0
      const formattedDenomCasset = cassetData
        .filter((item) => Number(item.qty) > 0)
        .map((item) => ({
          denom: item.denom,
          qty: Number(item.qty),
        }));

      if (formattedDenomCasset.length === 0) {
        toast({
          title: "Cannot Remove Cassete.",
          description: "ไม่มีเงินในกล่องยอดขาย",
          variant: "destructive",
        });
        return;
      }

      if (formattedDenomCasset.length > 0) {
        const { success, wipId, id, error } = await createRemoveCassete(
          {
            machineId,
          },
          cassetAmountNum
        );

        if (success && wipId && id) {
          setTransId(id);
          setWipId(wipId);
          setRemoveReady("wip");
          setStatusMachine("remove");
          disableAll();
        } else {
          toast({
            title: "ไม่สามารถนำกล่องเงินออกได้",
            description: "กรุณาติดต่อเจ้าหน้าที่ : " + error,
            variant: "destructive",
          });
        }
      }
    } catch (err: any) {
      console.error("[ERROR] handleStartRemoveCassete Failed", err.message);
      setRemoveReady("error");
    }
  };

  // step 3 : ตรวจสอบสถานะรายการ
  const handleGetCollectStatus = async () => {
    try {
      if (!wipId) return;

      const { success, data } = await getWIPv2ById({ id: wipId.toString() });

      if (success && data) {
        setRemProcessData(data);
      } else {
        setRemoveReady("error");
        setMassage("การตรวจสอบสถานะการทำรายการผิดพลาด !!");
        console.error("[ERROR] action getWIPv2ById Failed", { success, data });
      }
    } catch (err: any) {
      setRemoveReady("error");
      setMassage("การตรวจสอบสถานะการทำรายการผิดพลาด !!");
      console.error("[ERROR] handleGetCollectStatus Failed", err.message);
    }
  };

  // step 4 : ปลดล๊อคกล่อง เหรียญหรือธนบัตร
  const handlerUnlockCasset = async (
    state: "coin" | "note" // ระบุประเภทของ state
  ) => {
    try {
      if (wipId !== null) {
        const UnlockCassetSuccess = await createRemoveUnlockCasset(wipId, {
          mc: state,
        });

        if (!UnlockCassetSuccess.success) {
          setRemoveReady("error");
          setMassage("สั่งปลดล๊อคกล่องเงินไม่ได้ เกิดข้อผิดพลาด !! :" + state);
          console.error("[ERROR] action createUnlockCasset Failed", {
            state,
            UnlockCassetSuccess,
          });
        }
      } else {
        setRemoveReady("error");
        setMassage("ไม่มีข้อมูลเลขรายการที่ต้องการสั่งปลดล๊อค :" + state);
        console.error("[ERROR] handlerUnlockCasset Failed wipId null");
      }
    } catch (err: any) {
      setRemoveReady("error");
      setMassage("สั่งปลดล๊อคกล่องเงินไม่ได้ เกิดข้อผิดพลาด !!");
      console.error("[ERROR] handlerUnlockCasset Failed", err.message);
    }
  };

  // step 5 :endpoint FinishRemoveCassete
  const handleFetchFinish = () => {
    setStatusMachine("fetchFinish");
  };
  const handleFinishRemoveCassete = async () => {
    try {
      if (wipId === null) {
        console.error("wipId is null, cannot proceed.");
        return;
      }
      const response = await createFinishRemoveCassete(wipId);

      if (response.success) {
        setRemoveReady("finished");
      } else {
        setRemoveReady("error");
        setMassage("สั่งจบรายการนำเงินออกไม่ได้ เกิดข้อผิดพลาด !!");
        console.error(
          "Error action createFinishRemoveCassete Failed :",
          response.error
        );
      }
    } catch (err: any) {
      setRemoveReady("error");
      setMassage("สั่งจบรายการนำเงินออกไม่ได้ เกิดข้อผิดพลาด !!");
      console.error("[ERROR] handleFinishRemoveCassete Failed", err.message);
    }
  };

  // step 6 : อัพเดทฐานข้อมูล PG
  const handlerUpdateCashDetails = async (
    transactionId: string,
    cashIn: IDenomination[],
    cashOut: IDenomination[],
    amount: number,
    status: "wip" | "finish" | "cancel" | "error"
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
        if (status === "finish" || status === "cancel") {
          setRemoveReady("success");
          setStatusMachine("success");
        } else if (status === "error") {
          setRemoveReady("error");
          setMassage("เครื่องทอนเงินขัดข้อง !!");
          console.error("[ERROR] status Machine Error");
        }
      } else {
        setRemoveReady("error");
        setMassage("บันทึกข้อมูลการทำรายการนำเงินออก ผิดพลาด !!");
        console.error("[ERROR] action updateCashDetails Failed", {
          updateSuccess,
        });
      }
    } catch (err: any) {
      setRemoveReady("error");
      setMassage("บันทึกข้อมูลการทำรายการนำเงินออก ผิดพลาด !!");
      console.error("[ERROR] Update DB Backoffice Postgre Fail", err.message);
    }
  };

  // กดปิด Dialog กรณีเกิด Error
  const handleDialogClose = async () => {
    setIsOpen(false);
    dismissAll();
    enableAll();
  };

  // กดกลับหน้าหลัก
  const onClickBackHome = () => {
    dismissAll();
    router.push("/admin");
  };

  /* eslint-disable */
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && session) {
      if (!session.user.permissions.includes("COLLECT_MONEY")) {
        redirect("/admin");
      }

      if (!machineUsed) {
        redirect("/operation");
      }

      checkInventory();
    }
  }, [isClient, session, machineUsed]);

  useEffect(() => {
    if (RemoveReady === "wip" || RemoveReady === "finished") {
      if (typeof wipId === "number") {
        const intervalId = setInterval(() => {
          handleGetCollectStatus();
        }, 1000);

        return () => clearInterval(intervalId);
      }
    }
  }, [RemoveReady, wipId]);

  useEffect(() => {
    if (calledRef.current) return;

    if (RemProcessData) {
      if (!transId) {
        return;
      }

      const SPDDenoms = RemProcessData.denom || [];

      const cashInData = SPDDenoms.filter(
        (item) => item.iscashin === "True"
      ).map((item) => item);

      const cashOutData = SPDDenoms.filter(
        (item) => item.iscashin === "False"
      ).map((item) => item);

      if (RemProcessData.status === "Finished") {
        calledRef.current = true;
        handlerUpdateCashDetails(
          transId,
          cashInData,
          cashOutData,
          RemProcessData.amount,
          "finish"
        );
      } else if (RemProcessData.status === "ERROR") {
        calledRef.current = true;
        handlerUpdateCashDetails(
          transId,
          cashInData,
          cashOutData,
          RemProcessData.amount,
          "error"
        );
      }
    }
  }, [RemProcessData, transId]);

  useEffect(() => {
    if (RemoveReady === "success") {
      toast({
        title: "Remove Cassette Success",
        description: `นำเงินออกสำเร็จ กรุณารับใบเสร็จ`,
        variant: "success",
      });
      enableAll();
    } else if (RemoveReady === "error") {
      setIsOpen(true);
      setIsError(true);
      setHeaderFinish("กรุณาติดต่อเจ้าหน้าที่ Error !! ");
      enableAll();
    }
  }, [RemoveReady]);
  /* eslint-enable */

  return (
    <div>
      <DialogComponent
        isOpen={isOpen}
        massage={massage}
        isError={isError}
        headerFinish={headerFinish}
      />
      <>
        {machineUsed?.model === "CI-05B" ? (
          <CI05REM
            wipId={wipId}
            transId={transId}
            setIsOpen={setIsOpen}
            setIsError={setIsError}
            setMassage={setMassage}
            RemProcessData={RemProcessData}
            setRemoveReady={setRemoveReady}
            onClickBackHome={onClickBackHome}
            handleFetchFinish={handleFetchFinish}
            handlerUnlockCasset={handlerUnlockCasset}
            handleStartRemoveCassete={handleStartRemoveCassete}
            handleFinishRemoveCassete={handleFinishRemoveCassete}
          />
        ) : null}

        {machineUsed?.model === "CI-10B" ? (
          <CI10REM
            wipId={wipId}
            transId={transId}
            setIsOpen={setIsOpen}
            setIsError={setIsError}
            setMassage={setMassage}
            RemProcessData={RemProcessData}
            setRemoveReady={setRemoveReady}
            onClickBackHome={onClickBackHome}
            handleFetchFinish={handleFetchFinish}
            handlerUnlockCasset={handlerUnlockCasset}
            handleStartRemoveCassete={handleStartRemoveCassete}
            handleFinishRemoveCassete={handleFinishRemoveCassete}
          />
        ) : null}

        {machineUsed?.model === "CI-10BX" ? (
          <CI10XREM
            wipId={wipId}
            transId={transId}
            setIsOpen={setIsOpen}
            setIsError={setIsError}
            setMassage={setMassage}
            RemProcessData={RemProcessData}
            setRemoveReady={setRemoveReady}
            onClickBackHome={onClickBackHome}
            handleFetchFinish={handleFetchFinish}
            handlerUnlockCasset={handlerUnlockCasset}
            handleStartRemoveCassete={handleStartRemoveCassete}
            handleFinishRemoveCassete={handleFinishRemoveCassete}
          />
        ) : null}

        {machineUsed?.model === "CI-50X" ? (
          <CI50REM
            wipId={wipId}
            transId={transId}
            setIsOpen={setIsOpen}
            setIsError={setIsError}
            setMassage={setMassage}
            RemProcessData={RemProcessData}
            setRemoveReady={setRemoveReady}
            onClickBackHome={onClickBackHome}
            handleFetchFinish={handleFetchFinish}
            handlerUnlockCasset={handlerUnlockCasset}
            handleStartRemoveCassete={handleStartRemoveCassete}
            handleFinishRemoveCassete={handleFinishRemoveCassete}
          />
        ) : null}
      </>
      {RemoveReady === "error" ? (
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

export default RemoveCaseetePage;
