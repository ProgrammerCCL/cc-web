"use server";

import env from "@/env";
import { auth } from "@/auth";
import { IMachineApiData } from "@/types/model";

export async function getWIPById(id: number) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Unauthorized." };
    }

    const res = await fetch(`${env.API_URL}/api/wip/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        apikey: env.API_KEY,
        apisecret: env.API_SECRET,
      },
    });

    const { success, data } = await res.json();

    if (!success) {
      return { success: false, error: "Cannot fetch API Dispanse Exchange." };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("API failed :", error);
    return {
      success: false,
      error: `API failed : ${error.message || error}`,
    };
  }
}

export async function getWIPv2(
  { getError }: { getError?: boolean } = { getError: false }
): Promise<{
  success: boolean;
  data: IMachineApiData[];
  error?: string;
}> {
  try {
    // const session = await auth();
    // if (!session?.user) {
    //   return { success: false, data: [], error: "Unauthorized." };
    // }

    const url = `${env.API_URL}/api/v2/wip${getError ? "?error=true" : ""}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        apikey: env.API_KEY,
        apisecret: env.API_SECRET,
      },
    });

    const { success, data } = await res.json();

    if (!success) {
      return {
        success: false,
        data: [],
        error: "Backend API error.",
      };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("API failed :", error);
    return {
      success: false,
      data: [],
      error: `API failed : ${error.message || error}`,
    };
  }
}

export async function getWIPv2ById({
  id,
  reqId,
}: {
  id?: string;
  reqId?: string;
}): Promise<{ success: boolean; data?: IMachineApiData; error?: string }> {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Unauthorized." };
    }

    const queryParams = new URLSearchParams();
    if (id) queryParams.append("id", id);
    if (reqId) queryParams.append("reqId", reqId);

    const url = `${env.API_URL}/api/v2/wip?${queryParams.toString()}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        apikey: env.API_KEY,
        apisecret: env.API_SECRET,
      },
    });

    const { success, data } = await res.json();

    if (!success) {
      return { success: false, error: "Cannot fetch API WIP." };
    }

    return {
      success: true,
      data: { ...data, denom: JSON.parse(data.denom) },
    };
  } catch (error: any) {
    console.error("API failed :", error);
    return {
      success: false,
      error: `API failed : ${error.message || error}`,
    };
  }
}
