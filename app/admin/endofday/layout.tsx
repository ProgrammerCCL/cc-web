import { EndofDayContextProvider } from "@/context";
import { ReactNode } from "react";

const EndofDayLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex size-full flex-col justify-evenly bg-slate-100 pb-16">
      <EndofDayContextProvider>{children}</EndofDayContextProvider>
    </div>
  );
};

export default EndofDayLayout;
