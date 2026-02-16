"use client";

import { redirect, useRouter } from "next/navigation";
import { useMachineContext } from "@/context";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { posSale } from "@/lib/actions/sale.actions";
import React, { useEffect, useState } from "react";
import { FooterMachine } from "@/components/minipos/footer/footer.componet";
import { getInventory } from "@/lib/actions/inventory.actions";
import { DialogComponent } from "@/components/shared/container";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

const MAIN_NUMPAD = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "0"];
const FRACTION_NUMPAD = [".25", ".50", ".75"];

// Inner component
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
        "hover:bg-customButonBlack rounded-xl border p-3 text-center text-base hover:text-white",
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

// Main Component
function PosPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();
  const { machineUsed } = useMachineContext();
  const [isStart, setIsStart] = useState(false);
  const [isConfirmDisabled, setIsConfirmDisabled] = useState(false);
  const [saleAmount, setSaleAmount] = useState("0");
  const [massage, setMassage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isError, setIsError] = useState(false);
  const [headerFinish, setHeaderFinish] = useState("เครื่องกำลังทำงาน");

  if (!session?.user.permissions.includes("MINI_POS")) {
    redirect("/operation");
  }

  const handleNumpadClick = (value: string) => {
    setSaleAmount((prev) => {
      switch (value) {
        case "C":
          return "0";
        case ".":
          if (prev.includes(".")) return prev;
          return prev === "0" ? "0." : prev + ".";
        case "Del":
          return prev.length > 1 ? prev.slice(0, -1) : "0";
        default:
          if (prev.includes(".")) {
            const [fraction] = prev.split(".");
            if (fraction.length >= 2) return prev;
          }
          return prev === "0" ? value : prev + value;
      }
    });
  };

  const handleStartSale = async () => {
    const saleAmountNum = Number(saleAmount);

    if (!machineUsed) {
      return;
    }

    if (saleAmountNum > 0) {
      setIsStart(true);

      try {
        const machineId = machineUsed.id;
        if (!machineId) {
          return;
        }

        const { success, wipId, transactionId, error } = await posSale({
          machineId,
          amount: saleAmountNum,
        });

        if (success && wipId && transactionId) {
          router.push(
            `/minipos/proc?wip=${wipId}&transactionId=${transactionId}`
          );
        } else {
          toast({
            title: "Create Sale Error",
            description: error || "Sale API returned unsuccessful response.",
            variant: "destructive",
          });
        }
      } catch (err: any) {
        console.error("[ERROR]", err.message);
        toast({
          title: "Create Sale Error",
          description: "Something went wrong at CI API server. " + err.message,
          variant: "destructive",
        });
      } finally {
        setIsStart(false);
      }
    }
  };

  const formatNumber = (value: string) => {
    return new Intl.NumberFormat("en-US").format(Number(value));
  };

  // เช็ค Inventory ตอนเริ่ม
  const checkInventory = async () => {
    try {
      setIsOpen(true);
      setHeaderFinish("กำลังตรวจสอบความพร้อมเครื่อง");
      setMassage("กรุณารอสักครู่");
      const { success, message } = await getInventory();

      if (success && massage) {
        setIsConfirmDisabled(true);
        toast({
          title: "CheckInventory",
          description: `${message}\n"กรุณาตรวจสอบ กล่องยอดขาย`,
        });
      }

      setIsOpen(false);
    } catch (err: any) {
      setIsConfirmDisabled(true);
      setIsError(true);
      setMassage("เครื่องเกิดข้อผิดพลาด! กรุณาติดต่อเจ้าหน้าที่");
      console.error("[ERROR] checkInventory Failed", err.message);
    }
  };

  /* eslint-disable */
  useEffect(() => {
    checkInventory();
  }, []);
  /* eslint-enable */

  return (
    <div className="flex h-screen w-screen  items-center justify-center gap-2 bg-white">
      <div>
        <DialogComponent
          isOpen={isOpen}
          massage={massage}
          isError={isError}
          headerFinish={headerFinish}
        />
        <div className="flex min-h-[550px] min-w-[450px] flex-col justify-center gap-3 rounded-lg border-2 border-slate-800 bg-slate-200 p-3">
          <div className="mx-auto h-[90px] w-5/6 rounded-lg bg-white p-2 text-right text-[48px]">
            <span>{formatNumber(saleAmount)}</span>
          </div>
          <div className="mx-auto mt-1 grid w-5/6 grid-cols-3 gap-3 rounded-lg bg-slate-100 p-3 text-[25px]">
            {MAIN_NUMPAD.map((val) => (
              <NumpadButton
                key={val}
                val={val}
                onClick={handleNumpadClick}
                className={val === "0" ? "col-span-2" : ""}
              />
            ))}

            {/* C Button */}
            <Button
              className="rounded-xl border bg-rose-200 p-3 text-center text-base hover:bg-red-700 hover:text-white"
              variant="outline"
              value={"C"}
              onClick={(e) => handleNumpadClick(e.currentTarget.value)}
            >
              C
            </Button>
          </div>

          {/* Fractions */}
          <div className="mx-auto mt-1 grid w-5/6 grid-cols-3 gap-3 rounded-lg  bg-slate-100 p-3 text-[25px]">
            {FRACTION_NUMPAD.map((val) => (
              <NumpadButton
                key={val}
                val={val}
                onClick={handleNumpadClick}
                className={val === "0" ? "col-span-2" : ""}
              />
            ))}
          </div>

          <div className="flex justify-center ">
            <Button
              type="button"
              className="bg-[#1c426d] "
              variant="default"
              style={{ width: "350px", height: "60px", fontSize: "1.5rem" }}
              onClick={() => handleStartSale()}
              disabled={isStart || isConfirmDisabled}
            >
              {isStart
                ? "Starting..."
                : isConfirmDisabled
                  ? "Cannot Sale"
                  : "Confirm"}
            </Button>
          </div>
        </div>
        <FooterMachine />
      </div>
    </div>
  );
}

export default PosPage;
