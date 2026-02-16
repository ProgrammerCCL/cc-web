"use client";

import moment, { Moment } from "moment";
import React, { useEffect, useState } from "react";
import { DatePicker } from "./datepicker-std.component";
import { useRouter } from "next/navigation";

export const DatePickerToSearch = () => {
  const router = useRouter();
  const [searchDate, setSearchDate] = useState<Moment | undefined>(
    moment().startOf("days")
  );

  /* eslint-disable */
  useEffect(() => {
    if (searchDate) {
      router.push(`?date=${searchDate.format("YYYY-MM-DD")}`);
    } else {
      setSearchDate(moment().startOf("days"));
    }
  }, [searchDate]);
  /* eslint-enable */

  return <DatePicker date={searchDate} setDate={setSearchDate} />;
};
