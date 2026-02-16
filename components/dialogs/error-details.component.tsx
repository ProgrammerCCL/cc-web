"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Separator } from "../ui/separator";

export const ErrorAlertWithDetails = ({
  open,
  title,
  msgs,
}: {
  open: boolean;
  title?: string;
  msgs: string[];
}) => {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="bg-red-50">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold text-red-700">
            {title || "Error !!"}
          </AlertDialogTitle>
        </AlertDialogHeader>

        <Separator className="mb-2 bg-red-500" />

        <div className="text-center text-sm text-red-700">
          {msgs.map((msg, idx) => (
            <p key={idx}>{msg}</p>
          ))}
        </div>

        <Separator className="my-2 bg-red-500" />
      </AlertDialogContent>
    </AlertDialog>
  );
};
