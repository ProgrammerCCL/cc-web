"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface EodChoiceProps {
  onFullWithdraw: () => void;
  onKeepChange: () => void;
}

export const EodChoice: React.FC<EodChoiceProps> = ({
  onFullWithdraw,
  onKeepChange,
}) => {
  return (
    <div className="relative mx-auto flex h-[570px] w-4/5 flex-col items-center justify-around rounded-xl border-2 border-blue-900 bg-white shadow-md">
      <div className="mx-auto flex w-5/6 items-center justify-center rounded-lg bg-white p-4 text-center text-5xl">
        <span>คุณต้องการปิดสิ้นวันแบบไหน</span>
      </div>

      <div className="flex w-5/6 justify-center space-x-20">
        <Button
          onClick={onFullWithdraw}
          className="h-[90px] w-[450px] rounded-xl border-2  bg-red-600 text-3xl text-white shadow-md hover:bg-red-700 hover:text-white"
        >
          นำเงินออกทั้งหมด
        </Button>

        <Button
          onClick={onKeepChange}
          className="h-[90px] w-[450px] rounded-xl border-2 bg-green-600 text-3xl text-white shadow-md hover:bg-green-700 hover:text-white"
        >
          คงเหลือเงินทอนตั้งต้น
        </Button>
      </div>
    </div>
  );
};
