import db from "@/db";
import env from "@/env";
import bcrypt from "bcryptjs";
import { users } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

const convertToUserSchema = (res: any) => {
  const user = {
    shopId: res.shopId,
    name: res.displayName,
    username: res.username,
    displayName: res.displayName,
    refId: res.id,
    isManager: res.isManager,
    permissions: res.permissions,
  };

  return user;
};

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { username, pin } = data;

    const apiUrl = `${env.API_URL}/api/auth/employee/`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: env.API_KEY,
        apisecret: env.API_SECRET,
      },
      body: JSON.stringify({
        username,
        pin,
      }),
    });

    const { user, success } = await response.json();

    if (!user || !success) {
      return NextResponse.json(
        {
          success: false,
        },
        {
          status: 401,
        }
      );
    }

    const userApi = convertToUserSchema(user);

    // const userApi = convertToUserSchema(MOCK_USER_RESP.user);

    const [existingUser] = await db
      .select()
      .from(users)
      .where(and(eq(users.username, userApi.username)))
      .execute();

    const apiPermissions = userApi.permissions.split(",");

    if (existingUser) {
      // ดึง permissions จาก api แปลงเป็น array

      // เช็คความแตกต่างของ permission
      //     const permissionsMismatch = apiPermissions.some(permission => !existingPermissions.includes(permission)) ||
      //       existingPermissions.some(permission => !apiPermissions.includes(permission));

      const updatedUser = await db
        .update(users)
        .set({ permissions: apiPermissions })
        .where(eq(users.id, existingUser.id))
        .returning();

      return NextResponse.json(
        {
          success: true,
          data: updatedUser,
        },
        {
          status: 200,
        }
      );
    }

    const hashedPin = await bcrypt.hash(pin, 10);

    const newUser = {
      ...userApi,
      pin: hashedPin,
      permissions: apiPermissions,
    };

    const [insertUser] = await db.insert(users).values(newUser).returning();

    if (insertUser) {
      return NextResponse.json(
        {
          success: true,
          data: insertUser,
        },
        {
          status: 200,
        }
      );
    }

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 401,
      }
    );
  } catch (err: any) {
    console.error("[ERROR]", err.message);
    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}
