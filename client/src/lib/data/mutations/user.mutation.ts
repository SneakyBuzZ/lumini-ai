import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Login, Register } from "@/lib/data/types/user.type";
import { login, register } from "@/lib/data/api/user.api";

export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: Register) => register(payload),
    onSuccess: () => {
      navigate("/app");
    },
    onError: (err) => {
      console.error("Register failed", err);
    },
  });
};

export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: Login) => login(payload),
    onSuccess: () => {
      navigate("/app");
    },
    onError: (err) => {
      console.error("Login failed", err);
    },
  });
};
