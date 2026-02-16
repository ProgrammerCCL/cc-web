"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { INavbarItem } from "@/types/share";
import { ADMIN_NAVBAR_CI } from "@/constants";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { HomeIcon, LogOut, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSidebarContext } from "@/context/sidebar.context";
import { signOut, useSession } from "next-auth/react";

export function NavBarComponent() {
  const { isDisable } = useSidebarContext();
  const [authName, setAuthName] = useState("");
  const pathName = usePathname();
  // const router = useRouter();

  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      setAuthName(session.user.name || "-");
    }
  }, [session]);

  return (
    <header className="fixed top-0 z-10 flex h-16 w-full items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="hidden w-full flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href={isDisable ? "#" : "/admin"}
          className={cn(
            "flex items-center gap-2 text-lg font-semibold md:text-base",
            !isDisable && pathName === "/admin"
              ? "font-bold underline text-lg text-black"
              : ""
          )}
        >
          <HomeIcon className="size-6" />
          <span className="sr-only">Acme Inc</span>
        </Link>
        {ADMIN_NAVBAR_CI.filter((i) => !i.disable).map((item: INavbarItem) => (
          <Link
            key={item.route}
            href={isDisable ? "#" : item.route}
            className={cn(
              "text-muted-foreground transition-colors hover:text-foreground",
              !isDisable &&
                (pathName === item.route || pathName.startsWith(item.route))
                ? "font-bold underline text-lg text-black"
                : ""
            )}
          >
            {item.key}
          </Link>
        ))}
      </nav>
      <div className="flex w-full items-center gap-4 bg-background md:ml-auto md:gap-2 lg:gap-4">
        <div className="ml-auto mr-12 flex items-center gap-4">
          {/* ไอคอน User */}
          <span className="flex h-10 items-center rounded-md border-2 border-black px-4 py-2 text-lg font-semibold">
            <User className="mr-2" /> {/* ไอคอน User */}
            {authName}
          </span>
          {/* ปุ่ม Logout พร้อมไอคอน */}
          <Button
            onClick={async (e) => {
              e.preventDefault();
              await signOut();
            }}
            className="flex h-10 items-center rounded-md border-2 border-red-500 bg-white px-4 py-2 text-lg font-semibold text-red-500 hover:bg-red-500 hover:text-white"
          >
            <LogOut className="mr-2" /> {/* ไอคอน Logout */}
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
