"use client";

import {
  CI5EOD,
  CI10EOD,
  CI10XEOD,
  CI50EOD,
  RefillNotice,
} from "@/components/endofday";
import moment from "moment";
import {
  createCollectCassete,
  createCollectRecheck,
  createUnlockCasset,
} from "@/lib/actions/collectCassete.actions";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { CircleChevronLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { redirect, useRouter } from "next/navigation";
import { getWIPv2ById } from "@/lib/actions/wip.actions";
import { useSidebarContext } from "@/context/sidebar.context";
import { getInventory } from "@/lib/actions/inventory.actions";
import { DialogComponent } from "@/components/shared/container";
import { useEndofDayContext, useMachineContext } from "@/context";
import { createFinishEndOfDay } from "@/lib/actions/endOfDay.actions";
import {
  getPrintReportData,
  printTransaction,
} from "@/lib/actions/print-report.actions";
import { PrintApiSchema } from "@/lib/validations/api-print.validation";
import { createRemoveCassete } from "@/lib/actions/removeCassete.action";
import React, { startTransition, useEffect, useRef, useState } from "react";
import { updateCashDetails } from "@/lib/actions/transactionUpdate.actions";
import { IDenomination, IInventoryItem, IMachineApiData } from "@/types/model";

interface IDenomQty {
  denom: string;
  qty: number;
}

export function WithdrawEndofday() {
  const router = useRouter();
  const { toast } = useToast();
  const calledRef = useRef(false);
  const { dismissAll } = useToast();
  const { data: session } = useSession();
  const [massage, setMassage] = useState("");
  const { machineUsed } = useMachineContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isUnlock, setIsUnlock] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { setStatusMachine } = useEndofDayContext();
  const [cassetAmount, setCassetAmount] = useState(0);
  const { disableAll, enableAll } = useSidebarContext();
  // const [stackerAmount, setStackerAmount] = useState(0);
  const [collecReady, setCollecReady] = useState("start");
  const [wipId, setWipId] = useState<number | null>(null);
  const [transId, setTransId] = useState<string | null>(null);
  const [choiceEodReady, setChoiceEodReady] = useState("start");
  const [cassetData, setCassetData] = useState<IDenomQty[]>([]);
  const [stackerData, setStackerData] = useState<IDenomQty[]>([]);
  const [headerFinish, setHeaderFinish] = useState("เครื่องกำลังทำงาน");
  const [refillpointData, setRefilPointData] = useState<IDenomQty[]>([]);
  const [EodProcessData, setEodProcessData] = useState<IMachineApiData | null>(
    null
  );

  // step 1 : ตรวจสอบสถานะเงินในเครื่อง แบบนำเงินออกหมด
  // const checkInventory = async () => {
  //   try {
  //     setIsOpen(true);
  //     setHeaderFinish("กำลังตรวจเงินในเครื่อง");
  //     setMassage("กรุณารอสักครู่");

  //     const { success, data, error } = await getInventory();

  //     setIsOpen(false);

  //     if (success && data && data.length > 0) {
  //       const formattedData = data.map((item: any) => ({
  //         denom: Number(item.denom) || 0,
  //         qty: Number(item.inStacker) || 0,
  //       }));

  //       setStackerData(
  //         formattedData.map((item) => ({
  //           denom: item.denom.toFixed(2),
  //           qty: item.qty,
  //         }))
  //       );

  //       const totalStacker = formattedData.reduce((total, item) => {
  //         return total + item.denom * item.qty;
  //       }, 0);
  //       setStackerAmount(totalStacker);

  //       const formattedDataCasset = data.map((item: any) => ({
  //         denom: Number(item.denom) || 0,
  //         qty: Number(item.inCassette) || 0,
  //       }));

  //       setCassetData(
  //         formattedDataCasset.map((item) => ({
  //           denom: item.denom.toFixed(2),
  //           qty: item.qty,
  //         }))
  //       );

  //       const totalCasset = formattedDataCasset.reduce((total, item) => {
  //         return total + item.denom * item.qty;
  //       }, 0);
  //       setCassetAmount(totalCasset);

  //       setCollecReady("ready");
  //       setChoiceEodReady("collect-all");
  //     } else if (error) {
  //       setCollecReady("error");
  //       console.error("[ERROR] action getInventory Failed", {
  //         success,
  //         error,
  //       });
  //       toast({
  //         title: "ไม่สามารถตรวจสอบสถานะเงินได้",
  //         description: error || "ตรวจสอบสถานะเงินไม่สำเร็จ",
  //         variant: "destructive",
  //       });
  //     }
  //   } catch (err: any) {
  //     setCollecReady("error");
  //     setMassage("การตรวจสอบสถานะเงินในเครื่องผิดพลาด !!");
  //     console.error("[ERROR] checkInventory Fial", err.message);
  //   }
  // };

  // step 1 : ตรวจสอบสถานะเงินในเครื่อง แบบเหลือเงินทอนตั้งต้น
  const checkInventoryKeepChange = async () => {
    try {
      setIsOpen(true);
      setHeaderFinish("กำลังตรวจสอบความพร้อมเครื่อง");
      setMassage("กรุณารอสักครู่");

      // step: 1 fetch API get Inventory
      const { success, data, error } = await getInventory();

      setIsOpen(false);
      // step: 2 เก็บค่าเงินที่อยู่ inStacker
      if (success && data && data.length > 0) {
        const formattedData = data.map((item: any) => ({
          denom: Number(item.denom) || 0,
          qty: Number(item.inStacker) || 0,
        }));

        setStackerData(
          formattedData.map((item) => ({
            denom: item.denom.toFixed(2),
            qty: item.qty,
          }))
        );

        // step: 3 เก็บค่าเงินที่อยู่ inCassette
        const formattedDataCasset = data.map((item: any) => ({
          denom: Number(item.denom) || 0,
          qty: Number(item.inCassette) || 0,
        }));

        setCassetData(
          formattedDataCasset.map((item) => ({
            denom: item.denom.toFixed(2),
            qty: item.qty,
          }))
        );

        const totalCasset = formattedDataCasset.reduce((total, item) => {
          return total + item.denom * item.qty;
        }, 0);

        setCassetAmount(totalCasset);

        // step: 4 เก็บค่าตั้งเงินตั้งต้น RefillPoint
        const formattedDataRefill = data.map((item: any) => ({
          denom: Number(item.denom) || 0,
          qty: Number(item.refillPoint) || 0,
        }));

        setRefilPointData(
          formattedDataRefill.map((item) => ({
            denom: item.denom.toFixed(2),
            qty: item.qty,
          }))
        );

        // step: 5 Check if any denom has inCassette less than refillPoint
        const isRefillError = data.some((item: any) => {
          return item.inStacker < item.refillPoint;
        });

        if (isRefillError) {
          setCollecReady("refill");
        } else {
          setCollecReady("ready");
          setChoiceEodReady("keep-change");
        }
      } else if (error) {
        console.error("[ERROR] action getInventory Failed", {
          success,
          error,
        });
        toast({
          title: "ไม่สามารถตรวจสอบสถานะเงินได้",
          description: error + ": ตรวจสอบสถานะเงินไม่สำเร็จ",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      setCollecReady("error");
      setMassage("การตรวจสอบสถานะเงินในเครื่องผิดพลาด !!");
      console.error("[ERROR] checkInventory Fial", err.message);
    }
  };

  // step 2 : เริ่มการปิดสิ้นวัน
  const handleStartCollectStart = async () => {
    try {
      if (!machineUsed) return;

      const machineId = machineUsed.id;

      if (!machineId) return;

      // if (choiceEodReady === "collect-all") {
      //   const stackAmountNum = Number(stackerAmount);
      //   const cassetAmountNum = Number(cassetAmount);

      //   const formattedDenomStacker = stackerData
      //     .filter((item) => Number(item.qty) > 0)
      //     .map((item) => ({
      //       denom: item.denom,
      //       qty: Number(item.qty),
      //     }));

      //   const isValidDataStacxker = formattedDenomStacker.every(
      //     (item) => item.denom && !isNaN(item.qty)
      //   );

      //   if (!isValidDataStacxker) {
      //     console.error(
      //       "ข้อมูล Inventory InStacker ไม่ถูกต้อง: ",
      //       formattedDenomStacker
      //     );
      //     toast({
      //       title: "Data Validation Error",
      //       description:
      //         "ข้อมูล Inventory InStacker ไม่ถูกต้อง กรุณาติดต่อเจ้าหน้าที่.",
      //       variant: "destructive",
      //     });
      //     return;
      //   }

      //   const formattedDenomCasset = cassetData
      //     .filter((item) => Number(item.qty) > 0)
      //     .map((item) => ({
      //       denom: item.denom,
      //       qty: Number(item.qty),
      //     }));

      //   const isValidDataCasset = formattedDenomCasset.every(
      //     (item) => item.denom && !isNaN(item.qty)
      //   );

      //   if (!isValidDataCasset) {
      //     console.error(
      //       "ข้อมูล Inventory InCassette ไม่ถูกต้อง: ",
      //       formattedDenomCasset
      //     );
      //     toast({
      //       title: "Data Validation Error",
      //       description:
      //         "ข้อมูล Inventory InCassette ไม่ถูกต้อง กรุณาติดต่อเจ้าหน้าที่.",
      //       variant: "destructive",
      //     });
      //     return;
      //   }

      //   // ตรวจสอบว่า formattedDenominations มีข้อมูลอยู่หรือไม่
      //   if (formattedDenomStacker.length !== 0) {
      //     const { success, wipId, id, error } = await createCollectCassete(
      //       {
      //         machineId,
      //         denominations: formattedDenomStacker,
      //       },
      //       stackAmountNum
      //     );

      //     if (success && wipId && id) {
      //       setTransId(id);
      //       setWipId(wipId);
      //       setCollecReady("wip");
      //       setStatusMachine("Collect");
      //       disableAll();
      //       return;
      //     } else {
      //       console.error(
      //         "[ERROR] action createCollectCassete Instacker collect-all Failed",
      //         {
      //           success,
      //           error,
      //         }
      //       );
      //       toast({
      //         title: "Start Collect Instacker Error",
      //         description:
      //           "ไม่สามารถนำเงินลงกล่องได้! กรุณาตรวจสอบความพร้อมเครื่อง",
      //         variant: "destructive",
      //       });
      //       return;
      //     }
      //   }
      //   if (formattedDenomCasset.length === 0) {
      //     toast({
      //       title: "Cannot close the end of the day.",
      //       description: "ไม่มีเงินที่ต้องนำออก",
      //       variant: "destructive",
      //     });
      //   } else {
      //     const { success, wipId, id, error } = await createRemoveCassete(
      //       {
      //         machineId,
      //       },
      //       cassetAmountNum
      //     );

      //     if (success && wipId && id) {
      //       setTransId(id);
      //       setWipId(wipId);
      //       setCollecReady("wip");
      //       setStatusMachine("Collect");
      //       setIsUnlock(true);
      //       disableAll();
      //     } else {
      //       console.error(
      //         "[ERROR] action createRemoveCassete Incassette collect-all Failed",
      //         {
      //           success,
      //           error,
      //         }
      //       );
      //       toast({
      //         title: "Start Collect Incassette Error",
      //         description:
      //           "ไม่สามารถนำเงินลงกล่องได้! กรุณาตรวจสอบความพร้อมเครื่อง",
      //         variant: "destructive",
      //       });
      //     }
      //   }
      // }
      if (choiceEodReady === "keep-change") {
        const cassetAmountNum = Number(cassetAmount);

        // step: 1 ตรวจสอบข้อมูลเงินที่อยู่ inCassette
        const formattedDenomStacker = stackerData
          .filter((item) => Number(item.qty) > 0)
          .map((item) => ({
            denom: item.denom,
            qty: Number(item.qty),
          }));

        const isValidDataStacxker = formattedDenomStacker.every(
          (item) => item.denom && !isNaN(item.qty)
        );

        if (!isValidDataStacxker) {
          console.error(
            "ข้อมูล Inventory InStacker ไม่ถูกต้อง: ",
            formattedDenomStacker
          );
          toast({
            title: "Data Validation Error",
            description:
              "ข้อมูล Inventory InStacker ไม่ถูกต้อง กรุณาติดต่อเจ้าหน้าที่.",
            variant: "destructive",
          });
          return;
        }

        // step: 2 ตรวจสอบข้อมูลเงินที่อยู่ inCassette
        const formattedDenomCasset = cassetData
          .filter((item) => Number(item.qty) > 0)
          .map((item) => ({
            denom: item.denom,
            qty: Number(item.qty),
          }));

        const isValidDataCasset = formattedDenomCasset.every(
          (item) => item.denom && !isNaN(item.qty)
        );

        if (!isValidDataCasset) {
          console.error(
            "ข้อมูล Inventory InCassette ไม่ถูกต้อง: ",
            formattedDenomCasset
          );
          toast({
            title: "Data Validation Error",
            description:
              "ข้อมูล Inventory InCassette ไม่ถูกต้อง กรุณาติดต่อเจ้าหน้าที่.",
            variant: "destructive",
          });
          return;
        }

        // step: 3 ตรวจสอบข้อมูลเงิน RefillPoint
        const formattedDenomRefillPoint = refillpointData
          .filter((item) => Number(item.qty) > 0)
          .map((item) => ({
            denom: item.denom,
            qty: Number(item.qty),
          }));

        const isValidDataRefillPoint = formattedDenomRefillPoint.every(
          (item) => item.denom && !isNaN(item.qty)
        );

        if (!isValidDataRefillPoint) {
          console.error(
            "ข้อมูล Inventory Refill Point ไม่ถูกต้อง: ",
            formattedDenomRefillPoint
          );

          toast({
            title: "Data Validation Error",
            description:
              "ข้อมูล Inventory Refill Point ไม่ถูกต้อง กรุณาติดต่อเจ้าหน้าที่.",
            variant: "destructive",
          });
          return;
        }

        // step: 4 คำนวณและหาค่าที่เหลือ
        const formattedDenomCollect = formattedDenomStacker
          .map((stackerItem) => {
            const refillItem = formattedDenomRefillPoint.find(
              (item) => item.denom === stackerItem.denom
            );

            if (refillItem) {
              // คำนวณค่าที่เหลือหลังจากลบ
              const remainingQty = stackerItem.qty - refillItem.qty;

              // ถ้าค่าที่เหลือมากกว่า 0 ให้เก็บใน collectData
              if (remainingQty > 0) {
                return { denom: stackerItem.denom, qty: remainingQty };
              }
            } else {
              return stackerItem;
            }

            // ถ้าค่าที่เหลือน้อยกว่าหรือเท่ากับ 0 ให้ไม่เก็บข้อมูล
            return null;
          })
          .filter((item) => item !== null); // กรองค่า null ออก

        // step: 5 คำนวณยอดรวมของ remainingQty
        const totalRemainingQty = formattedDenomCollect.reduce(
          (total, item) => total + item.qty,
          0
        );

        // ตรวจสอบว่า formattedDenominations มีข้อมูลอยู่หรือไม่
        if (formattedDenomCollect.length > 0) {
          const { success, wipId, id, error } = await createCollectCassete(
            {
              machineId,
              denominations: formattedDenomCollect,
            },
            totalRemainingQty
          );

          if (success && wipId && id) {
            setTransId(id);
            setWipId(wipId);
            setCollecReady("wip");
            setStatusMachine("Collect");
            disableAll();
          } else {
            console.error(
              "[ERROR] action createCollectCassete keep-change Failed",
              {
                success,
                error,
              }
            );
            toast({
              title: "Start Collect Instacker Error",
              description:
                "ไม่สามารถนำเงินลงกล่องได้! กรุณาตรวจสอบความพร้อมเครื่อง",
              variant: "destructive",
            });
          }
        } else if (formattedDenomCasset.length === 0) {
          toast({
            title: "Cannot end of the day.",
            description: "ไม่มีเงินในเครื่องที่ต้องนำออก",
            variant: "destructive",
          });
        } else if (formattedDenomCasset.length > 0) {
          const { success, wipId, id, error } = await createRemoveCassete(
            {
              machineId,
            },
            cassetAmountNum
          );

          if (success && wipId && id) {
            setTransId(id);
            setWipId(wipId);
            setCollecReady("wip");
            setStatusMachine("Collect");
            setIsUnlock(true);
            disableAll();
          } else {
            console.error(
              "[ERROR] action createRemoveCassete Incassette keep-change Failed",
              {
                success,
                error,
              }
            );
            toast({
              title: "Start Collect Incassette Error",
              description:
                "ไม่สามารถนำเงินลงกล่องได้! กรุณาตรวจสอบความพร้อมเครื่อง",
              variant: "destructive",
            });
          }
        }
      }
    } catch (err: any) {
      setCollecReady("error");
      setMassage("ไม่สามารถปิดสิ้นวันได้ เกิดข้อผิดพลาด !!");
      console.error("[ERROR] handleStartCollectStart Failed", err.message);
    }
  };

  // step 3 : ตรวจสอบสถานะรายการ
  const handleGetEodStatus = async () => {
    try {
      if (!wipId) return;

      const { success, data } = await getWIPv2ById({ id: wipId.toString() });

      if (success && data) {
        setEodProcessData(data);
      } else {
        setCollecReady("error");
        setMassage("การตรวจสอบสถานะการทำรายการผิดพลาด !!");
        console.error("[ERROR] action getWIPv2ById Failed", { success, data });
      }
    } catch (err: any) {
      setCollecReady("error");
      setMassage("การตรวจสอบสถานะการทำรายการผิดพลาด !!");
      console.error("[ERROR] handleGetEodStatus Failed", err.message);
    }
  };

  // step 4 : ปลดล๊อคกล่อง เหรียญและธนบัตร
  const handlerUnlockCasset = async (
    state: "coin" | "note" // ระบุประเภทของ state
  ) => {
    try {
      if (wipId !== null) {
        const UnlockCassetSuccess = await createUnlockCasset(wipId, isUnlock, {
          mc: state,
        });

        if (!UnlockCassetSuccess.success) {
          setCollecReady("error");
          setMassage("สั่งปลดล๊อคกล่องเงินไม่ได้ เกิดข้อผิดพลาด !! :" + state);
          console.error("[ERROR] action createUnlockCasset Failed", {
            state,
            UnlockCassetSuccess,
          });
        }
      } else {
        setCollecReady("error");
        setMassage("ไม่มีข้อมูลเลขรายการที่ต้องการสั่งปลดล๊อค :" + state);
        console.error("[ERROR] handlerUnlockCasset Failed wipId null");
      }
    } catch (err: any) {
      setCollecReady("error");
      setMassage("สั่งปลดล๊อคกล่องเงินไม่ได้ เกิดข้อผิดพลาด !!");
      console.error("[ERROR] handlerUnlockCasset Failed", err.message);
    }
  };

  // step 5 : ตรวจสอบสถานนะเหรียญในเครื่อง หลังจากใส่กล่องเหรียญกลับ
  const handleInventoryCheckCoin = async () => {
    try {
      if (!machineUsed) return;
      const machineId = machineUsed.id;
      if (!machineId || !transId || !wipId) return;

      const { success, data, error } = await getInventory();
      if (success && data && data.length > 0) {
        if (choiceEodReady === "collect-all") {
          // เช็คแบบนำเงินออกหมด
          const inventoryStacker = data.reduce(
            (agg, item: IInventoryItem) => {
              const dVal = item.value;
              const inStacker = item.inStacker || 0;
              if (dVal < 20 && inStacker > 0) {
                return [...agg, { denom: item.denom, qty: inStacker }];
              }
              return agg;
            },
            [] as { denom: string; qty: number }[]
          );
          if (inventoryStacker.length > 0) {
            const params = {
              machineId,
              denominations: inventoryStacker,
            };
            const result = await createCollectRecheck(params, transId, wipId);

            if (result.success) {
              setStatusMachine("CoinCollect");
            } else {
              setCollecReady("error");
              setMassage(
                "ไม่สามารถสั่งนำเหรียญลงกล่องส่วนที่เหลือได้ เกิดข้อผิดพลาด !!"
              );
              console.error("[ERROR] action createCollectRecheck Coin Failed", {
                result,
              });
            }
          } else {
            const inventoryCasset = data.reduce(
              (agg, item: IInventoryItem) => {
                const dVal = item.value;
                const inventoryQty = item.inCassette || 0;
                if (dVal < 20 && inventoryQty > 0) {
                  return [...agg, { denom: item.denom, qty: inventoryQty }];
                }
                return agg;
              },
              [] as { denom: string; qty: number }[]
            );

            if (inventoryCasset.length > 0) {
              setStatusMachine("CoinIncasset");
            } else {
              setStatusMachine("Note1");
            }
          }
        } else if (choiceEodReady === "keep-change") {
          const inventoryCasset = data.reduce(
            (agg, item: IInventoryItem) => {
              const dVal = item.value;
              const inventoryQty = item.inCassette || 0;
              if (dVal < 20 && inventoryQty > 0) {
                return [...agg, { denom: item.denom, qty: inventoryQty }];
              }
              return agg;
            },
            [] as { denom: string; qty: number }[]
          );

          const excessStacker = data.reduce(
            (agg, item: IInventoryItem) => {
              const dVal = item.value;
              const inStacker = item.inStacker || 0;
              const refillPoint = item.refillPoint || 0;
              if (dVal < 20 && inStacker > refillPoint) {
                const excess = inStacker - refillPoint;
                return [...agg, { denom: item.denom, qty: excess }];
              }
              return agg;
            },
            [] as { denom: string; qty: number }[]
          );

          if (inventoryCasset.length > 0) {
            setStatusMachine("CoinIncasset");
          } else if (excessStacker.length > 0) {
            const params = { machineId, denominations: excessStacker };
            const result = await createCollectRecheck(params, transId, wipId);

            if (result.success) {
              setStatusMachine("CoinCollect");
            } else {
              setCollecReady("error");
              setMassage(
                "ไม่สามารถสั่งนำเหรียญลงกล่องส่วนที่เหลือได้ เกิดข้อผิดพลาด !!"
              );
              console.error("[ERROR] action createCollectRecheck Coin Failed", {
                success,
                error,
              });
            }
          } else {
            setStatusMachine("Note1");
          }
        }
      } else if (error) {
        setCollecReady("error");
        setMassage("การตรวจสอบเหรียญในเครื่อง เกิดข้อผิดพลาด !!");
        console.error("[ERROR] action getInventory Coin Failed", {
          success,
          error,
        });
      }
    } catch (err: any) {
      setCollecReady("error");
      setMassage("การตรวจสอบเหรียญในเครื่อง เกิดข้อผิดพลาด !!");
      console.error("[ERROR] handleInventoryCheckCoin Failed", err.message);
    }
  };

  // step 6 : ตรวจสอบสถานนะธนบัตรในเครื่อง หลังจากใส่กล่องธนบัตรกลับ
  const handleInventoryCheckNote = async () => {
    try {
      if (!machineUsed) return;
      const machineId = machineUsed.id;
      if (!machineId || !transId || !wipId) return;

      const { success, data, error } = await getInventory();

      if (success && data && data.length > 0) {
        if (choiceEodReady === "collect-all") {
          const inventoryStacker = data.reduce(
            (agg, item: IInventoryItem) => {
              const dVal = item.value;
              const inStacker = item.inStacker || 0;
              if (dVal > 10 && inStacker > 0) {
                return [...agg, { denom: item.denom, qty: inStacker }];
              }
              return agg;
            },
            [] as { denom: string; qty: number }[]
          );

          const inventoryCasset = data.reduce(
            (agg, item: IInventoryItem) => {
              const dVal = item.value;
              const inventoryQty = item.inCassette || 0;
              if (dVal > 10 && inventoryQty > 0) {
                return [...agg, { denom: item.denom, qty: inventoryQty }];
              }
              return agg;
            },
            [] as { denom: string; qty: number }[]
          );

          if (inventoryStacker.length > 0) {
            const params = {
              machineId,
              denominations: inventoryStacker,
            };
            const result = await createCollectRecheck(params, transId, wipId);
            if (result.success) {
              setStatusMachine("NoteCollect");
            } else {
              setCollecReady("error");
              setMassage(
                "ไม่สามารถสั่งนำธนบัตรลงกล่องส่วนที่เหลือได้ เกิดข้อผิดพลาด !!"
              );
              console.error("[ERROR] action createCollectRecheck Note Failed", {
                result,
              });
            }
          } else {
            if (inventoryCasset.length > 0) {
              setStatusMachine("NoteIncasset");
            } else {
              if (machineUsed.model === "CI-05B") {
                setStatusMachine("Note4");
              } else if (machineUsed.model === "CI-10B") {
                setStatusMachine("Note7");
              } else if (machineUsed.model === "CI-10BX") {
                setStatusMachine("Note7");
              } else if (machineUsed.model === "CI-50B") {
                setStatusMachine("Note6");
              }
            }
          }
        } else if (choiceEodReady === "keep-change") {
          const inventoryCasset = data.reduce(
            (agg, item: IInventoryItem) => {
              const dVal = item.value;
              const inventoryQty = item.inCassette || 0;
              if (dVal > 10 && inventoryQty > 0) {
                return [...agg, { denom: item.denom, qty: inventoryQty }];
              }
              return agg;
            },
            [] as { denom: string; qty: number }[]
          );

          const excessStacker = data.reduce(
            (agg, item: IInventoryItem) => {
              const dVal = item.value;
              const inStacker = item.inStacker || 0;
              const refillPoint = item.refillPoint || 0;
              if (dVal > 10 && inStacker > refillPoint) {
                const excess = inStacker - refillPoint;
                return [...agg, { denom: item.denom, qty: excess }];
              }
              return agg;
            },
            [] as { denom: string; qty: number }[]
          );

          if (inventoryCasset.length > 0) {
            setStatusMachine("NoteIncasset");
          } else if (excessStacker.length > 0) {
            const params = { machineId, denominations: excessStacker };
            const result = await createCollectRecheck(params, transId, wipId);

            if (result.success) {
              setStatusMachine("NoteCollect");
            } else {
              setCollecReady("error");
              setMassage(
                "ไม่สามารถสั่งนำธนบัตรลงกล่องส่วนที่เหลือได้ เกิดข้อผิดพลาด !!"
              );
              console.error("[ERROR] action createCollectRecheck Failed", {
                success,
                error,
              });
            }
          } else {
            if (machineUsed.model === "CI-05B") {
              setStatusMachine("Note4");
            } else if (machineUsed.model === "CI-10B") {
              setStatusMachine("Note7");
            } else if (machineUsed.model === "CI-10BX") {
              setStatusMachine("Note7");
            } else if (machineUsed.model === "CI-50B") {
              setStatusMachine("Note6");
            }
          }
        }
      } else if (error) {
        setCollecReady("error");
        setMassage("การตรวจสอบธนบัตรในเครื่อง เกิดข้อผิดพลาด !!");
        console.error("[ERROR] action getInventory Coin Failed", {
          success,
          error,
        });
      }
    } catch (err: any) {
      setCollecReady("error");
      setMassage("การตรวจสอบธนบัตรในเครื่อง เกิดข้อผิดพลาด !!");
      console.error("[ERROR] handleInventoryCheckNote Failed", err.message);
    }
  };

  // step 7 : Fetch endpoint FinishEndOfDay
  const handleFinishEndOfDay = async () => {
    try {
      if (wipId === null) {
        console.error("wipId is null, cannot proceed.");
        return;
      }
      const response = await createFinishEndOfDay(wipId);

      if (response.success) {
        setCollecReady("finished");
      } else {
        setCollecReady("error");
        setMassage("สั่งจบรายการปิดสิ้นวันไม่ได้ เกิดข้อผิดพลาด !!");
        console.error(
          "[ERROR] action createFinishEndOfDay Failed",
          response.error
        );
      }
    } catch (err: any) {
      setCollecReady("error");
      setMassage("สั่งจบรายการปิดสิ้นวันไม่ได้ เกิดข้อผิดพลาด !!");
      console.error("[ERROR] handleFinishEndOfDay Fail", err.message);
    }
  };

  // step 8 : อัพเดทฐานข้อมูล PG
  const handlerUpdateCashDetails = async (
    transactionId: string,
    cashIn: IDenomination[],
    cashOut: IDenomination[],
    amount: number,
    status: "wip" | "finish" | "cancel" | "error"
  ) => {
    try {
      const updateSuccess = await updateCashDetails(
        transactionId,
        cashIn,
        cashOut,
        amount,
        status
      );
      if (updateSuccess) {
        if (status === "finish" || status === "cancel") {
          setCollecReady("success");
          setStatusMachine("success");
          handlePrint();
        } else if (status === "error") {
          setCollecReady("error");
          setMassage("เครื่องทอนเงินขัดข้อง !!");
          console.error("[ERROR] status Machine Error");
        }
      } else {
        setCollecReady("error");
        setMassage("บันทึกข้อมูลการทำรายการปิดสิ้นวัน ผิดพลาด !!");
        console.error("[ERROR] action updateCashDetails Failed", {
          updateSuccess,
        });
      }
    } catch (err: any) {
      setCollecReady("error");
      setMassage("บันทึกข้อมูลการทำรายการปิดสิ้นวัน ผิดพลาด !!");
      console.error("[ERROR] handlerUpdateCashDetails Failed", err.message);
    }
  };

  const handlePrint = () => {
    startTransition(async () => {
      const today = moment().format("YYYY-MM-DD");
      const data = await getPrintReportData({ selectedDate: today });

      if (!data) {
        console.error("[getPrintReportData Fail]", data);
        return;
      }
      console.log("debug", data);

      const parsed = PrintApiSchema.safeParse(data);
      if (!parsed.success) {
        console.error("[Parse Error]", parsed.error.format());
        return;
      }

      const success = await printTransaction(parsed.data);
      if (success) {
        console.error("[Print Report Success]", success);
      } else {
        console.error("[Print Report Fail]", success);
      }
    });
  };

  // กดปิด Dialog กรณีเกิด Error
  const handleDialogClose = async () => {
    setIsOpen(false);
    dismissAll();
    enableAll();
    redirect("/admin");
  };

  // กดกลับหน้าหลัก
  const onClickBackHome = () => {
    dismissAll();
    router.push("/admin");
  };

  // ไปหน้าเติมเงินทอน
  const onClickRefill = () => {
    dismissAll();
    router.push("/admin/replenish");
  };

  /* eslint-disable */
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && session) {
      if (!session.user.permissions.includes("COLLECT_MONEY")) {
        redirect("/admin");
      }

      if (!machineUsed) {
        redirect("/operation");
      }

      checkInventoryKeepChange();
    }
  }, [isClient, session, machineUsed]);

  useEffect(() => {
    if (collecReady === "wip" || collecReady === "finished") {
      if (typeof wipId === "number") {
        const intervalId = setInterval(() => {
          handleGetEodStatus();
        }, 1500);
        return () => clearInterval(intervalId);
      }
    }
  }, [collecReady, wipId]);

  useEffect(() => {
    if (calledRef.current) return;

    if (EodProcessData) {
      if (!transId) {
        return;
      }

      const SPDDenoms = EodProcessData.denom || [];

      const cashInData = SPDDenoms.filter(
        (item) => item.iscashin === "True"
      ).map((item) => item);

      const cashOutData = SPDDenoms.filter(
        (item) => item.iscashin === "False"
      ).map((item) => item);

      if (EodProcessData.status === "Finished") {
        calledRef.current = true;
        handlerUpdateCashDetails(
          transId,
          cashInData,
          cashOutData,
          EodProcessData.amount,
          "finish"
        );
      } else if (EodProcessData.status === "ERROR") {
        calledRef.current = true;
        handlerUpdateCashDetails(
          transId,
          cashInData,
          cashOutData,
          EodProcessData.amount,
          "error"
        );
      }
    }
  }, [EodProcessData, transId]);

  useEffect(() => {
    if (collecReady === "success") {
      toast({
        title: "End of day Success",
        description: `ปิดสิ้นวันสำเร็จ`,
        variant: "success",
      });
      enableAll();
    } else if (collecReady === "error") {
      setIsOpen(true);
      setIsError(true);
      setHeaderFinish("กรุณาติดต่อเจ้าหน้าที่ Error !! ");
      enableAll();
    }
  }, [collecReady]);
  /* eslint-enable */

  return (
    <div>
      <DialogComponent
        isOpen={isOpen}
        isError={isError}
        massage={massage}
        headerFinish={headerFinish}
        onCloseCallback={handleDialogClose}
      />

      {/* {collecReady === "start" && (
        <EodChoice
          onFullWithdraw={checkInventory}
          onKeepChange={checkInventoryKeepChange}
        />
      )} */}

      {collecReady === "refill" && (
        <RefillNotice
          onClickBackHome={onClickBackHome}
          onClickRefill={onClickRefill}
        />
      )}
      {(collecReady === "ready" ||
        collecReady === "success" ||
        collecReady === "finished" ||
        collecReady === "wip") && (
        <>
          {machineUsed?.model === "CI-05B" && (
            <CI5EOD
              wipId={wipId}
              transId={transId}
              isUnlock={isUnlock}
              setIsOpen={setIsOpen}
              setIsError={setIsError}
              setMassage={setMassage}
              EodProcessData={EodProcessData}
              setCollecReady={setCollecReady}
              handlerUnlockCasset={handlerUnlockCasset}
              handleFinishEndOfDay={handleFinishEndOfDay}
              handleInventoryCheckCoin={handleInventoryCheckCoin}
              handleInventoryCheckNote={handleInventoryCheckNote}
            />
          )}

          {machineUsed?.model === "CI-10B" && (
            <CI10EOD
              wipId={wipId}
              transId={transId}
              isUnlock={isUnlock}
              setIsOpen={setIsOpen}
              setIsError={setIsError}
              setMassage={setMassage}
              EodProcessData={EodProcessData}
              setCollecReady={setCollecReady}
              handlerUnlockCasset={handlerUnlockCasset}
              handleFinishEndOfDay={handleFinishEndOfDay}
              handleInventoryCheckCoin={handleInventoryCheckCoin}
              handleInventoryCheckNote={handleInventoryCheckNote}
            />
          )}

          {machineUsed?.model === "CI-10BX" && (
            <CI10XEOD
              wipId={wipId}
              transId={transId}
              isUnlock={isUnlock}
              setIsOpen={setIsOpen}
              setIsError={setIsError}
              setMassage={setMassage}
              EodProcessData={EodProcessData}
              setCollecReady={setCollecReady}
              handlerUnlockCasset={handlerUnlockCasset}
              handleFinishEndOfDay={handleFinishEndOfDay}
              handleInventoryCheckCoin={handleInventoryCheckCoin}
              handleInventoryCheckNote={handleInventoryCheckNote}
            />
          )}

          {machineUsed?.model === "CI-50B" && (
            <CI50EOD
              wipId={wipId}
              transId={transId}
              isUnlock={isUnlock}
              setIsOpen={setIsOpen}
              setIsError={setIsError}
              setMassage={setMassage}
              EodProcessData={EodProcessData}
              setCollecReady={setCollecReady}
              handlerUnlockCasset={handlerUnlockCasset}
              handleFinishEndOfDay={handleFinishEndOfDay}
              handleInventoryCheckCoin={handleInventoryCheckCoin}
              handleInventoryCheckNote={handleInventoryCheckNote}
            />
          )}
        </>
      )}

      <div className="mx-auto mt-6 flex w-4/5 justify-between bg-slate-100">
        {(collecReady === "ready" || collecReady === "success") && (
          <Button
            className="hover:bg-customButonBlack flex h-[85px] w-full max-w-[30%] items-center justify-center gap-2 border-2 border-blue-950 bg-slate-50 text-blue-950 shadow-md hover:border-black hover:text-white"
            onClick={onClickBackHome}
          >
            <CircleChevronLeft width={30} height={30} />
            <span className="text-3xl ">กลับหน้าหลัก</span>
          </Button>
        )}
        {collecReady === "ready" && (
          <Button
            className="bg-customButon hover:bg-customButonBlack h-[85px] w-full max-w-[30%] border-2 border-blue-950 text-3xl text-white shadow-sm shadow-black hover:border-black "
            onClick={handleStartCollectStart}
          >
            เริ่มปิดสิ้นวัน
          </Button>
        )}
      </div>

      {/* {collecReady === "error" && (
        <DialogComponent
          isOpen={isOpen}
          isError={isError}
          massage={massage}
          onCloseCallback={handleDialogClose}
          headerFinish={headerFinish}
        />
      )} */}
    </div>
  );
}
