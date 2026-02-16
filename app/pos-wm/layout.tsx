"use client";

import React, { Suspense, useEffect } from "react";

const MiniPosLayout = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const preventReload = (event: KeyboardEvent) => {
      if ((event.ctrlKey && event.key === "r") || event.key === "F5") {
        event.preventDefault();
        console.log("Page refresh blocked!");
      }
    };

    window.addEventListener("keydown", preventReload);
    return () => window.removeEventListener("keydown", preventReload);
  }, []);
  return <Suspense>{children}</Suspense>;
};

export default MiniPosLayout;
