"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import React from "react";
import { AlertCircle, CheckCircle, Loader, XCircle } from "lucide-react";
import { TStatusPageCJ } from "@/types/share";

interface LoadingDialogCJProps {
  isOpen: boolean;
  massage: string;
  status: TStatusPageCJ;
  handleDialogClose: () => void;
}

export function LoadingDialogCJComponent(props: LoadingDialogCJProps) {
  const { isOpen, massage, status, handleDialogClose } = props;

  return (
    <Dialog open={isOpen}>
      <DialogContent>
        {(() => {
          switch (status) {
            case "fetch":
              return (
                <>
                  <DialogTitle className="hidden text-white">
                    Loading..
                  </DialogTitle>
                  <DialogDescription />
                  <div className="flex-center h-[200px] w-full flex-col gap-3 text-slate-900">
                    <Loader size={50} className="animate-spin" />
                    <span className="text-xl italic">Loading data ...</span>
                  </div>
                </>
              );
            case "warning":
              return (
                <>
                  <DialogTitle className="hidden text-white">
                    Warning
                  </DialogTitle>
                  <DialogDescription />
                  <div className="flex-center h-[200px] w-full flex-col gap-3 text-slate-900">
                    <AlertCircle size={50} className="text-yellow-500" />
                    <span className="text-xl italic">แจ้งเตือน !!</span>
                    <span className="text-xl italic">{massage}</span>
                    <button
                      onClick={handleDialogClose}
                      className="mt-4 rounded-sm bg-yellow-500 px-6 py-2 text-white hover:bg-yellow-600"
                    >
                      กลับหน้าหลัก
                    </button>
                  </div>
                </>
              );
            case "finished":
              return (
                <>
                  <DialogTitle className="hidden text-white">
                    Success
                  </DialogTitle>
                  <DialogDescription />
                  <div className="flex-center h-[200px] w-full flex-col gap-3 text-slate-900">
                    <CheckCircle size={50} className="text-green-500" />
                    <span className="text-xl italic">Finished</span>
                    <span className="text-xl italic">{massage}</span>
                    {/* <button
                      onClick={handleDialogClose}
                      className="mt-4 rounded-sm bg-green-500 px-6 py-2 text-white hover:bg-green-600"
                    >
                      กลับหน้าหลัก
                    </button> */}
                  </div>
                </>
              );
            case "canceled":
              return (
                <>
                  <DialogTitle className="hidden text-white">
                    Canceled
                  </DialogTitle>
                  <DialogDescription />
                  <div className="flex-center h-[200px] w-full flex-col gap-3 text-slate-900">
                    <XCircle size={50} className="text-red-500" />
                    <span className="text-xl italic">Canceled</span>
                    <span className="text-xl italic">{massage}</span>
                    {/* <button
                      onClick={handleDialogClose}
                      className="mt-4 rounded-sm bg-green-500 px-6 py-2 text-white hover:bg-green-600"
                    >
                      กลับหน้าหลัก
                    </button> */}
                  </div>
                </>
              );
            case "error":
              return (
                <>
                  <DialogTitle className="hidden text-white">Error</DialogTitle>
                  <DialogDescription />
                  <div className="flex-center h-[200px] w-full flex-col gap-3 text-slate-700">
                    <XCircle size={50} className="text-red-500" />
                    <span className="text-xl italic">
                      กรุณาติดต่อเจ้าหน้าที่ Error !!
                    </span>
                    <span className="text-xl italic">{massage}</span>
                    <button
                      onClick={handleDialogClose}
                      className="mt-4 rounded-sm bg-red-500 px-6 py-2 text-white hover:bg-red-600"
                    >
                      กลับหน้าหลัก
                    </button>
                  </div>
                </>
              );
            default:
              return null;
          }
        })()}
      </DialogContent>
    </Dialog>
  );
}
