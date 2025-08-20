import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { LoginType, RegisterType } from "@/api/dto";
import { login, register } from "@/api/user-api";
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
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (payload: LoginType) => login(payload),
    onSuccess: () => {
      navigate({ to: "/" });
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        console.log(err.response);
        setError(err.response?.data?.messages || "Login failed");
      }
    },
  });
};
