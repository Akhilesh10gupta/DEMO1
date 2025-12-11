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
    fetchProducts: (limit: number, skip: number) => Promise<void>;
    searchProducts: (query: string) => Promise<void>;
    fetchCategories: () => Promise<void>;
    fetchProductsByCategory: (category: string) => Promise<void>;
    fetchProductById: (id: string) => Promise<void>;
}

export const useProductStore = create<ProductState>((set) => ({
    products: [],
    selectedProduct: null,
    categories: [],
    total: 0,
    loading: false,
    error: null,
    fetchProducts: async (limit, skip) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`);
            set({ products: response.data.products, total: response.data.total, loading: false });
        } catch (error) {
            set({ error: 'Failed to fetch products', loading: false });
        }
    },
    searchProducts: async (query) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`https://dummyjson.com/products/search?q=${query}`);
            set({ products: response.data.products, total: response.data.total, loading: false });
        } catch (error) {
            set({ error: 'Failed to search products', loading: false });
        }
    },
    fetchCategories: async () => {
        try {
            const response = await axios.get('https://dummyjson.com/products/categories');
            set({ categories: response.data });
        } catch (error) {
            console.error('Failed to fetch categories', error);
        }
    },
    fetchProductsByCategory: async (category) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`https://dummyjson.com/products/category/${category}`);
            set({ products: response.data.products, total: response.data.total, loading: false });
        } catch (error) {
            set({ error: `Failed to fetch products for category: ${category}`, loading: false });
        }
    },
    fetchProductById: async (id) => {
        set({ loading: true, error: null, selectedProduct: null });
        try {
            const response = await axios.get(`https://dummyjson.com/products/${id}`);
            set({ selectedProduct: response.data, loading: false });
        } catch (error) {
            set({ error: 'Failed to fetch product', loading: false });
        }
    },
}));
