"use client";

import {
  getTransactionError,
  getTransactionWip,
  updateTransactionWip,
} from "@/lib/actions/check-diff";
import { IMachineApiData } from "@/types/model";
import { useState, useEffect } from "react";
import { toast } from "../ui/use-toast";

export const CheckDifWip = () => {
  const [transactions, setTransactions] = useState<IMachineApiData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  // ฟังก์ชันดึงข้อมูล ใช้ร่วมกันได้
  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [wipResult, errorResult] = await Promise.all([
        getTransactionWip(),
        getTransactionError(),
      ]);

      if (wipResult.success && errorResult.success) {
        setTransactions([...wipResult.data.data, ...errorResult.data.data]);
      } else {
        setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
        toast({
          title: "CANCEL Transaction Fail",
          description: "ดึงข้อมูลผิดพลาด กรุณาติดต่อเจ้าหน้าที่",
          variant: "destructive",
        });
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      toast({
        title: "CANCEL Transaction Fail",
        description:
          err instanceof Error
            ? err.message
            : "ดึงข้อมูลผิดพลาด กรุณาติดต่อเจ้าหน้าที่",
        variant: "destructive",
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdate = async (id: number) => {
    setUpdating(id.toString());

    const result = await updateTransactionWip(id);
    if (result.success) {
      toast({
        title: "CANCEL Transaction Success",
        description: "ยกเลิกรายการสำเร็จ",
        variant: "success",
      });

      await fetchData(); // 🔥 เรียก fetchData ใหม่หลังจากอัปเดต
    } else {
      toast({
        title: "CANCEL Transaction Fail",
        description: "ยกเลิกรายการผิดพลาด กรุณาติดต่อเจ้าหน้าที่",
        variant: "destructive",
      });
    }

    setUpdating(null);
  };

  return (
    <div className="relative mx-auto flex w-full flex-col items-center justify-around rounded-xl border border-black bg-white p-4 shadow-md">
      <div className="mb-6 mt-4 flex h-12 w-full items-center justify-center rounded-md p-3 text-3xl text-black">
        ⚠️ ข้อมูลรายการมีปัญหา
      </div>

      {loading ? (
        <div className="flex h-64 w-full items-center justify-center">
          <span className="text-xl font-medium text-black">
            ⏳ กำลังโหลดข้อมูล...
          </span>
        </div>
      ) : error ? (
        <div className="text-xl font-medium text-red-500">⚠️ {error}</div>
      ) : (
        <>
          <div className="w-full rounded-lg bg-slate-200 p-2">
            <div className="flex justify-between border border-white text-lg font-bold text-black">
              <span className="w-1/5 text-center">ID</span>
              <span className="w-1/5 text-center">ReqID</span>
              <span className="w-1/5 text-center">Amount</span>
              <span className="w-1/5 text-center">Status</span>
              <span className="w-1/5 text-center">Cancel</span>
            </div>
          </div>

          <div className="mt-4 w-full">
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between border-b border-gray-300 py-2"
                >
                  <span className="w-1/5 text-center">{transaction.id}</span>
                  <span className="w-1/5 text-center">{transaction.reqID}</span>
                  <span className="w-1/5 text-center">
                    {transaction.amount}
                  </span>
                  <span className="w-1/5 text-center">
                    {transaction.status}
                  </span>
                  <span className="w-1/5 text-center">
                    <button
                      className={`rounded px-10 py-2 text-white ${
                        updating === transaction.id.toString()
                          ? "cursor-not-allowed bg-gray-400"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                      onClick={() => handleUpdate(transaction.id)}
                      disabled={updating === transaction.id.toString()}
                    >
                      {updating === transaction.id.toString()
                        ? "⏳..."
                        : "Cancel"}
                    </button>
                  </span>
                </div>
              ))
            ) : (
              <div className="mt-4 flex h-10 items-center justify-center text-xl font-medium text-black">
                -- ไม่พบรายการค้างหรือมีปัญหา --
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
