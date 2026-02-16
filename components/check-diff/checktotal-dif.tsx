"use client";

import { gettotalDiff } from "@/lib/actions/check-diff";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";

interface IDiffData {
  adjustment: string;
  diff: number;
}

export function CheckTotalDif() {
  const [isClient, setIsClient] = useState(false);
  const [checking, setChecking] = useState(true);
  const [formData, setFormData] = useState<IDiffData | null>(null);

  const fetchDiffData = async () => {
    try {
      setChecking(true);
      const { success, data, error } = await gettotalDiff();

      if (success) {
        setFormData({
          adjustment: data.adjustment,
          diff: data.diff,
        });
      } else {
        console.error("[ERROR] API Error: ", error);
        toast({
          title: "CANCEL Transaction Fail",
          description: "ดึงข้อมูลเงินผิดพลาด กรุณาติดต่อเจ้าหน้าที่",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      console.error("[ERROR]", err.message);
      toast({
        title: "CANCEL Transaction Fail",
        description: "ดึงข้อมูลเงินผิดพลาด กรุณาติดต่อเจ้าหน้าที่",
        variant: "destructive",
      });
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      fetchDiffData();
    }
  }, [isClient]);

  return (
    <div className="relative mx-auto flex flex-col items-center justify-around rounded-xl border border-black bg-white p-4 shadow-md">
      <div className="text-3xl">
        ผลต่างเงินในเครื่อง :{" "}
        {checking
          ? "Checking ..."
          : formData
            ? formData.diff.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : "ERROR"}
      </div>

      <div className="flex-center mt-4 flex-col text-2xl text-gray-800">
        {checking ? (
          "Checking ..."
        ) : formData && formData.diff === 0 ? (
          <span className="text-green-600">สถานะปกติ</span>
        ) : (
          <>
            <span className="text-red-500">
              กรุณาติดต่อเจ้าหน้าที่ !! เพื่อแก้ไขด้วย POS Standard
            </span>
            <span className="text-sm italic text-red-500">
              detaild:{formData ? formData.adjustment : "API Error"}
            </span>
          </>
        )}
      </div>

      <Button
        className="hover:bg-customButonBlack mt-6 w-[250px] rounded-lg bg-blue-600 px-4 py-2 text-2xl text-white"
        onClick={() => fetchDiffData()}
      >
        ตรวจสอบอีกครั้ง
      </Button>
    </div>
  );
}
