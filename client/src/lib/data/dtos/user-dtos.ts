export type RegisterType = {
  name: string;
  email: string;
  password: string;
};

export type LoginType = {
  email: string;
  password: string;
};

export type AuthResponse = {
  accessToken: string;
};
