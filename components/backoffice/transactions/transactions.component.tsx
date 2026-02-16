"use client";

import { IMachineApiData } from "@/types/model";
import { Label } from "@/components/ui/label";

interface WithDrawItemProps {
  trWIP: IMachineApiData | null | undefined;
  isShow: boolean;
}

export function TransactionsComponent(props: WithDrawItemProps) {
  const { trWIP, isShow } = props;

  return (
    <div>
      {isShow === false || !trWIP ? (
        <div className="my-6 rounded-lg bg-slate-100 py-8 text-center italic tracking-wide">
          <Label className="text-lg text-slate-400">- No data -</Label>
        </div>
      ) : (
        <div className="mx-auto grid w-[450px] justify-center gap-4 py-10">
          <div className="flex">
            <Label className="flex items-center justify-between">
              <span className="w-[100px]">ID</span>
              <span className="w-[30px]">:</span>
            </Label>
            <Label className="w-full rounded-sm border p-2 text-center font-normal">
              {trWIP.id}
            </Label>
          </div>
          <div className="flex">
            <Label className="flex items-center justify-between">
              <span className="w-[100px]">WipID</span>
              <span className="w-[30px]">:</span>
            </Label>
            <Label className="w-full rounded-sm border p-2 text-center font-normal">
              {trWIP.reqID}
            </Label>
          </div>
          <div className="flex">
            <Label className="flex items-center justify-between">
              <span className="w-[100px]">ClientReqId</span>
              <span className="w-[30px]">:</span>
            </Label>
            <Label className="w-full rounded-sm border p-2 text-center font-normal">
              {trWIP.clientReqID}
            </Label>
          </div>
          <div className="flex">
            <Label className="flex items-center justify-between">
              <span className="w-[100px]">Request</span>
              <span className="w-[30px]">:</span>
            </Label>
            <Label className="w-full rounded-sm border p-2 text-center font-normal">
              {trWIP.request}
            </Label>
          </div>
          <div className="flex">
            <Label className="flex items-center justify-between">
              <span className="w-[100px]">Amount</span>
              <span className="w-[30px]">:</span>
            </Label>
            <Label className="w-full rounded-sm border p-2 text-center font-normal">
              {trWIP.amount}
            </Label>
          </div>
          <div className="flex">
            <Label className="flex items-center justify-between">
              <span className="w-[100px]">Cash In</span>
              <span className="w-[30px]">:</span>
            </Label>
            <div className="grid w-full gap-1">
              {trWIP.denom.map(
                (denom, index) =>
                  denom.iscashin === "True" && (
                    <Label
                      key={index}
                      className="w-full rounded-sm border p-2 text-center font-normal"
                    >
                      {denom.denom || 0} x {denom.qty || 0}
                    </Label>
                  )
              )}
            </div>
          </div>
          <div className="flex">
            <Label className="flex items-center justify-between">
              <span className="w-[100px]">Cash Out</span>
              <span className="w-[30px]">:</span>
            </Label>
            <div className="grid w-full gap-1">
              {trWIP.denom.map(
                (denom, index) =>
                  denom.iscashin === "False" && (
                    <Label
                      key={index}
                      className="rounded-sm border p-2 text-center font-normal"
                    >
                      {denom.denom || 0} x {denom.qty || 0}
                    </Label>
                  )
              )}
            </div>
          </div>
          <div className="flex">
            <Label className="flex items-center justify-between">
              <span className="w-[100px]">CreatedAt</span>
              <span className="w-[30px]">:</span>
            </Label>
            <div className="grid w-full gap-1">
              <Label className="w-full rounded-sm border p-2 text-center font-normal">
                {new Date(trWIP.dateTimeFinish || "").toLocaleDateString()}
              </Label>
              <Label className="w-full rounded-sm border p-2 text-center font-normal">
                {new Date(trWIP.dateTimeFinish || "").toLocaleTimeString()}
              </Label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
