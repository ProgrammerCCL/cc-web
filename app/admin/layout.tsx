"use client";

import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { ReactNode, useEffect, useState } from "react";
import { NavBarComponent } from "@/components/backoffice/navbar";
import { SideBarComponent } from "@/components/backoffice/sidebar";
import { FetchUser } from "@/lib/actions/inventory.actions";

function AdminLayout({ children }: Readonly<{ children: ReactNode }>) {
  const [isClient, setIsClient] = useState(false);
  const { data: session } = useSession();
  const [isName, setName] = useState("");

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

  /* eslint-disable */
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      if (!session?.user.permissions.includes("BACK_OFFICE")) {
        redirect("/operation");
      }
      if (!session.user.id && !session.user.name) {
        redirect("/operation");
      } else {
        setName(session.user.name || "");
      }
    }
  }, [isClient]);

  // Prevent refresh command
  useEffect(() => {
    const preventReload = (event: KeyboardEvent) => {
      if ((event.ctrlKey && event.key === "r") || event.key === "F5") {
        event.preventDefault();
        console.log("Page refresh blocked!");
      }
    };

    window.addEventListener("keydown", preventReload);
    return () => window.removeEventListener("keydown", preventReload);
  }, []);

  useEffect(() => {
    fetchUser();
  }, [isName]);

  /* eslint-enable */

  return (
    <>
      <NavBarComponent />
      <div className="mt-16 flex">
        <SideBarComponent />
        <div className="w-full">{children}</div>
      </div>
    </>
  );
}

export default AdminLayout;
