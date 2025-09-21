import { create } from 'zustand';

import { userSlice, UserSliceType } from './user';

type StoreTypes = UserSliceType;

export const useStore = create<StoreTypes>((...a) => ({
  ...userSlice(...a),
}));
