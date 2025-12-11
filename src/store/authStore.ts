// Zustand was chosen for state management due to its simplicity, small footprint,
// and built-in capabilities for handling asynchronous actions. It's often preferred
// over more complex solutions like Redux for small to medium-sized applications
// where a lightweight and intuitive state management solution is desired.

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

interface AuthState {
  token: string | null;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => void;
  setToken: (token: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),
      login: async (credentials) => {
        const response = await axios.post('https://dummyjson.com/auth/login', credentials);
        const { token } = response.data;
        set({ token });
      },
      logout: () => set({ token: null }),
    }),
    {
      name: 'auth-storage', // name of the item in the storage (must be unique)
    }
  )
);
