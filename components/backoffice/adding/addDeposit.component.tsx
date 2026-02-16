"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { IBathItem } from "@/types/model";

interface IBathItemProps {
  item: IBathItem;
  denomIn?: number;
}

export function AddingDepositComponents(props: IBathItemProps) {
  const { item, denomIn } = props;

  const currentDenomIn = denomIn ?? 0;

  if (currentDenomIn > 0) {
    return (
      <div className="p-2  ">
        <Card className="size-full border border-black">
          <div className="m-3 justify-center text-center font-semibold ">
            <Image
              className="mx-auto"
              src={item.imgURL}
              alt={item.key}
              width={item.isNote ? 115 : 55}
              height={item.isNote ? 40 : 25}
            />
            <p className="text-lg">THB {item.label}</p>
          </div>

          <div className="px-4 text-lg font-semibold">
            <div className="flex-between">
              <h3 className="text-blue-700">จำที่นับได้</h3>
              <h3 className="text-blue-700">{currentDenomIn}</h3>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // ถ้าทุกค่า <= 0 ไม่ต้องแสดงอะไรเลย (return null)
  return null;
}
