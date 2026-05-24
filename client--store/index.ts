import { create } from 'zustand';

import { userSlice, UserSliceType } from './user';
import { UserProfile } from '@/types/user.type';

type StoreTypes = UserSliceType;

export const useStore = create<StoreTypes>((...a) => ({
  ...userSlice(...a),
}));

export const setUser = (user: UserProfile) =>
  useStore.setState((state) => ({ ...state, user }));
