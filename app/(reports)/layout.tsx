import { ReactNode, Suspense } from "react";
import { NavBarComponent } from "@/components/backoffice/navbar";
// import { SideBarComponent } from "@/components/backoffice/sidebar";

function ReportLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <NavBarComponent />
      {/* <div className="mx-auto flex w-full lg:w-4/5"> */}
      <div className="mt-16 w-full">
        {/* <SideBarComponent /> */}
        <Suspense>{children}</Suspense>
      </div>
    </>
  );
}

export default ReportLayout;
