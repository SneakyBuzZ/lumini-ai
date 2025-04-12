import { create } from "zustand";
import { Workspace } from "../data/types/workspace.type";

type State = {
  workspace: Workspace | null;
};

type Actions = {
  setUser: (workspace: Workspace) => void;
  resetUser: () => void;
};

const useWorkspaceStore = create<State & Actions>((set) => ({
  workspace: null,
  setUser: (workspace) =>
    set((state) => ({ workspace: { ...state.workspace, ...workspace } })),
  resetUser: () =>
    set(() => ({
      workspace: null,
    })),
}));

export default useWorkspaceStore;
