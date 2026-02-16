"use server";

import env from "@/env";
import { IMachineData } from "@/types/model";

export async function getMachineSelectionList(): Promise<IMachineData[]> {
  try {
    const mcReq = await fetch(`${env.API_URL}/api/machine?noteOnly=true`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        apikey: env.API_KEY,
        apisecret: env.API_SECRET,
      },
    });

    const { data } = await mcReq.json();

    return data || [];
  } catch (err: any) {
    console.error("[ERROR]", err.message);
  }
  return [];
}
