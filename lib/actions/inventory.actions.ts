"use server";

import env from "@/env";
import { IInventoryItem } from "@/types/model";
import { InventoryType } from "@/types/model/inventory.type";

interface IGetInventoryResp {
  success: boolean;
  data?: IInventoryItem[];
  error?: string;
  message: string[];
}

export async function getInventory(): Promise<IGetInventoryResp> {
  try {
    const res = await fetch(`${env.API_URL}/api/inventory`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        apikey: env.API_KEY,
        apisecret: env.API_SECRET,
      },
    });

    const { success, data, message } = await res.json();

    if (success && data) {
      return { success, data, message };
    }

    return {
      success: false,
      data: [],
      error: "Incorrect getInventory",
      message: [],
    };
  } catch (err: any) {
    console.error("[ERROR] getInventory", err.message);
    return {
      success: false,
      data: [],
      error: "Something went wrong at server side.",
      message: [],
    };
  }
}

export async function patchInventory(
  denoms: InventoryType[]
): Promise<IGetInventoryResp> {
  try {
    const res = await fetch(`${env.API_URL}/api/inventory`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        apikey: env.API_KEY,
        apisecret: env.API_SECRET,
      },
      body: JSON.stringify({
        denominations: denoms,
      }),
    });

    const { success, error, message } = await res.json();

    if (success && message) {
      return { success, message };
    }

    return {
      success: false,
      error: `Incorrect getInventory ${error}`,
      message: [],
    };
  } catch (err: any) {
    console.error("[ERROR] getInventory", err.message);
    return {
      success: false,
      error: "Something went wrong at server side.",
      message: [],
    };
  }
}

export async function FetchUser(user: string) {
  try {
    const res = await fetch(`${env.PRINT_API_URL}/api/user/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: user,
      }),
    });

    const { status, idReceived, message } = await res.json();

    if (status === "success") {
      return { success: true, data: idReceived, message };
    }

    return {
      success: false,
      data: null,
      error: `Failed to create user: ${message || "Unknown error"}`,
      message: [],
    };
  } catch (err: any) {
    console.error("[ERROR] FetchUser", err.message);
    return {
      success: false,
      data: null,
      error: "Something went wrong at server side.",
      message: [],
    };
  }
}
