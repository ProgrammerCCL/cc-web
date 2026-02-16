"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface IDeleteConfirmButtonProps {
  size: number;
  onConfirm: () => void;
  title?: string;
  description?: string;
  disabled?: boolean;
}

export const DeleteConfirmButton = ({
  size,
  onConfirm,
  title,
  description,
  disabled,
}: IDeleteConfirmButtonProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        className="rounded-md bg-red-500 p-1 hover:bg-red-400"
        disabled={disabled}
      >
        <Trash2 size={size} className="text-white" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-600">
            {title || "Confirm delete ?"}
          </AlertDialogTitle>
          <Separator />
        </AlertDialogHeader>

        <AlertDialogDescription className="italic text-red-500">
          {description}
        </AlertDialogDescription>

        <div className="flex-center mt-4 gap-6">
          <Button
            variant="destructive"
            onClick={onConfirm}
            className="w-full md:w-1/3"
          >
            Delete
          </Button>
          <AlertDialogCancel className="w-full md:w-1/3">
            Cancel
          </AlertDialogCancel>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
