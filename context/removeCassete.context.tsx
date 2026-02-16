"use client";

import {
  TMcStateRemoveCI10,
  TMcStateRemoveCI05,
  TMcStateRemoveCI50,
} from "@/constants/removeCassete";
import React, { createContext, useContext, useState } from "react";

interface IremoveCasseteContext {
  statusMachine: TMcStateRemoveCI10 | TMcStateRemoveCI05 | TMcStateRemoveCI50;
  setStatusMachine: (
    st: TMcStateRemoveCI10 | TMcStateRemoveCI05 | TMcStateRemoveCI50
  ) => void;
}

const RemoveCasseteContext = createContext<IremoveCasseteContext | undefined>(
  undefined
);

export function RemoveCasseteContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [statusMachine, setStatusMachine] = useState<
    TMcStateRemoveCI10 | TMcStateRemoveCI05 | TMcStateRemoveCI50
  >("start");

  return (
    <RemoveCasseteContext.Provider
      value={{
        statusMachine,
        setStatusMachine,
      }}
    >
      {children}
    </RemoveCasseteContext.Provider>
  );
}

export function useRemoveCasseteContext() {
  const context = useContext(RemoveCasseteContext);

  if (context === undefined) {
    throw new Error(
      "useRemoveCasseteContext must be used within an RemoveCasseteContextProvider"
    );
  }

  return context;
}
