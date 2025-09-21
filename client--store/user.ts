import { UserProfile } from '@/types/user.type';
import { StateCreator } from 'zustand';

export interface UserSliceType {
  user: UserProfile | null;
  setUser: (data: UserProfile | null) => void;
  clearUser: () => void;
}

export const userSlice: StateCreator<UserSliceType> = (set) => ({
  user: null,
  setUser: (data) => {
    set({ user: data });
  },
  clearUser: () => {
    set({ user: null });
  },
});
