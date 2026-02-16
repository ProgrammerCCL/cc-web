// components/state/StatusPanel.tsx
import React from "react";
import { InfoRow, StatusHeader } from "../others";

type Props = {
  amount?: number;
};
export function DispenseState({ amount = 0 }: Props) {
  const paseNumberFormat = (n: number) => {
    return n.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };
  return (
    <>
      {/* Header */}
      <StatusHeader statusText={"กำลังทำการ: ถอนเงิน"} />
      {/* Content */}
      <div className=" grow overflow-hidden bg-white px-12 pt-12">
        <div className=" h-[300px]">
          {/* ------------------------------------ Label -----------------------------------  */}
          <div className="space-y-12 p-8">
            <InfoRow
              label="ยอดเงิน"
              value={`${paseNumberFormat(amount || 0)} บาท`}
            />
          </div>
          {/* ---------------------------------- Label -------------------------------------  */}
        </div>
        <hr className="m-6 border-t-2 border-blue-900" />
        <div className="mt-10 flex items-end justify-center text-3xl font-medium italic text-blue-600">
          กรุณาตรวจสอบเงินที่ได้รับ : เครื่องจ่ายธนบัตร ครั้งละ 10 ฉบับ
        </div>
      </div>
    </>
  );
}
