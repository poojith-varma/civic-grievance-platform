import { create } from 'zustand';

type Role =
  | 'citizen'
  | 'worker'
  | 'admin'
  | null;

type RoleStore = {
  role: Role;

  setRole: (role: Role) => void;
};

export const useRoleStore =
  create<RoleStore>((set) => ({
    role: null,

    setRole: (role) =>
      set({ role }),
  }));