"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface RefillNoticeProps {
  onClickBackHome: () => void;
  onClickRefill: () => void;
}

export const RefillNotice: React.FC<RefillNoticeProps> = ({
  onClickBackHome,
  onClickRefill,
}) => {
  return (
    <div className="mx-auto flex h-[400px] w-4/5 flex-col justify-between rounded-xl border-2 border-red-500 bg-white p-4 shadow-md">
      <div>
        <h2 className="text-center text-4xl font-bold text-red-700">
          เงินทอนเหลือต่ำกว่ากำหนด
        </h2>
        <p className="pt-5 text-center text-3xl text-red-600">
          กรุณาเติมเงินทอน
        </p>
      </div>
      <div className="mb-6 mt-auto flex justify-between">
        <Button
          className="h-[85px] w-1/3 border-2 border-blue-950 bg-white text-3xl text-blue-950 shadow-sm shadow-black hover:text-white"
          onClick={onClickBackHome}
        >
          กลับหน้าหลัก
        </Button>
        <Button
          className="h-[85px] w-1/3 bg-blue-800 text-3xl shadow-sm shadow-black"
          onClick={onClickRefill}
        >
          เติมเงินทอน
        </Button>
      </div>
    </div>
  );
};
