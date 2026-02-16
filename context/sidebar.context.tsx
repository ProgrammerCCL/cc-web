"use client";

import React, { createContext, useContext, useState } from "react";

interface ISidebarContext {
  isDisable: boolean;
  disableAll: () => void;
  enableAll: () => void;
}

const SidebarContext = createContext<ISidebarContext | undefined>(undefined);

export function SidebarContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDisable, setIsDisable] = useState(false);

  const disableAll = () => {
    setIsDisable(true);
  };
  const enableAll = () => {
    setIsDisable(false);
  };

  return (
    <SidebarContext.Provider value={{ isDisable, disableAll, enableAll }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebarContext() {
  const context = useContext(SidebarContext);

  if (context === undefined) {
    throw new Error(
      "useSidebarContext must be used whithin a SidebarContextProvider"
    );
  }

  return context;
}
