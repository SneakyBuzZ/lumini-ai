import { create } from "zustand";
import { User } from "@/lib/data/types/user-types";

type State = {
  user: {
    name: string | null;
    email: string | null;
    image: string | null;
  };
};

type Actions = {
  setUser: (user: User) => void;
  resetUser: () => void;
};

const useUserStore = create<State & Actions>((set) => ({
  user: {
    name: null,
    email: null,
    image: null,
  },
  setUser: (user) => set((state) => ({ user: { ...state.user, ...user } })),
  resetUser: () =>
    set(() => ({
      user: {
        name: null,
        email: null,
        image: null,
      },
    })),
}));

export default useUserStore;
