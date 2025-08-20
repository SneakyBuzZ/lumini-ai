export type RegisterType = {
  name: string;
  email: string;
  password: string;
};

export type LoginType = {
  email: string;
  password: string;
};

export type CreateLab = {
  name: string;
  githubUrl: string;
  workspaceId: string;
  plan: "free" | "pro" | "enterprise";
};

export type CreateWorkspace = {
  name: string;
  plan: "free" | "pro" | "enterprise";
};
