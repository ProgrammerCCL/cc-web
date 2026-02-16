import { RemoveCasseteContextProvider } from "@/context/removeCassete.context";
import { ReactNode } from "react";

const RemoveLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex size-full flex-col justify-evenly bg-slate-100 pb-14">
      <RemoveCasseteContextProvider>{children}</RemoveCasseteContextProvider>
    </div>
  );
};

export default RemoveLayout;
