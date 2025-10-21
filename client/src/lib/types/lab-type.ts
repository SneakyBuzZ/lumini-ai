export type LabWithMembers = {
  id: string;
  name: string;
  githubUrl: string;
  creator: {
    name: string;
    image: string;
  };
  workspace: {
    id: string;
    name: string;
  };
  createdAt: string;
};

export type Lab = {
  id: string;
  name: string;
  githubUrl: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  creator: {
    id: string;
    image: string | null;
    name: string;
    email: string;
    createdAt: string;
  };
};

export type LabTable = {
  name: string;
  githubUrl: string;
  creator: {
    id: string;
    image: string | null;
    name: string;
    email: string;
    createdAt: string;
  };
  createdAt: string;
};

export type LabChat = {
  id: string;
  userId: string | null;
  sessionId: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
  updatedAt: string;
};
