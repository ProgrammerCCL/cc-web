"use server";

import { auth, signOut } from "@/auth";

export async function logoutAction() {
  await signOut();
}

export async function sessionAction() {
  const session = await auth();
  return session;
}

export async function checkPermissions(role: string) {
  const session = await auth();

  const allow = await session?.user?.permissions.includes(role)

  return allow;
}