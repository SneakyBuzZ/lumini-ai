import { z } from "zod";

export const RegisterUserDTO = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

export const LoginUserDTO = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

export type RegisterUserDTOType = z.infer<typeof RegisterUserDTO>;
export type LoginUserDTOType = z.infer<typeof LoginUserDTO>;
