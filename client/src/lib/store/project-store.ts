import { create } from "zustand";
import { Lab } from "@/lib/types/lab.type";
import { Workspace } from "@/lib/types/workspace-type";

type State = {
  labs: Lab[] | null;
  workspaces: Workspace[] | null;
  currentWorkspace: Workspace | null;
  currentLab: Lab | null;
};

type Actions = {
  setLabs: (labs: Lab[]) => void;
  setWorkspaces: (workspaces: Workspace[]) => void;
  setCurrentWorkspace: (workspace: Workspace | null) => void;
  setCurrentLab: (lab: Lab | null) => void;
  reset: () => void;
};

const useAppStore = create<State & Actions>((set) => ({
  labs: [],
  workspaces: [],
  currentWorkspace: null,
  currentLab: null,
  setLabs: (labs: Lab[]) => set({ labs }),
  setWorkspaces: (workspaces: Workspace[]) => set({ workspaces }),
  setCurrentWorkspace: (workspace) => set({ currentWorkspace: workspace }),
  setCurrentLab: (lab) => set({ currentLab: lab }),
  reset: () =>
    set({ labs: [], workspaces: [], currentWorkspace: null, currentLab: null }),
}));

export default useAppStore;
