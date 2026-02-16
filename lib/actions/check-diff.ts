"use server";

import env from "@/env";
import { auth } from "@/auth";

export async function gettotalDiff() {
  const session = await auth();
  if (!session || !session.user) {
    return { success: false, error: "Unauthorized." };
  }

  try {
    const res = await fetch(`${env.API_URL}/api/inventory/diff/`, {
      method: "GET",
      headers: {
        apikey: env.API_KEY,
        apisecret: env.API_SECRET,
      },
    });

    const { success, error, ...data } = await res.json();

    if (error) {
      console.warn("[WARN]", error);
    }

    if (success) {
      return { success, data };
    }

    return { success: false, error: "Incorrect collectId" };
  } catch (error) {
    console.error("Error gettotalDiff:", error);
    return { success: false, error: `Error gettotalDiff: ${error}` };
  }
}

export async function getTransactionWip() {
  const session = await auth();
  if (!session || !session.user) {
    return { success: false, error: "Unauthorized." };
  }

  try {
    const res = await fetch(`${env.API_URL}/api/v2/wip/`, {
      method: "GET",
      headers: {
        apikey: env.API_KEY,
        apisecret: env.API_SECRET,
      },
    });

    const { success, error, ...data } = await res.json();

    if (error) {
      console.warn("[WARN]", error);
    }

    if (success) {
      return { success, data };
    }

    return { success: false, error: "Incorrect getTransactionWip" };
  } catch (error) {
    console.error("Error gettotalDiff:", error);
    return { success: false, error: `Error gettotalDiff: ${error}` };
  }
}

export async function getTransactionError() {
  const session = await auth();
  if (!session || !session.user) {
    return { success: false, error: "Unauthorized." };
  }

  try {
    const res = await fetch(`${env.API_URL}/api/v2/wip?error=true`, {
      method: "GET",
      headers: {
        apikey: env.API_KEY,
        apisecret: env.API_SECRET,
      },
    });

    const { success, error, ...data } = await res.json();

    if (error) {
      console.warn("[WARN]", error);
    }

    if (success) {
      return { success, data };
    }

    return { success: false, error: "Incorrect getTransactionError" };
  } catch (error) {
    console.error("Error gettotalDiff:", error);
    return { success: false, error: `Error getTransactionError: ${error}` };
  }
}

export async function updateTransactionWip(id: number) {
  const session = await auth();
  if (!session || !session.user) {
    return { success: false, error: "Unauthorized." };
  }

  try {
    const res = await fetch(`${env.API_URL}/api/v2/wip/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        apikey: env.API_KEY,
        apisecret: env.API_SECRET,
      },
    });

    const { success, error, ...data } = await res.json();
    console.error("[WARN]", error);
    if (error) {
      console.warn("[WARN]", error);
    }

    if (success) {
      return { success, data };
    }

    return { success: false, error: "Failed to update WIP." };
  } catch (error) {
    console.error("Error updating WIP:", error);
    return { success: false, error: `Error updating WIP: ${error}` };
  }
}
