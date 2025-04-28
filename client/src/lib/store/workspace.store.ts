import { create } from "zustand";
import { WorkspaceWithMembers } from "@/lib/types/workspace.type";

type State = {
  workspaces: WorkspaceWithMembers[] | null;
};

type Actions = {
  setWorkspaces: (workspace: WorkspaceWithMembers[]) => void;
  reset: () => void;
};

const useWorkspacesStore = create<State & Actions>((set) => ({
  workspaces: null,
  setWorkspaces: (workspaces: WorkspaceWithMembers[]) =>
    set(() => ({
      workspaces,
    })),
  reset: () =>
    set(() => ({
      workspaces: null,
    })),
}));

export default useWorkspacesStore;
