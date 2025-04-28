import { create } from "zustand";
import { LabWithMembers } from "../types/lab.type";

type State = {
  lab: LabWithMembers | null;
};

type Actions = {
  setLab: (lab: LabWithMembers) => void;
  reset: () => void;
};

const useLabStore = create<State & Actions>((set) => ({
  lab: null,
  setLab: (lab) => set({ lab }),
  reset: () => set({ lab: null }),
}));

export default useLabStore;
