"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

type LeftPanelProps = {
  isScanData: string;
  clearPage: () => void;
};

export const LeftPanel: React.FC<LeftPanelProps> = ({
  isScanData,
  clearPage,
}) => {
  return (
    <div className="flex h-full w-1/2 flex-col items-center justify-between rounded-2xl bg-white p-6">
      <div className="mb-6 mt-20 w-full text-center text-4xl text-gray-900">
        <span className="block font-bold">ตรวจสอบข้อมูลสมาชิกสำเร็จ</span>
        <span className="mt-10 block font-bold">รหัสสมาชิก {isScanData}</span>
      </div>

      <div className="mb-6">
        <Image
          src="/assets/images/member01.png"
          alt="logo"
          width={212}
          height={212}
        />
      </div>

      <div className="mb-4 w-full">
        <Button
          type="button"
          className="h-24 w-full rounded-lg border-2 border-black bg-white px-4 py-3 text-4xl text-black transition hover:bg-gray-100"
          variant="default"
          onClick={() => {
            clearPage();
          }}
        >
          ยกเลิก
        </Button>
      </div>
    </div>
  );
};
