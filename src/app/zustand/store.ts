import { create } from "zustand";
import { Channel } from "../types/types";

interface GlobalStore {
  currentUsername: string;
  setCurrentUsername: (username: string) => void;
  currentUserDetails: Channel;
  setCurrentUserDetails: (currentUserDetails: Channel) => void;
}

export const useGlobalStore = create<GlobalStore>((set) => ({
  currentUsername: "",
  setCurrentUsername: (username: string) => set({ currentUsername: username }),
  currentUserDetails: {} as Channel,
  setCurrentUserDetails: (currentUserDetails: Channel) =>
    set({ currentUserDetails: currentUserDetails }),
}));
