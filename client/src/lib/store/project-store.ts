import { create } from "zustand";
import { LabWithMembers } from "@/lib/types/lab.type";
import { Workspace } from "@/lib/types/workspace-type";

type State = {
  labs: LabWithMembers[] | null;
  workspaces: Workspace[] | null;
  currentWorkspace: Workspace | null;
};

type Actions = {
  setLabs: (lab: LabWithMembers) => void;
  setWorkspaces: (workspace: Workspace[]) => void;
  setCurrentWorkspace: (workspace: Workspace | null) => void;
  reset: () => void;
};

const useProjectStore = create<State & Actions>((set) => ({
  labs: [],
  workspaces: [],
  currentWorkspace: null,
  setLabs: (lab) => set((state) => ({ labs: [...(state.labs || []), lab] })),
  setWorkspaces: (workspaces: Workspace[]) => set({ workspaces }),
  setCurrentWorkspace: (workspace) => set({ currentWorkspace: workspace }),
  reset: () => set({ labs: [], workspaces: [], currentWorkspace: null }),
}));

export default useProjectStore;
