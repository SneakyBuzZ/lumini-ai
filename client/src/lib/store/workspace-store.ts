import { create } from "zustand";
import { WorkspaceWithMembers } from "@/lib/types/workspace.type";

type State = {
  workspaces: WorkspaceWithMembers[] | null;
  currentWorkspace: WorkspaceWithMembers | null;
};

type Actions = {
  setWorkspaces: (workspace: WorkspaceWithMembers[]) => void;
  setCurrentWorkspace: (workspace: WorkspaceWithMembers | null) => void;
  reset: () => void;
};

const useWorkspacesStore = create<State & Actions>((set) => ({
  workspaces: null,
  currentWorkspace: null,
  setWorkspaces: (workspaces: WorkspaceWithMembers[]) =>
    set(() => ({
      workspaces,
    })),
  setCurrentWorkspace(workspace: WorkspaceWithMembers | null) {
    set(() => ({
      currentWorkspace: workspace,
    }));
  },
  reset: () =>
    set(() => ({
      workspaces: null,
      currentWorkspace: null,
    })),
}));

export default useWorkspacesStore;
