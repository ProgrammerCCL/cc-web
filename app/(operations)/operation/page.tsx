"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";

function AdminPage() {
  const { data: session } = useSession();
  const permissions = session?.user.permissions || [];
  const isAuthorizeMiniPos = permissions.includes("MINI_POS");
  const isAuthorizedBackOffice = permissions.includes("BACK_OFFICE");

  return (
    <div className="grid h-dvh w-full grid-cols-2 content-center justify-items-center ">
      <div className="text-center">
        <div
          className={`h-full content-center ${isAuthorizedBackOffice ? "transition-transform duration-300 hover:scale-110" : ""}`}
        >
          <Link
            href={isAuthorizedBackOffice ? "/admin" : "#"}
            className={
              isAuthorizedBackOffice ? "" : "cursor-not-allowed blur-sm"
            }
          >
            <Image
              src={"/assets/images/office-2.jpg"}
              alt="CI-10"
              width={325}
              height={325}
            />
            <p className="pt-3">Back Office</p>
          </Link>
        </div>
      </div>

      <div className="text-center">
        <div
          className={
            isAuthorizeMiniPos
              ? "transition-transform duration-300 hover:scale-110"
              : ""
          }
        >
          <Link
            href={isAuthorizeMiniPos ? "/pos-wm" : "#"}
            className={isAuthorizeMiniPos ? "" : "cursor-not-allowed blur-sm"}
          >
            <Image
              src={"/assets/images/kiosk-pos.png"}
              alt="CI-10"
              width={250}
              height={250}
            />
            <p>Mini POS</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
