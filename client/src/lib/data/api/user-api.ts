import { api } from "@/lib/config/axios-config";
import { LoginType, RegisterType } from "@/lib/data/dtos/user-dtos";
import useAuthStore from "@/lib/store/auth-store";
import { User } from "@/lib/types/user-type";

export const getIsAuthenticated = async () => {
  try {
    const { setAuthenticated } = useAuthStore.getState();
    const response = await api.get("/auth/status");
    setAuthenticated(response.status === 200);
    return response.status === 200;
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

export const getUser = async (): Promise<User | void> => {
  const { authenticated } = useAuthStore.getState();

  if (!authenticated) {
    return;
  }

  const response = await api.get("/user");

  if (response.status !== 200) {
    return;
  }

  return response.data.payload;
};
