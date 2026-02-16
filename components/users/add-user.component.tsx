"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Separator } from "../ui/separator";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CreateUserSchema } from "@/lib/validations/user.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { UserPlus2 } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { createEmployee } from "@/lib/actions/api-employee.action";
import { toast } from "../ui/use-toast";

interface IAddUsrDialogProps {
  permissions: string[];
  successCallback: () => void;
}

const INIT_FORM = {
  username: "",
  pin: "",
  displayName: "",
  isManager: false,
  permissions: [],
};

export const AddUserDialog = ({
  permissions,
  successCallback,
}: IAddUsrDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const usrForm = useForm<z.infer<typeof CreateUserSchema>>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: INIT_FORM,
  });

  const handlePermissionCheck = (perm: string) => {
    const idx = permissions.findIndex((p) => p === perm);
    if (idx >= 0) {
      const currentPerms = usrForm.getValues("permissions");
      const existsIdx = currentPerms.findIndex((p) => p === perm);
      if (existsIdx >= 0) {
        usrForm.setValue(
          "permissions",
          currentPerms.filter((p) => p !== perm)
        );
      } else {
        usrForm.setValue("permissions", [...currentPerms, perm]);
      }
    }
  };

  const handleSubmit = async (values: z.infer<typeof CreateUserSchema>) => {
    try {
      setIsLoading(true);
      const { success, error } = await createEmployee(values);

      if (success) {
        successCallback();
        setOpen(false);
        toast({
          title: `User created : ${values.displayName}`,
          variant: "success",
        });
      } else {
        console.error("[ERROR]", error);
        const result = error?.includes("Duplicate") ? error : "failed";
        toast({
          title: `User create : ${result}`,
          variant: "destructive",
        });
      }
    } catch (err: any) {
      console.error("[ERROR]", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  /* eslint-disable */
  useEffect(() => {
    if (open) {
      usrForm.reset();
    }
  }, [open]);
  /* eslint-enable */

  return (
    <Dialog open={open} onOpenChange={(b) => setOpen(b)}>
      <DialogTrigger>
        <div className="flex items-center gap-1 rounded-md bg-green-300 p-2 px-3 shadow-md hover:bg-green-200">
          <UserPlus2
            size={20}
            className="rounded-full bg-green-400 p-0.5 text-slate-600"
          />
          <span className="text-sm text-slate-700">New</span>
        </div>
      </DialogTrigger>
      <DialogContent className="custom-scrollbar max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create new user</DialogTitle>
          <DialogDescription />
        </DialogHeader>

        <Separator />

        <Form {...usrForm}>
          <form
            onSubmit={usrForm.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={usrForm.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <div className="flex-between">
                    <FormLabel>Username</FormLabel>
                    <FormMessage className=" text-xs italic text-red-500" />
                  </div>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      id="Username"
                      placeholder="username"
                      className="no-focus no-active"
                      disabled={isLoading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={usrForm.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <div className="flex-between">
                    <FormLabel>Display name</FormLabel>
                    <FormMessage className=" text-xs italic text-red-500" />
                  </div>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      id="Username"
                      placeholder="Display name"
                      className="no-focus no-active"
                      disabled={isLoading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={usrForm.control}
              name="pin"
              render={({ field }) => (
                <FormItem>
                  <div className="flex-between">
                    <FormLabel>PIN</FormLabel>
                    <FormMessage className=" text-xs italic text-red-500" />
                  </div>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      id="Username"
                      placeholder="pin"
                      className="no-focus no-active"
                      disabled={isLoading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={usrForm.control}
              name="isManager"
              render={({ field }) => (
                <FormItem>
                  <div className="flex-between">
                    <FormLabel>Is Manager</FormLabel>
                    <FormMessage className=" text-xs italic text-red-500" />
                  </div>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-green-500"
                    disabled={isLoading}
                  />
                </FormItem>
              )}
            />

            <FormField
              control={usrForm.control}
              name="permissions"
              render={({ field }) => (
                <FormItem>
                  <div className="flex-between">
                    <FormLabel>Permissions</FormLabel>
                    <FormMessage className=" text-xs italic text-red-500" />
                  </div>
                  <div className="mt-2 space-y-1 p-1 px-3">
                    {permissions.map((p) => (
                      <div key={p} className="flex gap-4">
                        <Checkbox
                          checked={field.value.includes(p)}
                          onCheckedChange={() => handlePermissionCheck(p)}
                          disabled={isLoading}
                        />
                        <span className="text-xs">{p}</span>
                      </div>
                    ))}
                  </div>
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <Button
                type="submit"
                className="bg-green-500 hover:bg-green-400"
                disabled={isLoading}
              >
                Create
              </Button>
              <DialogClose type="reset">Cancel</DialogClose>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
