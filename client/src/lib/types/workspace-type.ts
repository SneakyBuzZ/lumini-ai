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

export type Workspace = {
  id: string;
  name: string;
  plan: "free" | "pro" | "enterprise";
  slug: string;
  createdAt: string;
};

export type WorkspaceSettingsGeneral = {
  name: string;
  description: string | null;
  logoUrl: string | null;
  slug: string | null;
  settings: {
    defaultLanguage: string;
    notificationsEnabled: boolean;
    visibility: string;
  };
};

export type WorkspaceSettingsMap = {
  general: WorkspaceSettingsGeneral;
  integrations: unknown;
  usage: unknown;
};

export type WorkspaceMember = {
  joinedAt: string;
  role: "owner" | "developer" | "administrator";
  member: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
};
