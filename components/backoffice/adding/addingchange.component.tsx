"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { IBathItem } from "@/types/model";

interface IBathItemProps {
  item: IBathItem;
}

export function AddingchangeComponents(props: IBathItemProps) {
  const { item } = props;

  const stock = item.stock ?? 0;
  const needed = item.needed ?? 0;
  const denomInValue = item.cash ?? 0;

  const currentDenomIn = denomInValue; // เติมเพิ่ม
  const currentStock = stock + denomInValue; // ปัจจุบัน + เติมเพิ่ม
  const currentNeeded = Math.max(needed - currentStock, 0); // ขาดอีก (คำนวณจาก needed -  currentStock)

  // แสดงเฉพาะกรณีที่มีค่ามากกว่า 0
  return (
    <div className="h-full">
      <Card className="h-full">
        <div className="flex h-full flex-col justify-between p-4">
          <div className="text-center">
            <Image
              className="mx-auto"
              src={item.imgURL}
              alt={item.key}
              width={item.isNote ? 115 : 55}
              height={item.isNote ? 40 : 25}
            />
            <p className="text-lg font-semibold">THB {item.label}</p>
          </div>
          <div className="text-lg font-semibold">
            <div className="flex-between">
              <h3 className="">ปัจจุบัน</h3>
              <h3 className="">{currentStock}</h3>
            </div>
            <div className="flex-between">
              <h3 className="text-blue-700">เติมเพิ่ม</h3>
              <h3 className="text-blue-700">{currentDenomIn}</h3>
            </div>
            <div className="flex-between">
              <p className="text-red-500">ขาดอีก</p>
              <h3 className="text-red-500">{currentNeeded}</h3>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
