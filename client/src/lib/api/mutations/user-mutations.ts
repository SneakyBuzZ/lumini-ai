import { useMutation } from "@tanstack/react-query";
import { LoginType, RegisterType } from "@/lib/api/dto";
import {
  login,
  logout,
  register,
  resendVerificationEmail,
} from "@/lib/api/user-api";
import { AxiosError } from "axios";

export const useRegister = (setError: (error: string | null) => void) => {
  return useMutation({
    mutationFn: (payload: RegisterType) => register(payload),
    onError: (err) => {
      if (err instanceof AxiosError) {
        setError(
          err.response?.data?.messages ||
            "Server not responding, please try later",
        );
      }
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

export const useLogout = () => {
  return useMutation({
    mutationFn: logout,
  });
};

export const useResendVerificationEmail = () => {
  return useMutation({
    mutationFn: resendVerificationEmail,
  });
};
