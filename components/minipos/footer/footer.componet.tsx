"use client";

import { User } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { useMachineContext } from "@/context";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { FetchUser } from "@/lib/actions/inventory.actions";

export const FooterMachine = () => {
  const { data: session } = useSession();
  const { machineUsed, setMachineUsedState } = useMachineContext();
  const router = useRouter();
  const [isName, setName] = useState("");
  const [authName, setAuthName] = useState("");

  const fetchUser = async () => {
    if (!isName) return;
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

  const logoutHandler = async () => {
    setMachineUsedState(undefined);
    await signOut();
  };
  /* eslint-disable */
  useEffect(() => {
    if (session) {
      const usr = session.user.name || "Unknow";
      setAuthName(usr);

      if (!session.user.id && !session.user.name) {
        redirect("/operation");
      } else {
        setName(session.user.name || "");
      }
    }
  }, [session]);

  useEffect(() => {
    fetchUser();
  }, [isName]);

  /* eslint-enable */
  return (
    <div className="absolute inset-x-0 bottom-4 flex h-16 justify-between border-t border-t-black p-4 md:px-6">
      <div className="grid grid-cols-2 gap-4">
        <Button
          type="button"
          variant="outline"
          className="flex items-center rounded-md border-2 border-red-500 bg-white p-2 text-lg text-red-500 hover:bg-red-500 hover:text-white"
          onClick={() => logoutHandler()}
        >
          <svg
            className="mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            width="20"
            height="20"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 16l4-4m0 0l-4-4m4 4H3"
            />
          </svg>
          {`Logout`}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="flex items-center rounded-md border-2 border-zinc-800 bg-white p-2 text-lg text-zinc-800 hover:bg-zinc-800 hover:text-white"
          onClick={() => router.push("/")}
        >
          <svg
            className="mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            width="20"
            height="20"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 7l-5 5 5 5m-5-5h12"
            />
          </svg>
          {`กลับสู่หน้าหลัก`}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex h-10 items-center justify-center rounded-md border-2 border-zinc-800 p-2 text-lg font-normal text-zinc-800">
          {machineUsed && machineUsed.name ? (
            <p>{machineUsed.name}</p>
          ) : (
            <p>-</p>
          )}
        </div>
        <div className="flex h-10 items-center justify-center rounded-md border-2 border-blue-600 p-2 text-lg font-normal text-blue-600">
          <User className="mr-2" />
          {authName}
        </div>
      </div>
    </div>
  );
};
