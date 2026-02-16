"use client";

import React, { useEffect } from "react";

const MiniPosLayout = ({ children }: { children: React.ReactNode }) => {
  // Prevent refresh command
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
  return <>{children}</>;
};

export default MiniPosLayout;
