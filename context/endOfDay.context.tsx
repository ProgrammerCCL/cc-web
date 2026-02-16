"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useMachineContext } from "./machine.context";
import {
  EOD_STATE_LIST_CI10,
  EOD_STATE_LIST_CI10X,
  EOD_STATE_LIST_CI5,
  EOD_STATE_LIST_CI50,
  TMcStateCI05,
  TMcStateCI10,
  TMcStateCI10X,
  TMcStateCI50,
} from "@/constants/eod";
import { IEODState } from "@/types/model/endOfDay.type";

interface IEndofDayContext {
  currentState: IEODState;
  statusMachine: TMcStateCI10X | TMcStateCI10 | TMcStateCI05 | TMcStateCI50;
  stateCheck: { mainIndex: number; currentStep: number };
  setStatusMachine: (
    st: TMcStateCI10X | TMcStateCI10 | TMcStateCI05 | TMcStateCI50
  ) => void;
  nextStep: () => void;
}

const EOD_INIT_STEP = EOD_STATE_LIST_CI10[0];

const EndofDayContext = createContext<IEndofDayContext | undefined>(undefined);

export function EndofDayContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { machineUsed } = useMachineContext();
  const [statusMachine, setStatusMachine] = useState<
    TMcStateCI10 | TMcStateCI05 | TMcStateCI50 | TMcStateCI10X
  >("start");
  const [currentState, setCurrentState] = useState(EOD_INIT_STEP);
  const [modelStateList, setModelStateList] = useState<IEODState[]>([]);

  const stateCheck = useMemo(() => {
    const mainIndex = modelStateList.findIndex(
      (st) => st.value === currentState.value
    );
    const currentStep = currentState.steps.reduce(
      (agg, st) => (st.isFinished === true ? agg + 1 : agg),
      0
    );

    return { mainIndex, currentStep };
  }, [currentState, modelStateList]);

  // next step function
  const nextStep = () => {
    // console.log("[nextStep]");
    setCurrentState((prev) => {
      if (stateCheck.currentStep >= prev.steps.length - 1) {
        // new state
        const nextMainIdx = stateCheck.mainIndex + 1;
        return nextMainIdx < modelStateList.length
          ? modelStateList[nextMainIdx]
          : prev;
      } else {
        // new step
        return {
          ...prev,
          steps: prev.steps.map((st, idx) =>
            idx === stateCheck.currentStep ? { ...st, isFinished: true } : st
          ),
        };
      }
    });
  };

  useEffect(() => {
    if (machineUsed) {
      switch (machineUsed.model) {
        case "CI-05B":
          return setModelStateList(EOD_STATE_LIST_CI5);
        case "CI-10BX":
          return setModelStateList(EOD_STATE_LIST_CI10X);
        case "CI-10B":
          return setModelStateList(EOD_STATE_LIST_CI10);
        case "CI-50B":
          return setModelStateList(EOD_STATE_LIST_CI50);
      }
    }
    setModelStateList([]);
  }, [machineUsed]);

  return (
    <EndofDayContext.Provider
      value={{
        currentState,
        stateCheck,
        statusMachine,
        setStatusMachine,
        nextStep,
      }}
    >
      {children}
    </EndofDayContext.Provider>
  );
}

export function useEndofDayContext() {
  const context = useContext(EndofDayContext);

  if (context === undefined) {
    throw new Error(
      "useEndofDayContext must be used within an EndofDayContextProvider"
    );
  }

  return context;
}
