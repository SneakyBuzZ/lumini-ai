import { api } from "@/lib/config/axios-config";
import { LoginType, RegisterType } from "@/lib/api/dto";
import { User } from "@/lib/types/user-type";
import { delay } from "@/utils/delay";
import { AxiosError } from "axios";

export const getIsAuthenticated = async () => {
  try {
    await api.get("/auth/status");
    return true;
  } catch {
    return false;
  }
};

export const register = async (data: RegisterType) => {
  await delay(1000);
  await api.post("/auth/register", data);
};

export const login = async (data: LoginType) => {
  await api.post("/auth/login", {
    email: data.email,
    password: data.password,
  });
};

export const logout = async () => {
  await api.post("/auth/logout");
};

export const getUser = async (): Promise<User | null> => {
  try {
    const response = await api.get("/user");
    return response.data.payload as User;
  } catch {
    return null;
  }
};

export const verifyEmail = async (token: string) => {
  await delay(1000);
  try {
    const response = await api.post("/auth/verify/email", { token });
    return {
      success: true,
      message: response.data.message || "Email verified successfully.",
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        message: error?.response?.data.messages || "Email verification failed",
      };
    }
  }
  return { success: false, message: "Email verification failed" };
};

export const resendVerificationEmail = async () => {
  try {
    await api.post("/auth/verify/email/resend");
  } catch {
    throw new Error("Failed to resend verification email");
  }
};
