import React from "react";
import { InventoryContextProvider } from "@/context";

const InventoryPageLayout = ({ children }: { children: React.ReactNode }) => {
  return <InventoryContextProvider>{children}</InventoryContextProvider>;
};

export default InventoryPageLayout;
