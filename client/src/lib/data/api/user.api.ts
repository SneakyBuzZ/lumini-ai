import { api } from "@/lib/config/axios.config";
import { AuthResponse, Register, User } from "@/lib/data/types/user.type";
import useAuthStore from "@/lib/store/auth.store";

export const getIsAuthenticated = async () => {
  try {
    const response = await api.get("/user/is-authenticated");
    return response.status === 200;
  } catch {
    return false;
  }
};

export const register = async ({
  email,
  password,
}: Register): Promise<AuthResponse> => {
  const response = await api.post("/user/register", {
    email,
    password,
  });
  return response.data.payload;
};

export const login = async ({
  email,
  password,
}: Register): Promise<AuthResponse> => {
  const response = await api.post("/user/login", {
    email,
    password,
  });
  return response.data.payload;
};

export const getUser = async (): Promise<User | void> => {
  const { authenticated } = useAuthStore.getState();

  if (!authenticated) {
    return;
  }

  const response = await api.get("/user");
  return response.data.payload;
};
