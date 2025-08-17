import { create } from "zustand";
import { User } from "@/lib/types/user-type";

type State = {
  authenticated: boolean;
  user: User | null;
};

type Actions = {
  setAuthenticated: (authenticated: boolean) => void;
  setUser: (user: User) => void;
  reset: () => void;
};

const useAuthStore = create<State & Actions>((set) => ({
  authenticated: false,
  user: null,
  setAuthenticated: (authenticated) => set({ authenticated }),
  setUser: (user) => set({ user }),
  reset: () => set({ authenticated: false, user: null }),
}));

export default useAuthStore;
