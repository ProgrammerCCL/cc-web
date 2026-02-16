"use client";

import React from "react";
import { Loader } from "lucide-react";
import Image from "next/image";

interface ScanMemberFormProps {
  isScanData: string;
  isCheckMember: boolean;
  fetchMessage: string;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  setScanData: React.Dispatch<React.SetStateAction<string>>;
  handleConfirm: () => void;
  handleDialogClose: () => void;
  isFetching: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const ScanMemberForm: React.FC<ScanMemberFormProps> = ({
  isScanData,
  isCheckMember,
  fetchMessage,
  handleKeyDown,
  setScanData,
  handleConfirm,
  handleDialogClose,
  isFetching,
  inputRef,
}) => {
  return (
    <div className="absolute left-1/2 top-1/2 flex h-[700px] w-[800px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-8 shadow-2xl">
      <div className="mb-6 text-center text-4xl font-bold text-gray-950">
        กรุณาสแกนรหัสสมาชิก
      </div>

      {isCheckMember ? (
        <div className="flex-center h-[320px] w-full flex-col gap-3 text-slate-700">
          <Loader size={150} className="animate-spin" />
          <span className="text-xl italic">Loading data ...</span>
        </div>
      ) : (
        <div className="mb-6 mt-16">
          <Image
            src="/assets/images/qr-code.png"
            alt="logo"
            width={212}
            height={212}
          />
        </div>
      )}

      <div className="mb-4 mt-5 text-center text-xl text-gray-950">
        {fetchMessage}
      </div>

      <input
        ref={inputRef}
        type="text"
        value={isScanData}
        onChange={(e) => setScanData(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="กรอกรหัสสมาชิกที่นี่"
        className="mt-4 w-full rounded-md border border-gray-300 p-3 text-center text-lg tracking-widest shadow-inner focus:border-blue-500 focus:outline-none"
        disabled={isFetching}
      />

      <div className="mt-auto flex w-full gap-4">
        <button
          className="h-16 w-2/5 rounded-lg border-2 border-black bg-white px-4 py-3 text-2xl text-black transition hover:bg-zinc-100"
          onClick={handleDialogClose}
          disabled={isFetching}
        >
          กลับหน้าหลัก
        </button>

        <button
          className="ml-auto h-16 w-2/5 rounded-lg bg-black px-4 py-3 text-2xl text-white transition hover:bg-zinc-800"
          onClick={handleConfirm}
          disabled={isFetching}
        >
          ยืนยัน
        </button>
      </div>
    </div>
  );
};

export default ScanMemberForm;
