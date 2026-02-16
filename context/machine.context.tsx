"use client";

import { IMachineData } from "@/types/model";
import React, { createContext, useContext, useEffect, useState } from "react";

interface IMachineContext {
  machineUsed: IMachineData | undefined;
  setMachineUsedState: (mc: IMachineData | undefined) => void;
}

const MachineContext = createContext<IMachineContext | undefined>(undefined);

export function MachineContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [machineUsed, setMachineUsed] = useState<IMachineData | undefined>(
    undefined
  );

  const setMachineUsedState = (mc: IMachineData | undefined) => {
    setMachineUsed(mc);
    if (mc) {
      localStorage.setItem("machineUsed", JSON.stringify(mc));
    } else {
      localStorage.removeItem("machineUsed");
    }
  };

  useEffect(() => {
    const savedMachine = localStorage.getItem("machineUsed");
    if (savedMachine) {
      setMachineUsed(JSON.parse(savedMachine));
    }
  }, []);

  return (
    <MachineContext.Provider value={{ machineUsed, setMachineUsedState }}>
      {children}
    </MachineContext.Provider>
  );
}

export function useMachineContext() {
  const context = useContext(MachineContext);

  if (context === undefined) {
    throw new Error(
      "useMachineContext must be used whithin a MachineContextProvider"
    );
  }

  return context;
}
