"use client";

import { BoxContainer } from "@/components/shared/container";
import { Checkbox } from "@/components/ui/checkbox";
import {
  deleteEmployeeById,
  getAllPermissions,
  getEmployeeList,
} from "@/lib/actions/api-employee.action";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { IEmployee } from "@/types/model/user.type";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { AddUserDialog } from "@/components/users";
import { DeleteConfirmButton } from "@/components/shared/button";

const UserPage = () => {
  const { data: session } = useSession();
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [empList, setEmpList] = useState<IEmployee[]>([]);
  const [permList, setPermList] = useState<string[]>([]);

  const fetchPermData = async () => {
    try {
      const permsRes = await getAllPermissions();

      if (!permsRes.success) {
        console.error("[ERROR] Cannot fetch data");
        permsRes.error && console.error(" - ", permsRes.error);
        return;
      }
      setPermList(permsRes.data || []);
    } catch (err: any) {
      console.error("[ERROR]", err.message);
    }
  };

  const fetchEmployeeData = async () => {
    setIsLoading(true);
    try {
      const userRes = await getEmployeeList();

      if (!userRes.success) {
        console.error("[ERROR] Cannot fetch data");
        userRes.error && console.error(" - ", userRes.error);
        return;
      }
      setEmpList(userRes.data || []);
    } catch (err: any) {
      console.error("[ERROR]", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEmployee = async (userId: string) => {
    try {
      setIsLoading(true);
      const res = await deleteEmployeeById(userId);
      if (res.success) {
        await fetchEmployeeData();
        toast({
          title: "User deleted : success",
          variant: "success",
        });
      } else {
        toast({
          title: "User deleted : failed",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      console.error("[ERROR]", err.message);
      toast({
        title: "User deleted : failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  /* eslint-disable */
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && session) {
      if (!session.user.permissions.includes("CASH_DISPENSE")) {
        redirect("/admin");
      }

      fetchPermData();
      fetchEmployeeData();
    }
  }, [isClient, session]);
  /* eslint-enable */

  return isClient && permList.length > 0 ? (
    <div className="mx-auto mt-4 w-full max-w-[940px] space-y-6  py-4 xl:max-w-[1200px] ">
      <BoxContainer className="">
        <div className="flex justify-between rounded-md border border-slate-200 p-4">
          <div className="flex flex-col">
            <h1 className="grid content-center  font-bold">User Config</h1>
            <span className="text-xs italic text-rose-400">{`Available only 'Create' and 'Delete' `}</span>
          </div>

          <AddUserDialog
            permissions={permList}
            successCallback={fetchEmployeeData}
          />
        </div>
      </BoxContainer>

      <BoxContainer className="w-full">
        <Table className="">
          <TableHeader className="bg-slate-700/75">
            <TableRow className="text-[10px] font-bold">
              <TableHead
                className="rounded-ss-md border-r "
                style={{ minWidth: "50px", maxWidth: "50px" }}
              />

              <TableHead className="w-[150px] border-r px-4 font-light text-white">
                USER
              </TableHead>
              {permList.map((value) => (
                <TableHead
                  key={value}
                  className="border-r p-1 text-center font-light leading-none text-white"
                  style={{ minWidth: "70px", maxWidth: "70px" }}
                >
                  {value.replaceAll("_", " ")}
                </TableHead>
              ))}
              <TableHead
                className="rounded-se-md p-1"
                // style={{ minWidth: "50px", maxWidth: "50px" }}
              />
            </TableRow>
          </TableHeader>
          <TableBody>
            {empList.length > 0 ? (
              empList.map((user, index) => (
                <TableRow
                  key={user.id + index}
                  className="h-14 text-center text-xs"
                >
                  <TableCell className="border-r">
                    <DeleteConfirmButton
                      size={18}
                      description={`Do you want to delete user : ${user.displayName} ?`}
                      onConfirm={() => handleDeleteEmployee(user.id)}
                      disabled={isLoading}
                    />
                  </TableCell>

                  <TableCell className=" border-r">
                    <div className="flex w-[150px] items-center gap-3 px-2">
                      <span className="w-full truncate text-start">
                        {user.displayName}
                      </span>
                    </div>
                  </TableCell>
                  {permList.map((value, permIndex) => (
                    <TableCell key={permIndex} className="border-r">
                      <Checkbox
                        id={`${user.id}-${value}`}
                        checked={user.permissions?.includes(value)}
                        aria-readonly
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="h-12 text-center text-xs italic tracking-wider">
                <TableCell colSpan={12}>- No Data -</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </BoxContainer>
    </div>
  ) : (
    <div className="flex-center mt-20 text-xl italic text-slate-700">
      Loading ...
    </div>
  );
};

export default UserPage;
