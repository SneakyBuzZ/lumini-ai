export type CreateWorkspace = {
  name: string;
  plan: "free" | "pro" | "enterprise";
};

// export type Workspace = {
//   id: string;
//   name: string;
//   plan: string;
//   ownerId: string;
//   labLimit: number;
//   membersLimit: number;
//   createdAt: string;
//   updatedAt: string;
// };

// export type WorkspaceSettings = {
//   info: {
//     name: string;
//     plan: string;
//     ownerName: string;
//     ownerImage: string;
//     ownerEmail: string;
//     ownerCreatedAt: string;
//     createdAt: string;
//   };
//   settings: {
//     maxLabs: number;
//     maxWorkspaceUsers: number;
//     allowWorkspaceInvites: boolean;
//     visibility: "public" | "private";
//     allowGithubSync: boolean;
//   };
//   members: Array<{
//     id: string;
//     name: string;
//     image: string;
//     email: string;
//     joinedAt: string;
//     role: "Owner" | "Member";
//   }>;
// };
