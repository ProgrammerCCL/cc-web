"use client";

import { usePathname } from "next/navigation";
import { ADMIN_HOME_MENUS } from "@/constants";
import { useSession } from "next-auth/react";
import { SidebarItem } from "./sidebar-item.component";
import { Separator } from "@/components/ui/separator";

const FULL_ITEM_PATH = ["/admin", "/inventory", "/transactions", "/report"];

export function SideBarComponent() {
  const pathName = usePathname();
  const { data: session } = useSession();

  const generalMenus = ADMIN_HOME_MENUS.filter((item) => !item.isDanger);
  const dangerMenus = ADMIN_HOME_MENUS.filter((item) => item.isDanger);

  return FULL_ITEM_PATH.includes(pathName) ? (
    <div className="h-screen w-1/6 bg-slate-100 p-6">
      {/* Start: Desktop menu */}
      <h1 className="text-2xl font-semibold">Menu Function</h1>
      <nav className="mt-6 grid grid-cols-1 gap-2 text-sm text-muted-foreground">
        {generalMenus.map((item) => (
          <SidebarItem
            key={item.key}
            item={item}
            allow={session?.user.permissions.includes(item.permission)}
            active={item.route === pathName}
          />
        ))}

        {dangerMenus.length > 0 ? (
          <>
            <Separator className="mt-6 bg-red-500" />
            {dangerMenus.map((item) => (
              <SidebarItem
                key={item.key}
                item={item}
                allow={session?.user.permissions.includes(item.permission)}
                active={item.route === pathName}
                danger
              />
            ))}
          </>
        ) : null}
      </nav>
      {/* End: Desktop menu */}
    </div>
  ) : (
    <div className="m-7 h-screen">
      {/* <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            href="/admin"
            className="group flex size-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:size-8 md:text-base"
          >
            <Home size={20} />
          </Link>

          {generalMenus.map((item) => (
            <SidebarItem
              key={item.key}
              item={item}
              allow={session?.user.permissions.includes(item.permission)}
              active={item.route === pathName}
              small
            />
          ))}

          {dangerMenus.length > 0 ? (
            <>
              <Separator className="mt-4 bg-red-500" />
              {dangerMenus.map((item) => (
                <SidebarItem
                  key={item.key}
                  item={item}
                  allow={session?.user.permissions.includes(item.permission)}
                  active={item.route === pathName}
                  small
                  danger
                />
              ))}
            </>
          ) : null}
        </nav>
      </aside> */}
    </div>
  );
}
