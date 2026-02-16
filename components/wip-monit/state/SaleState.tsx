import React, { useState } from "react";
import {
  CancelButton,
  InfoRow,
  StatusHeader,
  StatusSaleLabel,
} from "../others";
import { IMachineApiData } from "@/types/model";
import { cancelSale } from "@/lib/actions/sale.actions";

const ALLOW_CANCEL = false;

interface Props {
  data: IMachineApiData[];
}

// utils function
const paseNumberFormat = (n: number) => {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// main function
export const SaleState = ({ data }: Props) => {
  const [isCanceling, setIsCanceling] = useState(false);

  // หา latest sale data จาก array
  const saleProcessData = data.sort((a, b) => b.id - a.id).at(0);

  const amount = saleProcessData?.amount || 0;
  const cashin = saleProcessData?.cashin || 0;

  const handleCancelSale = async () => {
    try {
      if (!saleProcessData) {
        return;
      }

      const { id, clientReqID } = saleProcessData;

      if (!id || !clientReqID) {
        return;
      }

      const cancelParams = {
        saleId: id,
        reqId: clientReqID,
        cancelRequest: true,
      };

      const result = await cancelSale(cancelParams);

      if (result.success) {
        setIsCanceling(true);
      } else {
        console.error("[ERROR] Cancel failed:", result.error);
      }
    } catch (err: any) {
      console.error("[ERROR] Backend error");
    }
  };

  return (
    <>
      {/* Header */}
      <StatusHeader statusText={"กำลังทำการ: ชำระเงิน"} />

      {/* Content */}
      <div className=" grow overflow-hidden bg-white px-12 pt-12">
        <div className=" h-[300px]">
          {/* ------------------------------------ Label -----------------------------------  */}
          <div className="space-y-12 p-8">
            <InfoRow
              label="ยอดเงิน"
              value={`${paseNumberFormat(amount)} บาท`}
            />
            <InfoRow
              label="ชำระแล้ว"
              value={`${paseNumberFormat(cashin)} บาท`}
            />
            <StatusSaleLabel amount={amount} cashin={cashin} />
          </div>

          {/* ---------------------------------- Label -------------------------------------  */}
        </div>
        <hr className="m-6 border-t-2 border-blue-900" />
        <div className="mt-10 flex items-end justify-center text-3xl font-medium italic text-blue-600">
          {isCanceling
            ? "กำลังยกเลิกรายการ กรุณารับเงินคืน"
            : "เมื่อไฟเป็นสีฟ้า สามารถเริ่มเติมเงินได้เลยค่ะ"}
        </div>
        {/* Button */}
        {ALLOW_CANCEL && cashin === 0 && !isCanceling ? (
          <div className="mt-10 flex  justify-center">
            <CancelButton onClick={handleCancelSale} />
          </div>
        ) : null}
      </div>
    </>
  );
};
