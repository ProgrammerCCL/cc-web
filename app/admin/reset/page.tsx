"use client";

import Image from "next/image";
import {
  getResetStatus,
  resetMachine,
} from "@/lib/actions/resetMachine.actions";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IMachineApiData } from "@/types/model";
import { Button } from "@/components/ui/button";
import { CircleChevronLeft } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useMachineContext, useSidebarContext } from "@/context";

function ResetMachine() {
  const router = useRouter();
  const [error, setError] = useState("");
  const { machineUsed } = useMachineContext();
  const [loading, setLoading] = useState(true);
  const [isReady, setIsReady] = useState("null");
  const { disableAll, enableAll } = useSidebarContext();
  const [wipId, setWipId] = useState<number | null>(null);
  const [reqId, setReqId] = useState<string | null>(null);
  const [ResProcessData, setResProcessData] = useState<IMachineApiData | null>(
    null
  );

  const onResetMachine = async () => {
    if (!machineUsed) return;

    const machineId = machineUsed.id;

    if (!machineId) {
      setError("ไม่พบข้อมูลเครื่อง POS หรือ Machine ID");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const dataResponde = await resetMachine({ machineId });
      if (dataResponde.success && dataResponde.data) {
        setWipId(dataResponde.data.id);
        setReqId(dataResponde.data.clientReqID);
        setIsReady("wip");
        disableAll();
      } else {
        console.error(
          "[ERROR] API returned unsuccessful reset machine:",
          dataResponde.error
        );
        setError(dataResponde.error || "เกิดข้อผิดพลาดในการรีเซ็ตเครื่อง");
        toast({
          title: "Reset Error",
          description:
            "ไม่สามารถรีเซ็ตเครื่องได้! กรุณาตรวจสอบความพร้อมเครื่อง",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      console.error("[ERROR] reset machine Failed:", err.message);
      setError("ไม่สามารถรีเซ็ตเครื่องได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  const handleGetsetStatus = async (procId: number) => {
    try {
      if (wipId !== null && reqId !== null) {
        const { success, data } = await getResetStatus(wipId.toString());

        if (success && data) {
          setResProcessData(data);
          const { status } = data;

          if (status === "Finished") {
            setIsReady("Finished");
            enableAll();
            await router.push("/admin");
          } else if (status === "ERROR") {
            setError("เครื่องมีปัญหากรุณาติดต่อเจ้าหน้าที่");
            enableAll();
          }
        }
      }
    } catch (err: any) {
      setIsReady("ERROR");
      setError("เครื่องมีปัญหากรุณาติดต่อเจ้าหน้าที่");
      console.error("[ERROR] handleGetsetStatus Failed", err.message);
    }
  };
  /* eslint-disable */
  useEffect(() => {
    if (isReady === "wip") {
      if (typeof wipId === "number") {
        const intervalId = setInterval(() => {
          handleGetsetStatus(wipId);
        }, 2000);

        return () => clearInterval(intervalId);
      } else {
        console.warn("[WARN] wipId is not a number:", wipId);
      }
    } else if (isReady === "start") {
      onResetMachine();
    }
  }, [isReady, wipId, ResProcessData]);
  /* eslint-enable */

  return (
    // <div className="relative mx-auto flex h-[570px] w-4/5 flex-col items-center justify-around rounded-xl border-2 border-blue-900 bg-white shadow-md -translate-y-10">
    <div className="flex h-screen items-center justify-center">
      {isReady === "null" && (
        <div className="relative mx-auto flex h-[470px] w-4/5 -translate-y-10 flex-col items-center justify-around rounded-xl border-2 border-blue-900 bg-white shadow-md">
          <div className="mt-10">
            <h2 className="text-center text-4xl font-bold text-black">
              ยืนยันการรีเซ็ตเครื่องทอนเงิน
            </h2>
            <p className="pt-8 text-center text-3xl text-blue-950">
              กรุณากดปุ่มยืนยันถ้าต้องการ รีเซ็ตเครื่อง
            </p>
          </div>
          <div className="mb-6 mt-auto flex justify-center gap-16 px-10">
            <Button
              className="flex h-[105px] w-[455px] items-center justify-center gap-2 border-2 border-blue-950 bg-white text-3xl text-blue-950 shadow-sm shadow-black hover:text-white"
              onClick={() => router.push("/admin")}
            >
              <CircleChevronLeft width={30} height={30} />
              กลับหน้าหลัก
            </Button>

            <Button
              className="h-[105px] w-[455px] border-2 border-blue-950 bg-blue-800 text-3xl shadow-sm shadow-black"
              onClick={() => setIsReady("start")}
            >
              ยืนยัน
            </Button>
          </div>
        </div>
      )}
      {isReady !== "null" && (
        <div className="flex h-screen flex-col items-center justify-center">
          <Image
            src="/assets/images/machine.png"
            alt="Cash in icon"
            width={150}
            height={140}
            className="object-cover"
          />
          <p className="my-4 text-2xl font-semibold text-gray-700">
            {loading
              ? "เครื่องกำลัง รีเซ็ต กรุณารอสักครู่..."
              : error
                ? `❌ ${error}`
                : "✅เครื่องกำลังรีเซ็ต กรุณารอสักครู่"}
          </p>
        </div>
      )}
    </div>
  );
}

export default ResetMachine;
