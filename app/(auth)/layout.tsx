"use client";

import { ReactNode, Suspense } from "react";

const SaleLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="screen-size flex-center">
      <Suspense>{children}</Suspense>
    </div>
  );
};

export default SaleLayout;
