import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { LoginType, RegisterType } from "@/lib/api/dto";
import { login, register } from "@/lib/api/user-api";
import { AxiosError } from "axios";

export const useRegister = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (payload: RegisterType) => register(payload),
    onSuccess: () => {
      navigate({ to: "/auth/login" });
    },
    onError: (err) => {
      console.error("Register failed", err);
    },
  });
};

export const useLogin = (setError: (error: string | null) => void) => {
  return useMutation({
    mutationFn: (payload: LoginType) => login(payload),
    onError: (err) => {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.messages || "Login failed");
      }
    },
  });
};
