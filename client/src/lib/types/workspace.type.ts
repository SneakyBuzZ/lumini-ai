export type WorkspaceWithMembers = {
  id: string;
  name: string;
  plan: "free" | "pro" | "enterprise";
  createdAt: string;
  owner: {
    id: string;
    name: string;
    image: string | null;
  };
  members: {
    id: string;
    name: string;
    image: string | null;
  }[];
};
