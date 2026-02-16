"use client";

// import env from "@/env";
import { IMachineData } from "@/types/model";
import { List, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { MachineSelect } from "@/components/machine";
import { getMachineSelectionList } from "@/lib/actions/machine.actions";

function MachinePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [machines, setMachines] = useState<IMachineData[]>([]);

  const fetchMachine = async () => {
    const mamchineList = await getMachineSelectionList();
    setMachines(mamchineList);
    setIsLoading(false);
  };

  /* eslint-disable */
  useEffect(() => {
    fetchMachine();
  }, []);
  /* eslint-enable */

  return (
    <div className="h-dvh w-full content-center justify-items-center">
      <div className="text-center text-3xl tracking-wider">
        {machines?.length > 0 ? (
          <p className="mb-5 mt-10 flex items-center justify-center gap-2 rounded-lg border-2 border-black p-4 text-2xl">
            <List className="mr-2" /> {/* ไอคอนที่สื่อถึงการเลือกเครื่อง */}
            กรุณาเลือกเครื่อง
          </p>
        ) : isLoading ? (
          <p className="w-96 rounded-lg border border-slate-500 p-5 text-slate-700">
            กำลังโหลดข้อมูลเครื่อง ...
            <Loader2 className="mx-auto animate-spin" width={50} height={50} />
          </p>
        ) : (
          <p className="w-96 rounded-lg border border-red-500 bg-red-500 p-5 text-white">
            ไม่มีการเชื่อมต่อ server
            <Loader2 className="mx-auto animate-spin" width={50} height={50} />
          </p>
        )}
      </div>

      <div
        className={`grid ${machines.length === 1 ? "grid-cols-1" : "grid-cols-3"} content-center justify-items-center gap-4 pt-5`}
      >
        {!isLoading &&
          machines?.map((machine: IMachineData) => (
            <div
              key={machine.id}
              className="rounded-lg border-2 border-gray-500 p-2 hover:border-white"
            >
              <MachineSelect key={machine.id} machine={machine} />
            </div>
          ))}
      </div>
    </div>
  );
}

export default MachinePage;
