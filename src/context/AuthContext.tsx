'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { loginApi, checkMeApi, logoutApi } from '../services/authService';

export interface UserData {
    id: string; // Cambiado de uuid a id para hacer match con Supabase
    name: string;
    email: string;
    role: 'administrador' | 'encargado_sistemas' | 'usuario';
}

interface AuthContextType {
    user: UserData | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; role?: string; error?: string }>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    const checkSession = async () => {
        try {
            const userData = await checkMeApi();
            if (userData) {
                setUser(userData as UserData);
            }
        } catch (error) {
            console.error("Sesión no encontrada:", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        checkSession();
    }, []);

    async function login(email: string, password: string) {
        try {
            const userData = await loginApi(email, password);
            setUser(userData as UserData);
            return { success: true, role: userData.role };
        } catch (error: any) {
            console.error("Login falló", error);
            return { success: false, error: error.message };
        }
    }

    async function logout() {
        try {
            await logoutApi(); 
        } catch (error) {
            console.error("Error al cerrar sesión", error);
        }
        setUser(null);
        window.location.href = '/login'; 
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuthContext debe ser usado dentro de un AuthProvider");
    }
    return context;
};