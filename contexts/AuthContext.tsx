'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: 'customer' | 'admin';
    createdAt: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string) => Promise<void>;
    register: (name: string, email: string, phone: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY_USER = 'ifome_user';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = () => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem(STORAGE_KEY_USER);
            if (stored) {
                setUser(JSON.parse(stored));
            }
            setIsLoading(false);
        }
    };

    const login = async (email: string) => {
        // Mock Login - Simula delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Mock: Se email contiver "admin", é admin
        const isAdmin = email.toLowerCase().includes('admin');

        const mockUser: User = {
            id: `usr-${Date.now()}`,
            name: isAdmin ? 'Administrador' : 'Cliente Teste',
            email,
            phone: '11999999999',
            role: isAdmin ? 'admin' : 'customer',
            createdAt: new Date().toISOString()
        };

        // Salvar storage
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(mockUser));
        setUser(mockUser);

        if (isAdmin) {
            router.push('/admin/orders');
        } else {
            router.push('/');
        }
    };

    const register = async (name: string, email: string, phone: string) => {
        await new Promise(resolve => setTimeout(resolve, 800));

        const newUser: User = {
            id: `usr-${Date.now()}`,
            name,
            email,
            phone,
            role: 'customer',
            createdAt: new Date().toISOString()
        };

        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newUser));
        setUser(newUser);
        router.push('/');
    };

    const logout = useCallback(() => {
        localStorage.removeItem(STORAGE_KEY_USER);
        setUser(null);
        router.push('/login');
    }, [router]);

    // Proteção de Rotas
    useEffect(() => {
        if (isLoading) return;

        const publicRoutes = ['/login', '/register', '/', '/search', '/help', '/how-it-works'];
        // Rotas que começam com...
        const isPublic = publicRoutes.includes(pathname) ||
            pathname.startsWith('/product/') ||
            pathname.startsWith('/search');

        if (!user && !isPublic && !pathname.includes('logo')) { // permitir assets
            // Se não logado e rota não pública -> Login
            // Mas para MVP, vamos ser permissivos com rotas de cliente para não travar a demo
            // Apenas bloquear ADMIN e CHECKOUT/PROFILE
            if (pathname.startsWith('/admin') || pathname.startsWith('/checkout') || pathname.startsWith('/profile')) {
                router.push('/login');
            }
        }

        if (user && user.role !== 'admin' && pathname.startsWith('/admin')) {
            router.push('/');
        }
    }, [user, isLoading, pathname, router]);

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            isLoading,
            login,
            register,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
