import { z } from "zod";

export const RegisterUserDTO = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6).max(100),
  inviteToken: z.string().optional(),
});

export const LoginUserDTO = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

export const VerifyEmailDTO = z.object({
  token: z.string(),
});

export type RegisterUserDTOType = z.infer<typeof RegisterUserDTO>;
export type LoginUserDTOType = z.infer<typeof LoginUserDTO>;
export type VerifyEmailDTOType = z.infer<typeof VerifyEmailDTO>;
