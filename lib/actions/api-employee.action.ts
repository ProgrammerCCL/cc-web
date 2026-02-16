"use server";

import env from "@/env";
import { IEmployee } from "@/types/model/user.type";
import { z } from "zod";
import { CreateUserSchema } from "../validations/user.validation";

// Endpoint: GET /api/v2/user
// Description: Retrieve a list of all employees.
export async function getEmployeeList(): Promise<{
  success: boolean;
  data: IEmployee[];
  error?: string;
}> {
  try {
    const response = await fetch(`${env.API_URL}/api/v2/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        apikey: env.API_KEY,
        apisecret: env.API_SECRET,
      },
    });
    const { success, data, error } = await response.json();

    if (success) {
      return {
        success: true,
        data,
      };
    }

    return {
      success: false,
      data: [],
      error,
    };
  } catch (error: any) {
    console.error("Error get user list:", error);
    return {
      success: false,
      data: [],
      error: `Error : ${error.message}`,
    };
  }
}

// TODO: 2. Get Employee by ID
// * Endpoint: GET /api/v2/user/{id}
// * Description: Retrieve a specific employee by their ID.
export async function getEmployeeById(id: string): Promise<{
  success: boolean;
  data: IEmployee[];
  error?: string;
}> {
  try {
    const response = await fetch(`${env.API_URL}/api/v2/user/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        apikey: env.API_KEY,
        apisecret: env.API_SECRET,
      },
    });

    const { success, data } = await response.json();

    return {
      success,
      data,
    };
  } catch (error: any) {
    console.error("Error fetching user by ID:", error);
    return {
      success: false,
      data: [],
      error: `Error : ${error.message}`,
    };
  }
}

// TODO: 3. Create User
// * Endpoint: POST /api/v2/user
// * Description: Create a new employee.
// * Request Body:
// *
// *     "username": "string",
// *     "pin": "string (4 digits)",
// *     "displayName": "string",
// *     "isManager": "boolean",
// *     "permissions": "string (e.g., JSON array)"
// * }
export async function createEmployee(
  user: z.infer<typeof CreateUserSchema>
): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  const validData = CreateUserSchema.safeParse(user);
  if (!validData.success) {
    return {
      success: false,
      error: "Validation failed : request data",
    };
  }

  try {
    const response = await fetch(`${env.API_URL}/api/v2/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: env.API_KEY,
        apisecret: env.API_SECRET,
      },
      body: JSON.stringify(validData.data),
    });

    const { success, error } = await response.json();

    if (!success) {
      throw new Error(error || "API create user failed.");
    }

    return {
      success: true,
      message: "User create : success",
    };
  } catch (error: any) {
    console.error("Error creating user:", error.message);
    return {
      success: false,
      error: `Error : ${error.message}`,
    };
  }
}

// * Endpoint: DELETE /api/v2/user/{id}
// * Description: Delete an employee by their ID.
export async function deleteEmployeeById(id: string): Promise<{
  success: boolean;
  data?: IEmployee[];
  message?: string;
  error?: string;
}> {
  try {
    const response = await fetch(`${env.API_URL}/api/v2/user/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        apikey: env.API_KEY,
        apisecret: env.API_SECRET,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete user");
    }

    return {
      success: true,
      message: "User deleted successfully",
    };
  } catch (error: any) {
    console.error("Error deleting user:", error);
    return {
      success: false,
      data: [],
      error: `Error : ${error.message}`,
    };
  }
}

// * Endpoint: GET /api/v2/user/permission
// * Description: Retrieve a list of all possible permissions.
export async function getAllPermissions(): Promise<{
  success: boolean;
  data: string[];
  error?: string;
}> {
  try {
    const response = await fetch(`${env.API_URL}/api/v2/user/permission`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        apikey: env.API_KEY,
        apisecret: env.API_SECRET,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch permissions");
    }

    const { success, data } = await response.json();
    return {
      success,
      data: data || [],
    };
  } catch (error: any) {
    console.error("Error fetching permissions:", error);
    return {
      success: false,
      data: [],
      error: `Error : ${error.message}`,
    };
  }
}
