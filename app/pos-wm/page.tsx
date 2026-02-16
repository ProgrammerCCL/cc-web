"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";
import { useSession } from "next-auth/react";
import { useMachineContext } from "@/context";
import { TStatusPageCJ } from "@/types/share";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { redirect, useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import { posWmSale } from "@/lib/world-market/actions/wmSale";
import { FetchUser, getInventory } from "@/lib/actions/inventory.actions";
import { checkValue } from "@/lib/world-market/actions/syncTansaction";
import { LeftPanel } from "@/lib/world-market/component/posScan-world-market";
import { LoadingDialogCJComponent } from "@/components/shared/loading/loading-dialog-CJ.component";

const MAIN_NUMPAD = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "0"];

const NumpadButton = ({
  val,
  className,
  onClick,
}: {
  val: string;
  className?: string;
  onClick: (val: string) => void;
}) => {
  return (
    <Button
      className={cn(
        "hover:bg-blue-600 h-20 bg-slate-50 rounded-md border border-slate-700 p-3 text-center text-4xl hover:text-white",
        className
      )}
      variant="outline"
      value={val}
      onClick={(e) => onClick(e.currentTarget.value)}
    >
      {val}
    </Button>
  );
};

function PosPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { dismissAll } = useToast();
  const { data: session } = useSession();
  const [isUser, setUser] = useState("");
  const [isName, setName] = useState("");
  const [massage, setMassage] = useState("");
  const { machineUsed } = useMachineContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isScanData, setScanData] = useState("");
  const [isStart, setIsStart] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [saleAmount, setSaleAmount] = useState("0");
  const [isScanning, setIsScanning] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [isCheckMember, setIsCheckMember] = useState(false);
  const [isReady, setIsReady] = useState<TStatusPageCJ>("standby");
  const [isConfirmDisabled, setIsConfirmDisabled] = useState(false);
  const [fetchMessage, setFetchMessage] = useState(
    "______________ หรือกรอกรหัสสมาชิกด้วยตัวเองแล้วกด Enter ______________"
  );

  // step 1 : ตรวจสอบสถานะเงินในเครื่อง
  const checkInventory = async () => {
    try {
      setIsOpen(true);
      setIsReady("fetch");
      setMassage("กรุณารอสักครู่");
      const { success, message } = await getInventory();

      if (success && message !== undefined) {
        setIsConfirmDisabled(true);
        toast({
          title: "CheckInventory",
          description: `${message}\nกรุณาตรวจสอบ กล่องยอดขาย`,
        });
      } else if (success) {
        setIsReady("start");
        setIsOpen(false);
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 100);
      }
    } catch (err: any) {
      setIsConfirmDisabled(true);
      setIsReady("error");
      setMassage(
        "ไม่สามารถตรวจสอบสถานะเงินในเครื่องได้! กรุณาติดต่อเจ้าหน้าที่"
      );
      console.error("[ERROR] checkInventory Failed", err.message);
    }
  };

  // step 2 : กรอกหมายเลขสมาชิค กดยืนยัน หรือ สแกน
  const handleConfirm = () => {
    setScanData(isScanData);
    fetchMember();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setScanData(e.currentTarget.value);
      fetchMember();
    }
  };

  // step 3 : ตรวจสอบหมายเลขสมาชิค
  const fetchMember = async () => {
    try {
      if (isFetching) return;
      setIsFetching(true);
      setFetchMessage("กำลังตรวจสอบข้อมูลสมาชิก...");
      setIsCheckMember(true);

      const { error, message, data } = await checkValue(isScanData);

      const cleanedData = data.replace(/\[.*?\]/, ""); // ตัดข้อความที่อยู่ในวงเล็บ []

      if (!error) {
        // ถ้า error เป็น false (เรียก API สำเร็จ)
        setFetchMessage("ตรวจสอบข้อมูลสมาชิกสำเร็จ");
        setScanData(isScanData); // เอาข้อมูล ไปใส่ใน setScanData

        toast({
          title: "ตรวจสอบเลขสมาชิกสำเร็จ: " + message,
          description: cleanedData || "พบเลขสมาชิก",
          variant: "success",
        });

        const delay = (ms: number) =>
          new Promise((resolve) => setTimeout(resolve, ms));
        await delay(2000);
        dismissAll();
        setIsScanning(false); // เปลี่ยนสถานะการสแกนไปรอชำระเงิน
        fetchUser();
      } else {
        clearPage();
        toast({
          title: "ตรวจสอบรหัสสมาชิค :" + message,
          description: cleanedData || "ไม่พบเลขสมาชิก",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      console.error("[ERROR fetchMember]", err.message);
      setIsReady("error");
      setMassage("ไม่สามารถตรวจสอบหมายเลขสมาชิคได้! กรุณาติดต่อเจ้าหน้าที่");
    }
  };

  // step 4 : เริ่มการขาย
  const handleStartSale = async () => {
    const saleAmountNum = Number(saleAmount);

    if (!machineUsed || !isScanData || isScanData.length === 0) return;

    if (saleAmountNum > 0) {
      setIsStart(true);

      try {
        const machineId = machineUsed.id;
        if (!machineId) {
          return;
        }

        const { success, wipId, transactionId, error } = await posWmSale({
          machineId,
          amount: saleAmountNum,
          remarks: isScanData,
        });

        if (success && wipId && transactionId) {
          // fetchUser();
          router.push(
            `/pos-wm/proc?wip=${wipId}&transactionId=${transactionId}&amount=${saleAmountNum}&memberId=${isScanData}&userId=${isUser}`
          );
        } else {
          let translatedMessage =
            "ไม่สามารถเริ่มทำรายการได้! กรุณาติดต่อเจ้าหน้าที่.";

          if (error) {
            if (error.includes("Low 'Cash in stacker' error.")) {
              translatedMessage = "เงินทอนต่ำกว่ากำหนด กรุณาเติมเงินทอน";
            }
          }

          setMassage(translatedMessage);
          setIsReady("error");
          console.error("[ERROR] posWmSale", error);
        }
      } catch (err: any) {
        setIsReady("error");
        console.error("[ERROR] handleStartSale", err.message);
        setMassage("ไม่สามารถเริ่มทำรายการได้! กรุณาติดต่อเจ้าหน้าที่");
      } finally {
        setIsStart(false);
      }
    }
  };

  // action ปุ่มระบุยอด
  const handleNumpadClick = (value: string) => {
    setSaleAmount((prev) => {
      switch (value) {
        case "C":
          return "0"; // รีเซ็ตยอดเมื่อกด C
        case ".": // สำหรับการเพิ่มจุดทศนิยม
          if (prev.includes(".")) return prev; // ป้องกันการเพิ่มจุดทศนิยมซ้ำ
          return prev === "0" ? "0." : prev + ".";
        case "Del": // ลบตัวเลข
          return prev.length > 1 ? prev.slice(0, -1) : "0";
        case "+0.25": // สำหรับการเพิ่ม 0.25
          return (parseFloat(prev) + 0.25).toFixed(2); // เพิ่ม 0.25 และแสดงเป็นทศนิยม 2 ตำแหน่ง
        default: {
          // เมื่อกดตัวเลข 0-9
          if (prev === "0") {
            return value; // ถ้าค่าปัจจุบันเป็น 0 ให้แสดงเป็นตัวเลขที่กด
          } else {
            // ถ้ามีจุดทศนิยมแล้วให้แสดงตัวเลขที่หลักหน่วย
            if (prev.includes(".")) {
              const [integerPart] = prev.split(".");
              return integerPart + value; // เพิ่มตัวเลขไปที่หลักหน่วย
            }
            // ถ้ายังไม่มีจุดทศนิยม
            return prev + value; // เพิ่มตัวเลขไปที่หลักหน่วย
          }
        }
      }
    });
  };

  // แปลงค่าที่รับ เป็น num ก่อนขาย
  const formatNumber = (value: string) => {
    return new Intl.NumberFormat("en-US", {}).format(Number(value));
  };

  const handleDialogClose = async () => {
    router.push("/operation");
  };

  // ฟังก์ชัน clearPage
  const clearPage = () => {
    setIsReady("start");
    setSaleAmount("0");
    setScanData(""); // รีเซ็ตข้อมูลที่กรอก
    setIsScanning(true); // เปลี่ยนสถานะเป็นการสแกนใหม่
    setIsFetching(false); // รีเซ็ตสถานะการโหลดข้อมูล
    setIsCheckMember(false); // รีเซ็ตการตรวจสอบสมาชิก
    setFetchMessage(
      "______________ หรือกรอกรหัสสมาชิกด้วยตัวเองแล้วกด Enter ______________"
    ); // รีเซ็ตข้อความที่แสดง
    dismissAll(); // ปิดทุก toast ที่เปิดอยู่
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100); // ดีเลย์นิดหน่อยเพื่อให้ DOM render เสร็จ
  };

  const fetchUser = async () => {
    try {
      const { success, data, message } = await FetchUser(isName);

      if (success) {
        console.log("[DEBUG]", data);
      } else {
        console.error("[ERROR] FetchUser", { success, data, message });
      }
    } catch (err: any) {
      console.error("[ERROR] fetchUser", err.message);
    }
  };

  /* eslint-disable */

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && session) {
      dismissAll();
      if (!session.user.permissions.includes("MINI_POS")) {
        redirect("/operation");
      }

      if (!session.user.id && !session.user.code && !session.user.name) {
        redirect("/operation");
      } else {
        setUser(session.user.code);
        setName(session.user.name || "");
      }

      if (!machineUsed) {
        redirect("/operation");
      }

      checkInventory();
    }
  }, [isClient, session, machineUsed]);

  useEffect(() => {
    if (isReady === "error") {
      setIsOpen(true);
    }
  }, [isReady]);
  /* eslint-enable */
  return (
    <>
      <LoadingDialogCJComponent
        isOpen={isOpen}
        massage={massage}
        status={isReady}
        handleDialogClose={handleDialogClose}
      />
      <div className="flex h-screen w-screen items-center justify-center gap-2 bg-slate-100">
        {isScanning && !isOpen && (
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
                // onClick={fetchUser}
              >
                ยืนยัน
              </button>
            </div>
          </div>
        )}

        {!isScanning && !isOpen && (
          <div className="flex h-screen w-screen items-center justify-center gap-4 bg-slate-100">
            {/* กรอบนอก */}
            <div className="flex h-[800px] w-[1200px] rounded-2xl border border-gray-200 shadow-2xl ">
              {/* กรอบด้านซ้าย */}
              <LeftPanel isScanData={isScanData} clearPage={clearPage} />
              {/* กรอบด้านขวา */}
              <div className="flex h-full w-1/2 flex-col items-center justify-between rounded-2xl bg-white p-6">
                <div className="mb-2 w-full text-center text-4xl text-gray-900">
                  กรุณาระบุยอดเงินที่ต้องการจ่าย
                </div>

                <div className="my-6 flex h-20 w-full items-center justify-center rounded-md border-2 border-gray-300 bg-slate-50 text-center text-6xl tracking-widest text-gray-900 shadow-inner md:h-[140px]">
                  <span>{formatNumber(saleAmount)}</span>
                </div>

                <div className="mb-6 w-full text-center text-2xl text-gray-900">
                  บาท
                </div>

                <div className="mb-6 grid w-full grid-cols-3 gap-3">
                  {MAIN_NUMPAD.map((val) => (
                    <NumpadButton
                      key={val}
                      val={val}
                      onClick={handleNumpadClick}
                      className={val === "0" ? "col-span-2" : ""}
                    />
                  ))}

                  {/* <Button
                    className="h-20 rounded-md border border-black bg-blue-50 p-3 text-center text-4xl text-black hover:bg-slate-900 hover:text-white"
                    variant="outline"
                    value={"C"}
                    onClick={(e) => handleNumpadClick(e.currentTarget.value)}
                  >
                    C
                  </Button> */}

                  <NumpadButton val={"C"} onClick={handleNumpadClick} />
                </div>

                <div className="mb-4 w-full">
                  <Button
                    type="button"
                    className="h-24 w-full border-2 border-black bg-blue-800 text-4xl text-white hover:bg-zinc-800"
                    variant="default"
                    onClick={() => handleStartSale()}
                    disabled={isStart || isConfirmDisabled}
                  >
                    {isStart
                      ? "Starting..."
                      : isConfirmDisabled
                        ? "Cannot Sale"
                        : "ชำระเงิน"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default PosPage;
