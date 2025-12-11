import { create } from 'zustand';
import axios from 'axios';

interface User {
    id: number;
    firstName: string;
    lastName: string;
    maidenName: string;
    age: number;
    gender: string;
    email: string;
    phone: string;
    username: string;
    birthDate: string;
    image: string;
    bloodGroup: string;
    height: number;
    weight: number;
    eyeColor: string;
    hair: {
        color: string;
        type: string;
    };
    domain: string;
    ip: string;
    address: {
        address: string;
        city: string;
        coordinates: {
            lat: number;
            lng: number;
        };
        postalCode: string;
        state: string;
    };
    macAddress: string;
    university: string;
    bank: {
        cardExpire: string;
        cardNumber: string;
        cardType: string;
        currency: string;
        iban: string;
    };
    company: {
        address: {
            address: string;
            city: string;
            coordinates: {
                lat: number;
                lng: number;
            };
            postalCode: string;
            state: string;
        };
        department: string;
        name: string;
        title: string;
    };
    ein: string;
    ssn: string;
    userAgent: string;
}

interface UserState {
  users: User[];
  selectedUser: User | null;
  total: number;
  loading: boolean;
  error: string | null;
  fetchUsers: (limit: number, skip: number) => Promise<void>;
  searchUsers: (query: string) => Promise<void>;
  fetchUserById: (id: string) => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  selectedUser: null,
  total: 0,
  loading: false,
  error: null,
  fetchUsers: async (limit, skip) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`https://dummyjson.com/users?limit=${limit}&skip=${skip}`);
      set({ users: response.data.users, total: response.data.total, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch users', loading: false });
    }
  },
  searchUsers: async (query) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`https://dummyjson.com/users/search?q=${query}`);
      set({ users: response.data.users, total: response.data.total, loading: false });
    } catch (error) {
      set({ error: 'Failed to search users', loading: false });
    }
  },
  fetchUserById: async (id) => {
    set({ loading: true, error: null, selectedUser: null });
    try {
      const response = await axios.get(`https://dummyjson.com/users/${id}`);
      set({ selectedUser: response.data, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch user', loading: false });
    }
    },
}));
