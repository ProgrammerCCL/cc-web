"use client";

import { useMachineContext } from "@/context";
import { CircleChevronLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { getInventory } from "@/lib/actions/inventory.actions";
import { IInventoryItem, IMachineApiData } from "@/types/model";
import { checkRemoveMcStatus } from "@/lib/utils/removeCassete";
import { useRemoveCasseteContext } from "@/context/removeCassete.context";
import { TMcStateRemoveCI10, STATUS_MSG_CI10 } from "@/constants/removeCassete";

interface ICI10REMProps {
  wipId: number | null;
  transId: string | null;
  onClickBackHome: () => void;
  handleFetchFinish: () => void;
  setMassage: (s: string) => void;
  setIsOpen: (b: boolean) => void;
  setIsError: (b: boolean) => void;
  setRemoveReady: (s: string) => void;
  handleStartRemoveCassete: () => void;
  handleFinishRemoveCassete: () => void;
  RemProcessData: IMachineApiData | null;
  handlerUnlockCasset: (mc: "coin" | "note") => void;
}

export const CI10REM = (props: ICI10REMProps) => {
  const {
    wipId,
    transId,
    setIsOpen,
    setIsError,
    setMassage,
    RemProcessData,
    setRemoveReady,
    onClickBackHome,
    handleFetchFinish,
    handlerUnlockCasset,
    handleStartRemoveCassete,
    handleFinishRemoveCassete,
  } = props;

  const { machineUsed } = useMachineContext();
  const [isRemoveCoin, setIsRemoveCoin] = useState(false);
  const [isRemoveNote, setIsRemoveNote] = useState(false);
  const { statusMachine, setStatusMachine } = useRemoveCasseteContext();

  const handleInventoryCheckCoin = async () => {
    try {
      if (!machineUsed) return;

      const posId = machineUsed.allowPosIp;
      const machineId = machineUsed.id;

      if (!posId || !machineId || !transId || !wipId) return;

      const { success, data } = await getInventory();

      if (success && data && data.length > 0) {
        const inventoryCasset = data.reduce(
          (agg, item: IInventoryItem) => {
            const dVal = item.value;
            const inventoryinCasset = item.inCassette || 0;
            if (dVal < 20 && inventoryinCasset > 0) {
              return [...agg, { denom: item.denom, qty: item.inCassette }];
            }
            return agg;
          },
          [] as { denom: string; qty: number }[]
        );
        if (inventoryCasset.length > 0) {
          setStatusMachine("CoinIncasset");
        } else {
          setStatusMachine("CoinSuccess");
          setIsRemoveCoin(true);
        }
      } else {
        setIsOpen(true);
        setRemoveReady("ERROR");
        setIsError(true);
        setMassage(
          "ไม่สามารถตรวจสอบสถานะเหรียญในเครื่องได้! กรุณาติดต่อเจ้าหน้าที่"
        );
      }
    } catch (err: any) {
      console.error("[ERROR] handleInventoryCheck Failed", err.message);
      setIsOpen(true);
      setRemoveReady("ERROR");
      setIsError(true);
      setMassage(
        "ไม่สามารถตรวจสอบสถานะเหรียญในเครื่องได้! กรุณาติดต่อเจ้าหน้าที่ (handleInventoryCheck)"
      );
    }
  };

  const handleInventoryCheckNote = async () => {
    try {
      if (!machineUsed) {
        return;
      }
      const posId = machineUsed.allowPosIp;
      const machineId = machineUsed.id;

      if (!posId || !machineId || !transId || !wipId) {
        return;
      }

      const { success, data } = await getInventory();

      if (success && data && data.length > 0) {
        const inventoryCasset = data.reduce(
          (agg, item: IInventoryItem) => {
            const dVal = item.value;
            const inventoryinCasset = item.inCassette || 0;
            if (dVal > 10 && inventoryinCasset > 0) {
              return [...agg, { denom: item.denom, qty: item.inCassette }];
            }
            return agg;
          },
          [] as { denom: string; qty: number }[]
        );

        if (inventoryCasset.length > 0) {
          setStatusMachine("NoteIncasset");
        } else {
          setStatusMachine("Note7");
          setIsRemoveNote(true);
        }
      } else {
        setIsOpen(true);
        setRemoveReady("ERROR");
        setIsError(true);
        setMassage(
          "ไม่สามารถตรวจสอบสถานะเหรียญในเครื่องได้! กรุณาติดต่อเจ้าหน้าที่"
        );
      }
    } catch (err: any) {
      console.error("[ERROR] handleInventoryCheck Failed", err.message);
      setIsOpen(true);
      setRemoveReady("ERROR");
      setIsError(true);
      setMassage(
        "ไม่สามารถตรวจสอบสถานะเหรียญในเครื่องได้! กรุณาติดต่อเจ้าหน้าที่ (handleInventoryCheck)"
      );
    }
  };

  /* eslint-disable */
  // สถานะเครื่องกำหนดลำดับการทำงาน
  useEffect(() => {
    if (RemProcessData) {
      if (transId === null) {
        return;
      }

      if (
        checkRemoveMcStatus({
          model: machineUsed?.model || "",
          state: statusMachine as TMcStateRemoveCI10,
          coinStatus: RemProcessData.statusCoin || "",
          noteStatus: RemProcessData.statusNote || "",
        }) &&
        statusMachine === "remove"
      ) {
        const { statusNote, statusCoin } = RemProcessData;
        if (statusNote || statusCoin) {
          if ("WaitForOpening COLLECTION DOOR" === statusNote) {
            setStatusMachine("Note1");
          } else if ("WaitForRemoving COFB" === statusCoin) {
            setStatusMachine("Coin1");
          }
        }
      } else if (
        checkRemoveMcStatus({
          model: machineUsed?.model || "",
          state: statusMachine as TMcStateRemoveCI10,
          coinStatus: RemProcessData.statusCoin || "",
          noteStatus: RemProcessData.statusNote || "",
        }) &&
        statusMachine === "Coin1"
      ) {
        setStatusMachine("Coin2");
      } else if (
        checkRemoveMcStatus({
          model: machineUsed?.model || "",
          state: statusMachine as TMcStateRemoveCI10,
          coinStatus: RemProcessData.statusCoin || "",
          noteStatus: RemProcessData.statusNote || "",
        }) &&
        statusMachine === "Coin2"
      ) {
        setStatusMachine("Coin3");
      } else if (
        checkRemoveMcStatus({
          model: machineUsed?.model || "",
          state: statusMachine as TMcStateRemoveCI10,
          coinStatus: RemProcessData.statusCoin || "",
          noteStatus: RemProcessData.statusNote || "",
        }) &&
        statusMachine === "Coin3"
      ) {
        setStatusMachine("CheckCoin");
        setTimeout(() => {
          handleInventoryCheckCoin();
        }, 3000);
      }

      //กรณีนำเหรียญออกไม่หมด
      else if (
        checkRemoveMcStatus({
          model: machineUsed?.model || "",
          state: statusMachine as TMcStateRemoveCI10,
          coinStatus: RemProcessData.statusCoin || "",
          noteStatus: RemProcessData.statusNote || "",
        }) &&
        statusMachine === "CoinIncasset"
      ) {
        setStatusMachine("CoinIncasset1");
      } else if (
        checkRemoveMcStatus({
          model: machineUsed?.model || "",
          state: statusMachine as TMcStateRemoveCI10,
          coinStatus: RemProcessData.statusCoin || "",
          noteStatus: RemProcessData.statusNote || "",
        }) &&
        statusMachine === "CoinIncasset1"
      ) {
        setStatusMachine("CoinIncasset2");
      } else if (
        checkRemoveMcStatus({
          model: machineUsed?.model || "",
          state: statusMachine as TMcStateRemoveCI10,
          coinStatus: RemProcessData.statusCoin || "",
          noteStatus: RemProcessData.statusNote || "",
        }) &&
        statusMachine === "CoinIncasset2"
      ) {
        setStatusMachine("CheckCoin");
        setTimeout(() => {
          handleInventoryCheckCoin();
        }, 3000);
      } else if (
        checkRemoveMcStatus({
          model: machineUsed?.model || "",
          state: statusMachine as TMcStateRemoveCI10,
          coinStatus: RemProcessData.statusCoin || "",
          noteStatus: RemProcessData.statusNote || "",
        }) &&
        statusMachine === "CoinSuccess"
      ) {
        const { statusNote } = RemProcessData;
        if (statusNote) {
          if ("WaitForOpening COLLECTION DOOR" === statusNote) {
            setStatusMachine("Note1");
          }
        }
      } else if (
        checkRemoveMcStatus({
          model: machineUsed?.model || "",
          state: statusMachine as TMcStateRemoveCI10,
          coinStatus: RemProcessData.statusCoin || "",
          noteStatus: RemProcessData.statusNote || "",
        }) &&
        statusMachine === "NoteSuccess"
      ) {
        const { statusCoin } = RemProcessData;
        if (statusCoin) {
          if ("WaitForRemoving COFB" === statusCoin) {
            setStatusMachine("Coin1");
          }
        }
      }

      //Note
      else if (
        checkRemoveMcStatus({
          model: machineUsed?.model || "",
          state: statusMachine as TMcStateRemoveCI10,
          coinStatus: RemProcessData.statusCoin || "",
          noteStatus: RemProcessData.statusNote || "",
        }) &&
        statusMachine === "Note1"
      ) {
        setStatusMachine("Note2");
      } else if (
        checkRemoveMcStatus({
          model: machineUsed?.model || "",
          state: statusMachine as TMcStateRemoveCI10,
          coinStatus: RemProcessData.statusCoin || "",
          noteStatus: RemProcessData.statusNote || "",
        }) &&
        statusMachine === "Note2"
      ) {
        setStatusMachine("Note3");
      } else if (
        checkRemoveMcStatus({
          model: machineUsed?.model || "",
          state: statusMachine as TMcStateRemoveCI10,
          coinStatus: RemProcessData.statusCoin || "",
          noteStatus: RemProcessData.statusNote || "",
        }) &&
        statusMachine === "Note3"
      ) {
        setStatusMachine("Note4");
      } else if (
        checkRemoveMcStatus({
          model: machineUsed?.model || "",
          state: statusMachine as TMcStateRemoveCI10,
          coinStatus: RemProcessData.statusCoin || "",
          noteStatus: RemProcessData.statusNote || "",
        }) &&
        statusMachine === "Note4"
      ) {
        setStatusMachine("Note5");
      } else if (statusMachine === "Note5") {
        setTimeout(() => {
          setStatusMachine("Note6");
        }, 1500);
      } else if (
        checkRemoveMcStatus({
          model: machineUsed?.model || "",
          state: statusMachine as TMcStateRemoveCI10,
          coinStatus: RemProcessData.statusCoin || "",
          noteStatus: RemProcessData.statusNote || "",
        }) &&
        statusMachine === "Note6"
      ) {
        const { statusNote } = RemProcessData;
        if (statusNote) {
          if ("StatusChange STATUS_IDLE" === statusNote) {
            setStatusMachine("CheckNote");
            setTimeout(() => {
              handleInventoryCheckNote();
            }, 3000);
          } else if ("WaitForInsertion COLLECTION_BOX" === statusNote) {
            setStatusMachine("NotCasset");
          }
        }
      } else if (
        checkRemoveMcStatus({
          model: machineUsed?.model || "",
          state: statusMachine as TMcStateRemoveCI10,
          coinStatus: RemProcessData.statusCoin || "",
          noteStatus: RemProcessData.statusNote || "",
        }) &&
        statusMachine === "Note7"
      ) {
        setStatusMachine("NoteSuccess");
      }

      // กรณีนำธนบัตรออกไม่หมด
      else if (
        checkRemoveMcStatus({
          model: machineUsed?.model || "",
          state: statusMachine as TMcStateRemoveCI10,
          coinStatus: RemProcessData.statusCoin || "",
          noteStatus: RemProcessData.statusNote || "",
        }) &&
        statusMachine === "NoteIncasset"
      ) {
        {
          setStatusMachine("NoteIncasset1");
        }
      } else if (
        checkRemoveMcStatus({
          model: machineUsed?.model || "",
          state: statusMachine as TMcStateRemoveCI10,
          coinStatus: RemProcessData.statusCoin || "",
          noteStatus: RemProcessData.statusNote || "",
        }) &&
        statusMachine === "NoteIncasset1"
      ) {
        {
          setStatusMachine("NoteIncasset2");
        }
      } else if (
        checkRemoveMcStatus({
          model: machineUsed?.model || "",
          state: statusMachine as TMcStateRemoveCI10,
          coinStatus: RemProcessData.statusCoin || "",
          noteStatus: RemProcessData.statusNote || "",
        }) &&
        statusMachine === "NoteIncasset2"
      ) {
        {
          setStatusMachine("NoteIncasset3");
        }
      } else if (
        checkRemoveMcStatus({
          model: machineUsed?.model || "",
          state: statusMachine as TMcStateRemoveCI10,
          coinStatus: RemProcessData.statusCoin || "",
          noteStatus: RemProcessData.statusNote || "",
        }) &&
        statusMachine === "NoteIncasset3"
      ) {
        {
          setStatusMachine("Note6");
        }
      }

      // กรณีลืมใส่กล่องธนบัตรกลับ
      else if (
        checkRemoveMcStatus({
          model: machineUsed?.model || "",
          state: statusMachine as TMcStateRemoveCI10,
          coinStatus: RemProcessData.statusCoin || "",
          noteStatus: RemProcessData.statusNote || "",
        }) &&
        statusMachine === "NotCasset"
      ) {
        {
          setStatusMachine("NotCasset1");
        }
      } else if (
        checkRemoveMcStatus({
          model: machineUsed?.model || "",
          state: statusMachine as TMcStateRemoveCI10,
          coinStatus: RemProcessData.statusCoin || "",
          noteStatus: RemProcessData.statusNote || "",
        }) &&
        statusMachine === "NotCasset1"
      ) {
        {
          setStatusMachine("NotCasset2");
        }
      } else if (
        checkRemoveMcStatus({
          model: machineUsed?.model || "",
          state: statusMachine as TMcStateRemoveCI10,
          coinStatus: RemProcessData.statusCoin || "",
          noteStatus: RemProcessData.statusNote || "",
        }) &&
        statusMachine === "NotCasset2"
      ) {
        {
          setStatusMachine("Note6");
        }
      }

      // จบรายการ
      else if (
        checkRemoveMcStatus({
          model: machineUsed?.model || "",
          state: statusMachine as TMcStateRemoveCI10,
          coinStatus: RemProcessData.statusCoin || "",
          noteStatus: RemProcessData.statusNote || "",
        }) &&
        statusMachine === "fetchFinish"
      ) {
        {
          setTimeout(() => {
            handleFinishRemoveCassete();
          }, 3000);
        }
      }
    }
  }, [RemProcessData, transId]);
  /* eslint-enable */

  return (
    <div className="relative mx-auto flex h-[570px] w-4/5 -translate-y-10 flex-col items-center justify-around rounded-xl border-2 border-blue-900 bg-white shadow-md">
      <div className="mx-auto flex w-5/6 items-center justify-center rounded-lg bg-white p-4 text-center text-5xl">
        <span>
          {STATUS_MSG_CI10[statusMachine as TMcStateRemoveCI10] || ""}
        </span>
      </div>

      {["start", "success", "notStart"].includes(statusMachine) && (
        <div className="flex w-5/6 justify-center space-x-20">
          {/* ปุ่ม กลับหน้าหลัก */}
          <button
            onClick={onClickBackHome}
            className="hover:bg-customButonBlack flex h-[90px] w-[450px] items-center justify-center gap-2 rounded-xl border-2 border-blue-900 bg-slate-50 text-3xl text-blue-950 shadow-md hover:border-black hover:text-white"
          >
            <CircleChevronLeft width={30} height={30} />
            กลับหน้าหลัก
          </button>

          {/* ปุ่ม Start */}
          {statusMachine === "start" && (
            <button
              onClick={handleStartRemoveCassete}
              className="hover:bg-customButonBlack h-[90px] w-[450px] rounded-xl bg-blue-800 text-3xl text-white shadow-md"
            >
              เริ่มทำรายการ
            </button>
          )}
        </div>
      )}

      {/* ปุ่ม "Coin" และ "Note" */}
      {[
        "remove",
        "CoinSuccess",
        "NoteSuccess",
        "CoinIncasset",
        "NoteIncasset",
        "NotCasset",
      ].includes(statusMachine) && (
        <div className="mb-4 flex w-5/6 justify-center space-x-20 text-2xl">
          {!isRemoveCoin &&
            !["NoteIncasset", "NotCasset"].includes(statusMachine) && (
              <button
                onClick={() => handlerUnlockCasset("coin")}
                className="h-[90px] w-[350px] rounded-xl border-2 border-green-950 bg-green-600 text-3xl text-white shadow-md hover:bg-green-800"
              >
                นำเหรียญออก
              </button>
            )}
          {!isRemoveNote && !["CoinIncasset"].includes(statusMachine) && (
            <button
              onClick={() => handlerUnlockCasset("note")}
              className="h-[90px] w-[350px] rounded-xl border-2 border-blue-900 bg-blue-600 text-3xl text-white shadow-md hover:bg-blue-800"
            >
              นำธนบัตรออก
            </button>
          )}
        </div>
      )}

      {/* ปุ่ม "Finish" */}
      {["CoinSuccess", "NoteSuccess"].includes(statusMachine) && (
        <div className="flex w-5/6 justify-center text-3xl">
          <button
            onClick={handleFetchFinish}
            className="h-[90px] w-[350px] rounded-xl bg-red-600 text-3xl text-white shadow-md hover:bg-red-800"
          >
            สิ้นสุดการทำรายการ
          </button>
        </div>
      )}
    </div>
  );
};
