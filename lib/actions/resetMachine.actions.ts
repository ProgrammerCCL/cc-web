"use server";

import { z } from "zod";
import { auth } from "@/auth";
import env from "@/env";
import { v4 as uuidv4 } from "uuid";
import { IMachineApiData } from "@/types/model";

import { DEFAULT_POS } from "@/constants";

const resetMachineSchema = z.object({
  machineId: z.string().min(1, "machineId is required"),
});

export async function resetMachine(params: {
  machineId: string;
}): Promise<{ success: boolean; data?: IMachineApiData; error?: string }> {
  try {
    const validData = resetMachineSchema.safeParse(params);
    if (!validData.success) {
      return {
        success: false,
        error: "Invalid data: " + validData.error.message,
      };
    }

    const { machineId } = validData.data;

    const session = await auth();
    if (!session?.user) {
      return {
        success: false,
        error: "Unauthorized.",
      };
    }

    const reqId = uuidv4().replaceAll("-", "");

    const res = await fetch(`${env.API_URL}/api/machine/reset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: env.API_KEY!,
        apisecret: env.API_SECRET!,
      },
      body: JSON.stringify({
        reqId,
        posId: env.POS_ID || DEFAULT_POS,
        machineId,
      }),
    });

    const { success, error, data } = await res.json();
    if (!success) {
      return {
        success: false,
        error: `Cannot fetch : ${error}`,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error: any) {
    console.error("Error resetMachine:", error);
    return {
      success: false,
      error: `Error resetMachine: ${error.message || error}`,
    };
  }
}

export async function getResetStatus(
  wipId: string
): Promise<{ success: boolean; data?: IMachineApiData; error?: string }> {
  const session = await auth();
  if (!session || !session.user) {
    return { success: false, error: "Unauthorized." };
  }
  try {
    // 🔹 สร้าง URL พร้อม Query Parameters
    const url = `${env.API_URL}/api/v2/wip?id=${wipId}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        apikey: env.API_KEY,
        apisecret: env.API_SECRET,
      },
    });

    // เช็กว่าการตอบกลับเป็น JSON จริง ๆ หรือไม่
    if (!res.ok) {
      throw new Error(`HTTP Error ${res.status}`);
    }

    const { success, data } = await res.json();
    console.log("[DEBUG] Parsed Response:", success, data);

    if (success) {
      return { success, data: data as IMachineApiData };
    }

    return { success: false, error: "Incorrect refill" };
  } catch (error: any) {
    console.error("Error getResetStatus:", error);
    return { success: false, error: "Something went wrong at server side." };
  }
}
