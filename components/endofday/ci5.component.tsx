"use client";

import {
  STATUS_MSG_CI5,
  EOD_STATE_LIST_CI5,
  TMcStateCI05,
} from "@/constants/eod";
import { Button } from "../ui/button";
import React, { useEffect } from "react";
import { IMachineApiData } from "@/types/model";
import { EODStepComponent } from "./step.component";
import { checkEndOfDayMcStatus } from "@/lib/utils/endofday";
import { useEndofDayContext, useMachineContext } from "@/context";

interface ICI5EODProps {
  isUnlock: boolean;
  wipId: number | null;
  transId: string | null;
  setIsOpen: (b: boolean) => void;
  setMassage: (s: string) => void;
  handleFinishEndOfDay: () => void;
  setIsError: (b: boolean) => void;
  handleInventoryCheckCoin: () => void;
  handleInventoryCheckNote: () => void;
  setCollecReady: (s: string) => void;
  EodProcessData: IMachineApiData | null;
  handlerUnlockCasset: (mc: "coin" | "note") => void;
}

export const CI5EOD = (props: ICI5EODProps) => {
  const {
    transId,
    isUnlock,
    EodProcessData,
    handlerUnlockCasset,
    handleFinishEndOfDay,
    handleInventoryCheckCoin,
    handleInventoryCheckNote,
  } = props;

  const { machineUsed } = useMachineContext();
  const { stateCheck, nextStep, statusMachine, setStatusMachine } =
    useEndofDayContext();

  /* eslint-disable */
  useEffect(() => {
    if (
      [
        "Collect",
        "collectSuccess",
        "Coin2",
        "Coin3",
        "Note1",
        "Note2",
        "Note3",
        "success",
      ].includes(statusMachine)
    ) {
      nextStep();
    }
  }, [statusMachine]);

  //สถานะเครื่องกำหนดลำดับการทำงาน
  useEffect(() => {
    if (EodProcessData) {
      if (transId === null) {
        return;
      }

      if (stateCheck.mainIndex === 1) {
        if (
          checkEndOfDayMcStatus({
            model: machineUsed?.model || "",
            state: statusMachine as TMcStateCI05,
            coinStatus: EodProcessData.statusCoin || "",
            noteStatus: EodProcessData.statusNote || "",
          }) &&
          statusMachine === "Collect"
        ) {
          setStatusMachine("collectSuccess");
        } else if (isUnlock && statusMachine === "Collect") {
          setTimeout(() => {
            setStatusMachine("collectSuccess");
          }, 2000);
        }
      }

      // Coin
      if (stateCheck.mainIndex === 2) {
        if (
          checkEndOfDayMcStatus({
            model: machineUsed?.model || "",
            state: statusMachine as TMcStateCI05,
            coinStatus: EodProcessData.statusCoin || "",
            noteStatus: EodProcessData.statusNote || "",
          }) &&
          statusMachine === "collectSuccess"
        ) {
          setStatusMachine("Coin1");
        } else if (
          checkEndOfDayMcStatus({
            model: machineUsed?.model || "",
            state: statusMachine as TMcStateCI05,
            coinStatus: EodProcessData.statusCoin || "",
            noteStatus: EodProcessData.statusNote || "",
          }) &&
          statusMachine === "Coin1"
        ) {
          setStatusMachine("Coin2");
        } else if (
          checkEndOfDayMcStatus({
            model: machineUsed?.model || "",
            state: statusMachine as TMcStateCI05,
            coinStatus: EodProcessData.statusCoin || "",
            noteStatus: EodProcessData.statusNote || "",
          }) &&
          statusMachine === "Coin2"
        ) {
          setStatusMachine("Coin3");
          setTimeout(() => {
            handleInventoryCheckCoin();
          }, 3000);
        }

        ///กรณี Collect ยังไม่หมด
        else if (
          checkEndOfDayMcStatus({
            model: machineUsed?.model || "",
            state: statusMachine as TMcStateCI05,
            coinStatus: EodProcessData.statusCoin || "",
            noteStatus: EodProcessData.statusNote || "",
          }) &&
          statusMachine === "CoinCollect"
        ) {
          {
            setStatusMachine("CoinCollectSuccess");
          }
        } else if (
          checkEndOfDayMcStatus({
            model: machineUsed?.model || "",
            state: statusMachine as TMcStateCI05,
            coinStatus: EodProcessData.statusCoin || "",
            noteStatus: EodProcessData.statusNote || "",
          }) &&
          statusMachine === "CoinCollectSuccess"
        ) {
          setStatusMachine("CoinCollectSuccess2");
        } else if (
          checkEndOfDayMcStatus({
            model: machineUsed?.model || "",
            state: statusMachine as TMcStateCI05,
            coinStatus: EodProcessData.statusCoin || "",
            noteStatus: EodProcessData.statusNote || "",
          }) &&
          statusMachine === "CoinCollectSuccess2"
        ) {
          setStatusMachine("CoinCollectSuccess3");
        } else if (
          checkEndOfDayMcStatus({
            model: machineUsed?.model || "",
            state: statusMachine as TMcStateCI05,
            coinStatus: EodProcessData.statusCoin || "",
            noteStatus: EodProcessData.statusNote || "",
          }) &&
          statusMachine === "CoinCollectSuccess3"
        ) {
          setStatusMachine("CoinCollectSuccess4");
          setTimeout(() => {
            handleInventoryCheckCoin();
          }, 3000);
        }

        // กรณีนำเหรียญออกไม่หมด
        else if (
          checkEndOfDayMcStatus({
            model: machineUsed?.model || "",
            state: statusMachine as TMcStateCI05,
            coinStatus: EodProcessData.statusCoin || "",
            noteStatus: EodProcessData.statusNote || "",
          }) &&
          statusMachine === "CoinIncasset"
        ) {
          setStatusMachine("CoinIncasset1");
        } else if (
          checkEndOfDayMcStatus({
            model: machineUsed?.model || "",
            state: statusMachine as TMcStateCI05,
            coinStatus: EodProcessData.statusCoin || "",
            noteStatus: EodProcessData.statusNote || "",
          }) &&
          statusMachine === "CoinIncasset1"
        ) {
          setStatusMachine("CoinIncasset2");
        } else if (
          checkEndOfDayMcStatus({
            model: machineUsed?.model || "",
            state: statusMachine as TMcStateCI05,
            coinStatus: EodProcessData.statusCoin || "",
            noteStatus: EodProcessData.statusNote || "",
          }) &&
          statusMachine === "CoinIncasset2"
        ) {
          setStatusMachine("CoinIncasset3");
          setTimeout(() => {
            handleInventoryCheckCoin();
          }, 3000);
        }
      }
      // Note
      if (stateCheck.mainIndex === 3) {
        if (
          checkEndOfDayMcStatus({
            model: machineUsed?.model || "",
            state: statusMachine as TMcStateCI05,
            coinStatus: EodProcessData.statusCoin || "",
            noteStatus: EodProcessData.statusNote || "",
          }) &&
          statusMachine === "Note1"
        ) {
          setStatusMachine("Note2");
        } else if (
          checkEndOfDayMcStatus({
            model: machineUsed?.model || "",
            state: statusMachine as TMcStateCI05,
            coinStatus: EodProcessData.statusCoin || "",
            noteStatus: EodProcessData.statusNote || "",
          }) &&
          statusMachine === "Note2"
        ) {
          setStatusMachine("Note3");
          setTimeout(() => {
            handleInventoryCheckNote();
          }, 16000);
        } else if (
          checkEndOfDayMcStatus({
            model: machineUsed?.model || "",
            state: statusMachine as TMcStateCI05,
            coinStatus: EodProcessData.statusCoin || "",
            noteStatus: EodProcessData.statusNote || "",
          }) &&
          statusMachine === "Note4"
        ) {
          setStatusMachine("Note5");
          handleFinishEndOfDay();
        }

        ///กรณีมีการCollect Note > 1 รอบ
        else if (
          checkEndOfDayMcStatus({
            model: machineUsed?.model || "",
            state: statusMachine as TMcStateCI05,
            coinStatus: EodProcessData.statusCoin || "",
            noteStatus: EodProcessData.statusNote || "",
          }) &&
          statusMachine === "NoteCollect"
        ) {
          {
            setStatusMachine("NoteCollectSuccess");
          }
        } else if (
          checkEndOfDayMcStatus({
            model: machineUsed?.model || "",
            state: statusMachine as TMcStateCI05,
            coinStatus: EodProcessData.statusCoin || "",
            noteStatus: EodProcessData.statusNote || "",
          }) &&
          statusMachine === "NoteCollectSuccess"
        ) {
          setStatusMachine("NoteCollectSuccess1");
        } else if (
          checkEndOfDayMcStatus({
            model: machineUsed?.model || "",
            state: statusMachine as TMcStateCI05,
            coinStatus: EodProcessData.statusCoin || "",
            noteStatus: EodProcessData.statusNote || "",
          }) &&
          statusMachine === "NoteCollectSuccess1"
        ) {
          setStatusMachine("NoteCollectSuccess2");
          setTimeout(() => {
            handleInventoryCheckNote();
          }, 16000);
        }
        // กรณีนำแบงออกไม่หมด
        else if (
          checkEndOfDayMcStatus({
            model: machineUsed?.model || "",
            state: statusMachine as TMcStateCI05,
            coinStatus: EodProcessData.statusCoin || "",
            noteStatus: EodProcessData.statusNote || "",
          }) &&
          statusMachine === "NoteIncasset"
        ) {
          setStatusMachine("NoteIncasset1");
        } else if (
          checkEndOfDayMcStatus({
            model: machineUsed?.model || "",
            state: statusMachine as TMcStateCI05,
            coinStatus: EodProcessData.statusCoin || "",
            noteStatus: EodProcessData.statusNote || "",
          }) &&
          statusMachine === "NoteIncasset1"
        ) {
          setStatusMachine("NoteIncasset2");
          setTimeout(() => {
            handleInventoryCheckNote();
          }, 16000);
        }
      }
    }
  }, [EodProcessData, transId]);

  return (
    // <div className="relative mx-auto flex h-[570px] w-4/5 flex-col items-center justify-around rounded-xl border-2 border-blue-900 bg-white shadow-md">
    <div className="relative mx-auto flex h-[570px] w-4/5 flex-col items-center justify-around rounded-xl border-2 border-blue-900 bg-white shadow-md -translate-y-10">
      <div className="flex w-5/6 items-center justify-between bg-white p-4 text-2xl">
        <div className="text-left">Steps for end-of-day closing</div>
        <div>
          <img
            src="/assets/images/investment_1329389.png"
            alt="Cash in icon"
            width={65}
            height={55}
            className="object-cover"
          />
        </div>
      </div>
      <div className="mx-auto  grid w-5/6 -translate-y-16 grid-cols-9 place-content-center place-items-center rounded-lg border-2 border-blue-900 bg-slate-100 p-4 ">
        {/* ROW 1 */}
        {EOD_STATE_LIST_CI5.map((mainState, idx) => (
          <React.Fragment key={mainState.value}>
            <EODStepComponent
              label={mainState.label}
              no={mainState.no}
              itemIndex={idx}
              itemStep={0}
              currentIndex={stateCheck.mainIndex}
              currentStep={0}
              finished={
                idx < stateCheck.mainIndex ||
                stateCheck.mainIndex === EOD_STATE_LIST_CI5.length - 1
              }
              showLabel
            />
            {idx < EOD_STATE_LIST_CI5.length - 1 ? (
              <span className=" h-0.5 w-36 bg-slate-500"></span>
            ) : null}
          </React.Fragment>
        ))}

        {
          /* Coin Steps */
          EOD_STATE_LIST_CI5[2].steps.map((coinStep, idx) => {
            const rowStart =
              idx === 0
                ? "row-start-2"
                : idx === 1
                  ? "row-start-3"
                  : "row-start-4";
            return (
              <EODStepComponent
                key={`coin-${idx}`}
                className={`col-start-5 ${rowStart}`}
                label={coinStep.label}
                no={coinStep.no}
                itemIndex={2}
                itemStep={idx}
                currentIndex={stateCheck.mainIndex}
                currentStep={stateCheck.currentStep}
                showLabel
              />
            );
          })
        }

        {
          /* note Steps */
          EOD_STATE_LIST_CI5[3].steps.map((noteStep, idx) => {
            const rowStart =
              idx === 0
                ? "row-start-2"
                : idx === 1
                  ? "row-start-3"
                  : "row-start-4";
            return (
              <EODStepComponent
                key={`note-${idx}`}
                className={`col-start-7 ${rowStart}`}
                label={noteStep.label}
                no={noteStep.no}
                itemIndex={3}
                itemStep={idx}
                currentIndex={stateCheck.mainIndex}
                currentStep={stateCheck.currentStep}
                showLabel
              />
            );
          })
        }
      </div>
      <div className="mx-auto -mt-28 flex w-5/6 items-center justify-between rounded-lg bg-slate-50 p-4 text-left text-4xl">
        <span>{STATUS_MSG_CI5[statusMachine as TMcStateCI05] || ""}</span>
        {["collectSuccess", "CoinIncasset"].includes(statusMachine) && (
          <Button
            className="h-[70px] w-[350px] border-2 bg-green-700 text-3xl text-white shadow-md hover:bg-slate-800"
            onClick={() => handlerUnlockCasset("coin")}
          >
            ปลดล๊อคกล่องเหรียญ
          </Button>
        )}
      </div>
    </div>
  );
  /* eslint-enable */
};
