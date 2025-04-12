import { create } from "zustand";

type State = {
  authenticated: boolean;
};

type Actions = {
  setAuthenticated: (authenticated: boolean) => void;
  reset: () => void;
};

const useAuthStore = create<State & Actions>((set) => ({
  authenticated: false,
  setAuthenticated: (authenticated) => set({ authenticated }),
  reset: () => set({ authenticated: false }),
}));

export default useAuthStore;
