import React, { Suspense } from "react";
import { FooterMachine } from "@/components/minipos/footer";

const OperationsRootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative mx-auto flex max-w-screen-2xl">
      <Suspense>{children}</Suspense>
      <FooterMachine />
    </div>
  );
};

export default OperationsRootLayout;
