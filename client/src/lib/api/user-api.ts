import { api } from "@/lib/config/axios-config";
import { LoginType, RegisterType } from "@/lib/api/dto";
import { User } from "@/lib/types/user-type";

export const getIsAuthenticated = async () => {
  try {
    await api.get("/auth/status");
    return true;
  } catch {
    return false;
  }
};

export const register = async (data: RegisterType) => {
  await api.post("/user", {
    name: data.name,
    email: data.email,
    password: data.password,
  });
};

export const login = async (data: LoginType) => {
  await api.post("/auth/login", {
    email: data.email,
    password: data.password,
  });
};

export const getUser = async (): Promise<User | null> => {
  try {
    const response = await api.get("/user");
    return response.data.payload as User;
  } catch {
    return null;
  }
};
