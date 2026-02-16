// components/state/ResetPanel.tsx
import Image from "next/image";
import React from "react";
interface StatusProps {
  title: string;
  imgSrc: string;
  message?: string;
}

export const Status = ({ title, imgSrc, message }: StatusProps) => {
  return (
    <div className="w-full space-y-8">
      <div className="flex-center h-[170px] flex-col gap-8">
        {/* Header */}
        <h2 className="text-center text-4xl font-semibold text-blue-900  md:text-6xl">
          {title}
        </h2>
        <hr className="w-full border-t-2 border-gray-400" />
      </div>

      {/* Image + Message */}
      <div className="flex grow flex-col items-center bg-white">
        <Image src={imgSrc} alt="Resetting" width={450} height={450} />
      </div>
      {message ? (
        <p className="text-center text-2xl italic text-red-500">{message}</p>
      ) : null}
    </div>
  );
};

export const StatusReset = () => {
  return (
    <Status
      title="เครื่องกำลังรีเซ็ต กรุณารอสักครู่..."
      imgSrc="/assets/images/CI_300x300.png"
    />
  );
};

export const StatusIdle = () => {
  return (
    <Status
      title="เริ่มทำรายการต่อไปได้เลยค่ะ"
      imgSrc="/assets/images/CI_300x300.png"
    />
  );
};

export const StatusBusy = () => {
  return (
    <Status
      title="เครื่องยังไม่ว่าง กรุณารอสักครู่..."
      imgSrc="/assets/images/CI_300x300.png"
      message="เครื่องกำลังทำรายการอื่นๆ "
    />
  );
};
