"use client";

import { IMachineData } from "@/types/model";
import React from "react";
import Image from "next/image";

import { useMachineContext } from "@/context";
import { useRouter } from "next/navigation";

interface IMachineSelectProps {
  machine: IMachineData;
}

export const MachineSelect = ({ machine }: IMachineSelectProps) => {
  const router = useRouter();
  const { setMachineUsedState } = useMachineContext();
  const handleSelectMachine = () => {
    setMachineUsedState(machine);
    router.push("/operation");
  };
  return (
    <div className=" text-center">
      <div
        className="cursor-pointer transition-transform duration-300 hover:scale-110"
        onClick={() => handleSelectMachine()}
      >
        <Image
          src={"/assets/images/CI-10.jpg"}
          alt="CI-10"
          width={250}
          height={250}
        />
        <p>{machine.name}</p>
      </div>
    </div>
  );
};
