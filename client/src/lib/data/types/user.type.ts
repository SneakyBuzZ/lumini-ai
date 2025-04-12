export type Register = {
  email: string;
  password: string;
};

export type Login = {
  email: string;
  password: string;
};

export type AuthResponse = {
  accessToken: string;
};

export type User = {
  name: string;
  email: string;
  image: string;
};
