// import React, { ReactNode } from "react";

// const MonitLayout = ({ children }: { children: ReactNode }) => {
//   return (
//     <div className="flex-center h-screen bg-gray-700 backdrop-blur">
//       <div className="h-[820px] w-[1180px] flex-col overflow-hidden rounded-3xl border-2 bg-white p-8 shadow-xl">
//         {children}
//       </div>
//     </div>
//   );
// };
// ----------------------------------------------------------------------------------------------------

"use client";

import { ReactNode } from "react";
import { InventorySidebar } from "@/components/wip-monit/inventory-sidebar";

import { InventoryContextProvider } from "@/context";

const MonitLayout = ({ children }: { children: ReactNode }) => {
  return (
    <InventoryContextProvider>
      <div className="flex h-screen items-center justify-center bg-gray-700 backdrop-blur">
        {/* Sidebar */}
        <InventorySidebar />

        {/* state box */}
        <div className="h-[820px] w-[1180px] overflow-hidden rounded-3xl border-2 bg-white shadow-xl">
          {children}
        </div>
      </div>
    </InventoryContextProvider>
  );
};

export default MonitLayout;
