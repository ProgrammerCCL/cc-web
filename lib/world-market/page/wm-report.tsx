"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import moment, { Moment } from "moment";
import { TTransType } from "@/types/model";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { HardDriveDownloadIcon } from "lucide-react";
import {
  updateCashDetailsWmReSyncSucces,
  updateCashDetailsWmReSyncError,
} from "@/lib/world-market/actions/updateTransaction";
import { Separator } from "@/components/ui/separator";
import { redirect, useSearchParams } from "next/navigation";
import { IwmTrxReportView } from "@/lib/world-market/types";
import { LoadingDialog } from "@/components/shared/loading";
import { MultipleSelectMenus } from "@/components/shared/button";
import { sendValue } from "@/lib/world-market/actions/syncTansaction";
import { DatePickerToSearch } from "@/components/shared/date-selection";
import { getTrxReport } from "@/lib/world-market/actions/report.action";

const TX_TYPE_ITEMS = [
  "sale",
  "dispense",
  "deposit",
  "refill",
  "exchange",
  "endofday",
] as TTransType[];

// Main Component
export const ReportPage = () => {
  const [isUser, setUser] = useState("");
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [canReSync, setCanReSync] = useState(false);
  const [trxTypes, setTrxTypes] = useState<TTransType[]>([]);
  const [trxData, setTrxData] = useState<IwmTrxReportView[]>([]);
  const [trxDataError, setTrxDataError] = useState<IwmTrxReportView[]>([]);

  // ฟังก์ชันดึงข้อมูลตามวันที่จาก searchParams
  const refreshSearchData = async (dateStr: string) => {
    const dateMoment = moment(dateStr);

    if (dateMoment.isValid()) {
      fetchData(dateMoment);
    }
  };

  // ฟังก์ชันดึงข้อมูลจาก API
  const fetchData = async (sDate: Moment) => {
    if (!session) return;

    setTrxData([]);
    setTrxDataError([]);

    try {
      setIsLoading(true);

      // ดึงข้อมูลจาก API โดยใช้วันที่ที่เลือก
      const data = await getTrxReport({
        dateStr: sDate.format("YYYY-MM-DD"),
      });

      setTrxData(data);

      // กรองข้อมูลรายการที่ตรงกับเงื่อนไข
      const filteredDataError = data.filter((row) => {
        return (
          row.type === "sale" && // trxType ต้องเป็น "sale"
          (row.status === "finish" || row.status === "finished") && // status ต้องเป็น "finish"
          row.httpStatus !== 200
        );
      });

      setTrxDataError(filteredDataError);
      setCanReSync(filteredDataError.length > 0);
    } catch (err: any) {
      console.error("[ERROR]", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ฟังก์ชันเลือกประเภทการทำธุรกรรม
  const handleSelectTrxType = (value: TTransType) => {
    setTrxTypes((prev) => {
      const exists = prev.includes(value);
      if (exists) {
        return prev.filter((itm) => itm !== value);
      } else {
        return [...prev, value];
      }
    });
  };

  // ฟังก์ชันดาวน์โหลดข้อมูลเป็นไฟล์ CSV
  const handleDownloadCSV = () => {
    try {
      const dataToDownload = trxData.filter((row) =>
        trxTypes.length > 0 ? trxTypes.includes(row.type) : true
      );

      if (dataToDownload.length === 0) {
        alert("ไม่มีข้อมูลสำหรับดาวน์โหลด");
        return;
      }

      const headers = [
        "Seq",
        "Amount",
        "Type",
        "Remarks",
        "Status",
        "User",
        "Erp_message",
        "Created At",
      ];

      const rows = dataToDownload.map((row) => [
        row.id || "-",
        row.amount,
        row.type.toUpperCase(),
        row.remarks || "-",
        row.status,
        row.userName,
        row.erpMessege || "-",
        moment(row.create_at).format("YYYY-MM-DD HH:mm:ss"),
      ]);

      const csvContent = [headers, ...rows]
        .map((row) => row.join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.setAttribute("href", url);
      a.setAttribute("download", "transactions_report.csv");
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err: any) {
      console.error("[ERROR  handleDownloadCSV]", err.message);
    }
  };

  // ฟังก์ชันรีซิงค์ข้อมูล
  const handleReSync = async () => {
    if (trxDataError.length === 0) return;
    try {
      setIsLoading(true);
      for (const errorData of trxDataError) {
        const { remarks, amount, id } = errorData;

        const memberId = remarks || "";
        const trxAmount = parseFloat(amount.toString());
        const transactionId = id;

        // ถ้า memberId เป็นค่าว่างหรือ null ก็ไม่ทำการเรียก
        if (!memberId) {
          console.error("[ERROR] memberId is null or empty", { transactionId });
          continue;
        }

        if (isNaN(trxAmount)) {
          console.error("[ERROR] trxAmount is not a valid number", {
            transactionId,
          });
          continue;
        }

        const { error, message, data, httpStatus } = await sendValue(
          memberId,
          trxAmount,
          isUser
        );

        if (!error) {
          const updateSuccess = await updateCashDetailsWmReSyncSucces(
            transactionId,
            httpStatus,
            message,
            data
          );

          if (!updateSuccess) {
            console.error("[ERROR] updateCashDetailsWmReSyncSucces Failed", {
              transactionId,
              message,
              httpStatus,
              data,
            });
          }
        } else {
          const updateSuccess = await updateCashDetailsWmReSyncError(
            transactionId,
            httpStatus,
            message,
            data
          );

          if (!updateSuccess) {
            console.error("[ERROR] updateCashDetailsWmReSyncError Failed", {
              transactionId,
              message,
              httpStatus,
              data,
            });
          }
        }
      }
    } catch (err: any) {
      console.error("[ERROR handleReSync]", err.message);
    } finally {
      setIsLoading(false);
      // เรียก refreshSearchData เพื่อดึงข้อมูลใหม่หลังจากการอัปเดตเสร็จสิ้น
      refreshSearchData(searchParams.get("date") || "");
    }
  };

  /* eslint-disable */

  useEffect(() => {
    if (!session || (!session.user.id && !session.user.code)) {
      redirect("/operation");
    } else {
      setUser(session.user.code);
    }

    const getDate = searchParams.get("date") || "";
    if (getDate) {
      refreshSearchData(getDate);
    }
  }, [searchParams]);

  /* eslint-enable */

  return (
    <div className="custom-scrollbar relative mx-auto h-[calc(100vh-4rem)] w-full overflow-y-auto xl:w-4/5">
      <LoadingDialog isOpen={isLoading} />
      <div className="w-full space-y-4 p-4 md:px-10">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="flex flex-col items-stretch gap-2 lg:flex-row lg:gap-6">
            <div>
              <h1 className="text-xl font-bold">Transactions</h1>
              <h2 className="italic">ข้อมูลรายการ</h2>
            </div>

            {/* Filter */}
            <div className="flex-center gap-2 rounded-lg border border-slate-200 p-2">
              <div className="text-end text-sm text-slate-600">
                <p className="font-bold">Type</p>
                <p>ประเภท</p>
              </div>
              <Separator orientation="vertical" />
              <MultipleSelectMenus
                values={trxTypes}
                itemList={TX_TYPE_ITEMS}
                onSelected={handleSelectTrxType}
                onSelectNone={() => setTrxTypes([])}
              />
            </div>
          </div>

          {/* Search Date */}
          <div className="flex flex-col items-center gap-1">
            <span className="font-bold">Report Date</span>
            <DatePickerToSearch />
          </div>
        </div>

        <Separator className="" />

        <div className="flex justify-end gap-4">
          {canReSync && (
            <Button
              size="icon"
              onClick={handleReSync}
              disabled={trxData.length === 0 || !canReSync}
              className="w-[100px] bg-red-500 text-white hover:bg-red-600"
            >
              ReSync
            </Button>
          )}
          <Button
            size="icon"
            onClick={handleDownloadCSV}
            disabled={trxData.length === 0}
            className="w-[100px]"
          >
            <HardDriveDownloadIcon />
          </Button>
        </div>

        {trxData.length === 0 ? (
          <div className="rounded-lg bg-slate-100 p-3 text-center">
            <span className="text-slate-400">{`- ไม่พบข้อมูล -`}</span>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">ID</TableHead>
                <TableHead className="text-center">Amount</TableHead>
                <TableHead className="text-center">Type</TableHead>
                <TableHead className="text-center">Remarks</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">User</TableHead>
                <TableHead className="text-center">Http_Status</TableHead>
                <TableHead className="text-center">Created_at</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trxData
                .filter((row) =>
                  trxTypes.length > 0 ? trxTypes.includes(row.type) : true
                )
                .map((data, idx) => (
                  <TableRow key={`${idx}-${data.id}`} className="text-xs">
                    <TableCell className="text-center">{data.id}</TableCell>
                    <TableCell className="text-center">{data.amount}</TableCell>
                    <TableCell className="text-center">{data.type}</TableCell>
                    <TableCell className="text-center">
                      {data.remarks || "-"}
                    </TableCell>
                    <TableCell className="text-center">{data.status}</TableCell>
                    <TableCell className="text-center">
                      {data.userName}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        className={`${
                          data.httpStatus === 200
                            ? "bg-green-500"
                            : data.status === "cancel"
                              ? "bg-blue-500"
                              : data.type !== "sale"
                                ? "bg-blue-500"
                                : "bg-red-500"
                        } h-[40px] w-[100px] text-white`} // ตั้งขนาดความกว้างและความสูง
                      >
                        {data.status === "cancel"
                          ? "cancel"
                          : data.type !== "sale"
                            ? "backoffice"
                            : data.httpStatus}
                      </Button>
                    </TableCell>
                    <TableCell className="text-center">
                      {moment(data.create_at).format("YYYY-MM-DD HH:mm:ss") ||
                        "-"}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};
