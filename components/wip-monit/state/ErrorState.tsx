import { TriangleAlert, X } from "lucide-react";
import React from "react";

interface ErrorStateProps {
  error: string; // Or a more specific error type if needed
}

export function ErrorState({ error }: ErrorStateProps) {
  return (
    <>
      {/* Header */}
      <div className="flex-center h-[170px] w-full gap-8 rounded-lg bg-red-600">
        <TriangleAlert className="size-28 text-white" />
        <h2 className="text-center text-6xl font-semibold text-white">
          กรุณาติดต่อเจ้าหน้าที่
        </h2>
      </div>
      {/* Content */}
      <div className="grow overflow-hidden bg-white px-12 pt-12">
        <div className="flex-center h-[300px] flex-col gap-6 font-medium text-red-600">
          {/* ------------------------------------ messages ----------------------------------- */}
          <div className="flex items-center gap-4">
            <X size={52} className="rounded-xl bg-red-600 text-white" />
            <p className="text-6xl">เกิดข้อผิดพลาด !</p>
          </div>

          <p className="text-3xl">{error || "Server side error"}</p>
          {/* ---------------------------------- messages ------------------------------------- */}
        </div>
        <hr className="m-6 border-t-2 border-red-900" />
        {/* <div className="mt-10 flex items-end justify-center text-2xl font-medium italic text-blue-600">
          กรุณาตรวจสอบเงินที่ได้รับ : เครื่องจ่ายธนบัตร ครั้งละ 10 ฉบับ
        </div> */}
      </div>
    </>
  );
}
