// Zustand was chosen for state management due to its simplicity, small footprint,
// and built-in capabilities for handling asynchronous actions. It's often preferred
// over more complex solutions like Redux for small to medium-sized applications
// where a lightweight and intuitive state management solution is desired.

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
  cache: Record<string, { users: User[], total: number, timestamp: number }>; // Cache for list results
  fetchUsers: (limit: number, skip: number) => Promise<void>;
  searchUsers: (query: string) => Promise<void>;
  fetchUserById: (id: string) => Promise<void>;
}

// Client-side caching helps avoid unnecessary repeat API calls, improving performance
// and reducing server load. This strategy stores fetched user lists in memory (Zustand store)
// for a defined duration (CACHE_DURATION). If a request with the same parameters
// is made within this duration, the cached data is returned instantly.
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  selectedUser: null,
  total: 0,
  loading: false,
  error: null,
  // Initialize cache
  cache: {}, 

  fetchUsers: async (limit, skip) => {
    set({ loading: true, error: null });
    const cacheKey = `users-limit-${limit}-skip-${skip}`;
    const cachedData = get().cache[cacheKey];

    // Caching Strategy:
    // Check if data is in cache and has not expired.
    // If valid, use cached data. Otherwise, fetch from API.
    // This reduces redundant API calls for frequently requested pages.
    if (cachedData && (Date.now() - cachedData.timestamp < CACHE_DURATION)) {
      set({ users: cachedData.users, total: cachedData.total, loading: false });
      return;
    }

    try {
      const response = await axios.get(`https://dummyjson.com/users?limit=${limit}&skip=${skip}`);
      const newUsers = response.data.users;
      const newTotal = response.data.total;
      set((state) => ({ 
        users: newUsers, 
        total: newTotal, 
        loading: false,
        cache: {
            ...state.cache,
            [cacheKey]: { users: newUsers, total: newTotal, timestamp: Date.now() },
        },
      }));
    } catch (error) {
      set({ error: 'Failed to fetch users', loading: false });
    }
  },
  searchUsers: async (query) => {
    set({ loading: true, error: null });
    const cacheKey = `search-query-${query}`;
    const cachedData = get().cache[cacheKey];

    // Caching Strategy:
    // Similar to fetchUsers, if search results for a specific query are cached
    // and still valid, they are used to prevent re-fetching the same results.
    if (cachedData && (Date.now() - cachedData.timestamp < CACHE_DURATION)) {
      set({ users: cachedData.users, total: cachedData.total, loading: false });
      return;
    }

    try {
      const response = await axios.get(`https://dummyjson.com/users/search?q=${query}`);
      const newUsers = response.data.users;
      const newTotal = response.data.total;
      set((state) => ({ 
        users: newUsers, 
        total: newTotal, 
        loading: false,
        cache: {
            ...state.cache,
            [cacheKey]: { users: newUsers, total: newTotal, timestamp: Date.now() },
        },
      }));
    } catch (error) {
      set({ error: 'Failed to search users', loading: false });
    }
  },
  fetchUserById: async (id) => {
    set({ loading: true, error: null, selectedUser: null });
    // Caching Strategy:
    // Individual user details are not aggressively cached in this store to ensure
    // the most up-to-date information is always fetched when viewing details.
    // For frequently accessed static user profiles, a similar caching mechanism
    // could be applied here.
    try {
      const response = await axios.get(`https://dummyjson.com/users/${id}`);
      set({ selectedUser: response.data, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch user', loading: false });
    }
    },
}));
