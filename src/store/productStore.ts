// Zustand was chosen for state management due to its simplicity, small footprint,
// and built-in capabilities for handling asynchronous actions. It's often preferred
// over more complex solutions like Redux for small to medium-sized applications
// where a lightweight and intuitive state management solution is desired.

import { create } from 'zustand';
import axios from 'axios';

interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    brand: string;
    category: string;
    thumbnail: string;
    images: string[];
}

interface Category {
    slug: string;
    name: string;
    url: string;
}

interface ProductState {
    products: Product[];
    selectedProduct: Product | null;
    categories: Category[];
    total: number;
    loading: boolean;
    error: string | null;
    cache: Record<string, { data: any, timestamp: number }>; // Cache for various product-related data
    fetchProducts: (limit: number, skip: number) => Promise<void>;
    searchProducts: (query: string) => Promise<void>;
    fetchCategories: () => Promise<void>;
    fetchProductsByCategory: (category: string) => Promise<void>;
    fetchProductById: (id: string) => Promise<void>;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export const useProductStore = create<ProductState>((set, get) => ({
    products: [],
    selectedProduct: null,
    categories: [],
    total: 0,
    loading: false,
    error: null,
    cache: {}, // Initialize cache

    fetchProducts: async (limit, skip) => {
        set({ loading: true, error: null });
        const cacheKey = `products-limit-${limit}-skip-${skip}`;
        const cachedData = get().cache[cacheKey];

        // Caching Strategy:
        // Stores product list results based on pagination parameters.
        // If data for the given limit/skip is fresh, it's served from cache,
        // reducing API calls for page navigation.
        if (cachedData && (Date.now() - cachedData.timestamp < CACHE_DURATION)) {
            set({ products: cachedData.data.products, total: cachedData.data.total, loading: false });
            return;
        }

        try {
            const response = await axios.get(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`);
            const newProducts = response.data.products;
            const newTotal = response.data.total;
            set((state) => ({
                products: newProducts,
                total: newTotal,
                loading: false,
                cache: {
                    ...state.cache,
                    [cacheKey]: { data: { products: newProducts, total: newTotal }, timestamp: Date.now() },
                },
            }));
        } catch (error) {
            set({ error: 'Failed to fetch products', loading: false });
        }
    },
    searchProducts: async (query) => {
        set({ loading: true, error: null });
        const cacheKey = `products-search-query-${query}`;
        const cachedData = get().cache[cacheKey];

        // Caching Strategy:
        // Caches search results for a specific query. If the same search is
        // performed within the cache duration, results are returned instantly.
        if (cachedData && (Date.now() - cachedData.timestamp < CACHE_DURATION)) {
            set({ products: cachedData.data.products, total: cachedData.data.total, loading: false });
            return;
        }

        try {
            const response = await axios.get(`https://dummyjson.com/products/search?q=${query}`);
            const newProducts = response.data.products;
            const newTotal = response.data.total;
            set((state) => ({
                products: newProducts,
                total: newTotal,
                loading: false,
                cache: {
                    ...state.cache,
                    [cacheKey]: { data: { products: newProducts, total: newTotal }, timestamp: Date.now() },
                },
            }));
        } catch (error) {
            set({ error: 'Failed to search products', loading: false });
        }
    },
    fetchCategories: async () => {
        const cacheKey = 'product-categories';
        const cachedData = get().cache[cacheKey];

        // Caching Strategy:
        // Categories are relatively static. This caches the list of product
        // categories, avoiding repeated API calls for this consistent data.
        if (cachedData && (Date.now() - cachedData.timestamp < CACHE_DURATION)) {
            set({ categories: cachedData.data, loading: false });
            return;
        }

        try {
            const response = await axios.get('https://dummyjson.com/products/categories');
            const newCategories = response.data;
            set((state) => ({
                categories: newCategories,
                cache: {
                    ...state.cache,
                    [cacheKey]: { data: newCategories, timestamp: Date.now() },
                },
            }));
        } catch (error) {
            console.error('Failed to fetch categories', error);
            set({ error: 'Failed to fetch categories' }); // Update state error for UI
        }
    },
    fetchProductsByCategory: async (category) => {
        set({ loading: true, error: null });
        const cacheKey = `products-category-${category}`;
        const cachedData = get().cache[cacheKey];

        // Caching Strategy:
        // Caches product lists filtered by category. If a user re-selects a
        // recently viewed category, the cached data is used.
        if (cachedData && (Date.now() - cachedData.timestamp < CACHE_DURATION)) {
            set({ products: cachedData.data.products, total: cachedData.data.total, loading: false });
            return;
        }

        try {
            const response = await axios.get(`https://dummyjson.com/products/category/${category}`);
            const newProducts = response.data.products;
            const newTotal = response.data.total;
            set((state) => ({
                products: newProducts,
                total: newTotal,
                loading: false,
                cache: {
                    ...state.cache,
                    [cacheKey]: { data: { products: newProducts, total: newTotal }, timestamp: Date.now() },
                },
            }));
        } catch (error) {
            set({ error: `Failed to fetch products for category: ${category}`, loading: false });
        }
    },
    fetchProductById: async (id) => {
        set({ loading: true, error: null, selectedProduct: null });
        const cacheKey = `product-id-${id}`;
        const cachedData = get().cache[cacheKey];

        // Caching Strategy:
        // Caches individual product details. This is useful if users frequently
        // navigate to and from a product detail page, or if multiple components
        // on the same page need the same product data.
        if (cachedData && (Date.now() - cachedData.timestamp < CACHE_DURATION)) {
            set({ selectedProduct: cachedData.data, loading: false });
            return;
        }

        try {
            const response = await axios.get(`https://dummyjson.com/products/${id}`);
            const newProduct = response.data;
            set((state) => ({
                selectedProduct: newProduct,
                loading: false,
                cache: {
                    ...state.cache,
                    [cacheKey]: { data: newProduct, timestamp: Date.now() },
                },
            }));
        } catch (error) {
            set({ error: 'Failed to fetch product', loading: false });
        }
    },
}));
