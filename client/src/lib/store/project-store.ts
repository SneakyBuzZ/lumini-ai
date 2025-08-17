import { create } from "zustand";
import { LabWithMembers } from "../types/lab.type";
import { WorkspaceWithMembers } from "../types/workspace.type";

type State = {
  labs: LabWithMembers[] | null;
  workspaces: WorkspaceWithMembers[] | null;
  currentWorkspace: WorkspaceWithMembers | null;
};

type Actions = {
  setLabs: (lab: LabWithMembers) => void;
  setWorkspaces: (workspace: WorkspaceWithMembers) => void;
  setCurrentWorkspace: (workspace: WorkspaceWithMembers | null) => void;
  reset: () => void;
};

const useProjectStore = create<State & Actions>((set) => ({
  labs: [],
  workspaces: [],
  currentWorkspace: null,
  setLabs: (lab) => set((state) => ({ labs: [...(state.labs || []), lab] })),
  setWorkspaces: (workspace) =>
    set((state) => ({ workspaces: [...(state.workspaces || []), workspace] })),
  setCurrentWorkspace: (workspace) => set({ currentWorkspace: workspace }),
  reset: () => set({ labs: [], workspaces: [], currentWorkspace: null }),
}));

export default useProjectStore;
