"use client";

import { IMachineApiData } from "@/types/model";
import React, { useEffect, useMemo, useState } from "react";

import {
  DispenseState,
  SaleState,
  StatusIdle,
  StatusBusy,
  StatusReset,
  ErrorState,
} from "@/components/wip-monit/state";

import { getWIPv2 } from "@/lib/actions/wip.actions";
import { LoadingDialog } from "@/components/shared/loading";
import { useInventoryContext } from "@/context";

const FETCH_INTERVAL = 2000; // 2 sec

const MonitPage = () => {
  const [wipData, setWipData] = useState<IMachineApiData[]>([]);
  const [isInit, setIsInit] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [isErrorState, setIsErrorState] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { fetchInventory } = useInventoryContext();

  const latestWIP = useMemo(
    () => wipData.sort((a, b) => b.id - a.id).at(0),
    [wipData]
  );

  const handleFetchWip = async () => {
    // fetch data
    if (isFetching || isErrorState) return;

    try {
      setIsFetching(true);

      const { success, data, error } = await getWIPv2();

      if (success) {
        setWipData(data);
      } else {
        console.error("[ERROR] :", error);
        setIsErrorState(true);
        setErrorMessage("เครื่องจัดการเงินมีปัญหา กรุณาติดต่อเจ้าหน้าที่"); // Set specific error message
        setWipData([]);
      }
    } catch (err: any) {
      console.error("[ERROR] fetch wip error", err.message);
      setIsErrorState(true);
      setErrorMessage("Server error.");
      setWipData([]);
    } finally {
      setIsFetching(false);
      setIsInit(false);
    }
  };

  const handleFetchErrWip = async () => {
    try {
      const { success, data, error } = await getWIPv2({ getError: true });

      if (success && data.length === 0) {
        setIsErrorState(false);
        setErrorMessage(""); // Clear error message
      } else {
        error && console.error("[ERROR] ", error);
        setIsErrorState(true);
        setErrorMessage("เครื่องจัดการเงินมีปัญหา กรุณาติดต่อเจ้าหน้าที่"); // Set error message
      }
    } catch (err: any) {
      console.error("[ERROR] fetch wip error", err.message);
      setIsErrorState(true);
      setErrorMessage("Server error.");
    } finally {
      setIsInit(false);
    }
  };

  // use effect
  /* eslint-disable */
  useEffect(() => {
    // Initial fetch
    handleFetchErrWip();
    handleFetchWip();

    const interval = setInterval(() => {
      handleFetchErrWip();
      handleFetchWip();
      fetchInventory(false);
    }, FETCH_INTERVAL);

    return () => clearInterval(interval);
  }, []);
  /* eslint-enable */

  if (isInit) {
    return <LoadingDialog isOpen={true} />;
  }

  // const wipPrefix = latestWIP.reqID.slice(0, 3);
  const wipPrefix = isErrorState
    ? "ERROR"
    : latestWIP
      ? latestWIP.reqID.slice(0, 3)
      : "IDLE";

  switch (wipPrefix) {
    case "IDLE":
      return <StatusIdle />;
    case "SAL":
      return <SaleState data={wipData} />;
    case "DSP":
      return <DispenseState amount={latestWIP?.amount || 0} />;
    case "RST":
      return <StatusReset />;
    case "ERROR":
      return <ErrorState error={errorMessage} />; // Now errorMessage is properly defined
    default:
      return <StatusBusy />;
  }
};

export default MonitPage;
