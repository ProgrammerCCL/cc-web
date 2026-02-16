"use client";

import React, { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Separator } from "../ui/separator";

export const WipDispenseDialog = ({
  amount,
  open,
  title,
  msgs,
  finished,
  onClose,
}: {
  amount: string;
  open: boolean;
  finished?: boolean;
  title: string;
  msgs?: string[];
  onClose?: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCloseDialog = (newOpen: boolean) => {
    if (!newOpen && onClose) {
      onClose();
    }
    setIsOpen(newOpen);
  };

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  return (
    <AlertDialog open={isOpen} onOpenChange={handleCloseDialog}>
      <AlertDialogContent className="">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-lg font-bold">
            {title}
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription className="hidden"></AlertDialogDescription>

        <Separator className="" />

        <div className="flex justify-center gap-2 text-2xl font-bold text-sky-700">
          <span>ยอดเงิน</span>
          <span>:</span>
          <span>{amount}</span>
        </div>

        <Separator className="mb-2" />

        <div className="text-center text-sm">
          {msgs && msgs.map((msg, idx) => <p key={idx}>{msg}</p>)}
        </div>

        <Separator className="my-2" />

        {finished ? (
          <AlertDialogCancel asChild>
            <div className="mx-auto w-1/3 cursor-pointer bg-green-700 text-xl text-white hover:bg-green-700 hover:text-white">
              กลับหน้าหลัก
            </div>
          </AlertDialogCancel>
        ) : null}
      </AlertDialogContent>
    </AlertDialog>
  );
};
