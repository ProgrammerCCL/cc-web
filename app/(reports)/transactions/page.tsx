"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IMachineApiData } from "@/types/model";
import React, { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { getWIPv2ById } from "@/lib/actions/wip.actions";
import { useRouter, useSearchParams } from "next/navigation";
import { TransactionsComponent } from "@/components/backoffice/transactions";

function TransactionyPage() {
  const router = useRouter();
  const { toast } = useToast();
  const param = useSearchParams();
  const id = param.get("id") || "";
  const reqId = param.get("reqId") || "";
  const [trWIP, setTrWIP] = useState<IMachineApiData | null>(null);
  const [isShow, setIsShow] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [searchReqId, setSearchReqId] = useState("");
  const [tempSearchId, setTempSearchId] = useState("");
  const [tempSearchReqId, setTempSearchReqId] = useState("");

  // TODO: Fetch Get WIP By ID
  const fetchWIPbyId = async (id?: string, reqId?: string) => {
    try {
      if (!id && !reqId) return;

      const { success, data, error } = await getWIPv2ById({ id, reqId });

      if (success && data) {
        setTrWIP(data);
        setIsShow(true);
      } else {
        setIsShow(false);
        console.error("[ERROR] get transaction wip Failed", error);
        toast({
          variant: "destructive",
          title: `Error: Fail ${error}`,
          description: `Fetch Transaction Failed. ${error}`,
        });
      }
    } catch (err: any) {
      console.error("[ERROR] get transaction wip Failed", err.message);
      toast({
        variant: "destructive",
        title: `Error: Fail fetch transaction`,
        description: `Fetch Transaction Failed. ${err.message}`,
      });
    }
  };

  /* eslint-disable */

  useEffect(() => {
    fetchWIPbyId(id, reqId);
  }, [id, reqId]);

  useEffect(() => {
    if (searchId || searchReqId) {
      const currentUrl = `/transactions?${searchId ? `id=${searchId}` : ""}${searchId && searchReqId ? "&" : ""}${
        searchReqId ? `reqId=${searchReqId}` : ""
      }`;

      router.replace(currentUrl);
    }
  }, [searchId, searchReqId]);
  /* eslint-enable */

  return (
    <div className="mt-4 w-full p-4 md:px-10">
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-1">
          <span>Search by ID</span>
          <span className="text-xs text-slate-400">Work in process ID</span>
          <div className="flex items-center justify-center gap-2">
            <Input
              type="text"
              className="border-2"
              value={tempSearchId}
              onChange={(e) => setTempSearchId(e.target.value)}
            />
            <Button onClick={() => setSearchId(tempSearchId)}>
              <Search />
            </Button>
          </div>
        </div>

        <div className="grid gap-1">
          <span>Search by ReqID</span>
          <span className="text-xs text-slate-400">
            Client request ID no prefix
          </span>
          <div className="flex items-center justify-center gap-2">
            <Input
              type="text"
              className="border-2"
              value={tempSearchReqId}
              onChange={(e) => setTempSearchReqId(e.target.value)}
            />
            <Button onClick={() => setSearchReqId(tempSearchReqId)}>
              <Search />
            </Button>
          </div>
        </div>
      </div>

      <TransactionsComponent isShow={isShow} trWIP={trWIP} />
    </div>
  );
}

export default TransactionyPage;
