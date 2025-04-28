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
