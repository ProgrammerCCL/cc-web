"use server";

import env from "@/env";
import { UAT_CONSTANT, PROD_CONSTANT } from "@/lib/world-market/constans";

interface IcheckValueRespCheck {
  error: boolean;
  message: string;
  data: string;
}

interface IcheckValueRespSend {
  error: boolean;
  message: string;
  data: string;
  httpStatus: number;
}

const isProd = env.WM_MODE === "production";
const WM_DETAILS = isProd ? PROD_CONSTANT : UAT_CONSTANT;

// Function สำหรับเรียก API Checkvalue
export async function checkValue(
  memberId: string
): Promise<IcheckValueRespCheck> {
  try {
    const { fullPath, method, Authorization, Username, Password, Flag } =
      WM_DETAILS.checkMember;

    // ตรวจสอบตัวแปรจาก .env.local
    if (!fullPath || !Authorization) {
      return {
        error: true,
        message:
          "Missing required environment variables: CHECKVALUE_API_URL or CHECKVALUE_AUTH_TOKEN",
        data: "", // หรืออาจจะเป็นข้อมูลที่ไม่ใช่ข้อความว่าง
      };
    }

    const res = await fetch(fullPath, {
      method,
      headers: {
        Authorization,
        Username, // ค่า USER จาก constant
        Password, // ค่า PASSWORD จาก constant
        Flag,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        member_id: memberId,
      }),
    });

    const { error, message, data } = await res.json();

    console.debug(["DEBUG Member-Id"], error, message, data);
    // ถ้า API ส่ง error: false (แสดงว่าเรียก API สำเร็จ)
    if (!error) {
      return {
        error: false,
        message: message || "No message",
        data: data || "No Data", // ใช้ข้อมูลจาก API หรือข้อความว่างหากไม่มีข้อมูล
      };
    }

    // ถ้า API ส่ง error: true
    return {
      error: true,
      message: message || "No message",
      data: data || "No Data", // ข้อมูลเป็นค่าว่างหากเกิดข้อผิดพลาด
    };
  } catch (error: any) {
    console.error("Error calling CheckValue API:", error);
    return {
      error: true,
      message: `Error calling CheckValue API: ${error.message || error}`,
      data: "",
    };
  }
}

export async function sendValue(
  memberId: string,
  amount: number,
  userId: string
): Promise<IcheckValueRespSend> {
  try {
    const { fullPath, method, Authorization, Username, Password, Flag } =
      WM_DETAILS.sendSuccess;

    // ตรวจสอบตัวแปรจาก .env.local
    if (!fullPath || !Authorization) {
      return {
        error: true,
        message:
          "Missing required environment variables: CHECKVALUE_API_URL or CHECKVALUE_AUTH_TOKEN",
        data: "", // หรืออาจจะเป็นข้อมูลที่ไม่ใช่ข้อความว่าง
        httpStatus: 5000,
      };
    }

    console.log("DEBUG sendValue", { memberId, amount, userId });

    const res = await fetch(fullPath, {
      method,
      headers: {
        Authorization,
        Username, // ค่า USER จาก .env
        Password, // ค่า PASSWORD จาก .env
        Flag,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        member_id: memberId,
        amount,
        xuser: userId,
      }),
    });

    const { error, message, data } = await res.json();

    // ใช้ status HTTP จากการตอบกลับ
    const httpStatus = res.status;

    // CASE 1 : SUCCESS => API ส่ง error: false (แสดงว่าเรียก API สำเร็จ)
    if (error === false) {
      return {
        error,
        message: message || "No message",
        data: data || "No Data", // ใช้ข้อมูลจาก API หรือข้อความว่างหากไม่มีข้อมูล
        httpStatus, // ใช้ shorthand ที่นี่
      };
    }

    // CASE 2 : FAILED => API ส่ง error: true
    // CASE 3 : FAILED => Fetch failed ไม่ได้อะไรกลับมาเลย
    return {
      error: true, // error = true | error = null | error = undefined
      message: message || "No message",
      data: data || "No Data", // ข้อมูลเป็นค่าว่างหากเกิดข้อผิดพลาด
      httpStatus, // ใช้ shorthand ที่นี่
    };
  } catch (error: any) {
    console.error("Error calling SENDValue API:", error);
    return {
      error: true,
      message: `Error calling SENDValue API: ${error.message || error}`,
      data: "",
      httpStatus: 5000, // กำหนด httpStatus เป็น 5000 เมื่อเกิดข้อผิดพลาด จากฝั่งเรา
    };
  }
}
