"use client";

import Link from "next/link";
import Image from "next/image";
import { ADMIN_HOME_MENUS } from "@/constants";
import { INavbarItem } from "@/types/share";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

function AdminHomePage() {
  const { data: session } = useSession();

  return (
    <div className="mx-auto mt-12 w-full max-w-[900px] p-6 xl:max-w-[1100px]">
      <div className="grid grid-cols-2 gap-6">
        {ADMIN_HOME_MENUS.filter((item) => !item.disable && item.adminMain).map(
          (item: INavbarItem) => {
            const isAllow = session?.user.permissions.includes(item.permission);
            return (
              <Link key={item.key} href={isAllow ? item.route : "#"}>
                <div
                  className={cn(
                    "flex items-center justify-between rounded-2xl border-2 border-sky-800 bg-sky-900 p-5 shadow-md shadow-slate-400 ",
                    isAllow
                      ? "hover:bg-gray-900"
                      : "cursor-not-allowed bg-slate-400"
                  )}
                >
                  <div className=" text-white">
                    <p className="text-3xl font-bold">{item.th}</p>
                    <p className="text-xl">{item.en}</p>
                  </div>
                  <Image
                    className="hidden size-36 rounded-bl-full border-8 border-slate-100 p-5 lg:block"
                    src={item.imgURL}
                    alt={item.en}
                    width={28}
                    height={28}
                  />
                  <Image
                    className="size-24 rounded-3xl border-2 border-slate-100 p-5 lg:hidden"
                    src={item.imgURL}
                    alt={item.en}
                    width={28}
                    height={28}
                  />
                </div>
              </Link>
            );
          }
        )}
      </div>
    </div>
  );
}

export default AdminHomePage;
