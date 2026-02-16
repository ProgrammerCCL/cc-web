"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Loader } from "lucide-react";

export const LoadingDialog = ({ isOpen }: { isOpen: boolean }) => {
  //   const [open, setIsOpen] = useState(true);
  return (
    <Dialog open={isOpen}>
      <DialogContent>
        <DialogTitle className="hidden text-white">Loading..</DialogTitle>
        <DialogDescription />

        <div className="flex-center h-[200px] w-full flex-col gap-3 text-slate-700">
          <Loader size={50} className="animate-spin" />
          <span className="text-xl italic">Loading data ...</span>
        </div>
      </DialogContent>
    </Dialog>
  );
};
