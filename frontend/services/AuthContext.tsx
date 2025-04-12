'use client';
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { loginUser as apiLogin, logoutUser as apiLogout } from '../services/api'; // Assuming api.ts exports these

interface User {
    id: number;
    username: string;
}

// Define the shape of the context data
interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    isLoading: boolean; 
    login: (credentials: any) => Promise<void>; 
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the provider component
interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true); // Start loading

    // Check for token in localStorage on initial mount
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const userInfo = localStorage.getItem('userInfo');
        if (token && userInfo) {
            try {
                setIsAuthenticated(true);
                setUser(JSON.parse(userInfo));
            } catch (error) {
                console.error("Failed to parse user info from localStorage", error);
                localStorage.removeItem('authToken');
                localStorage.removeItem('userInfo');
            }
        }
        setIsLoading(false); // Finished initial check
    }, []);

    const login = async (credentials: any) => {
        try {
            const response = await apiLogin(credentials); // apiLogin handles localStorage
            setIsAuthenticated(true);
            setUser(response.user); // Assuming login response includes user object
        } catch (error) {
            setIsAuthenticated(false);
            setUser(null);
            // Ensure storage is cleared on failed login attempt
            localStorage.removeItem('authToken');
            localStorage.removeItem('userInfo');
            console.error("Login failed in context:", error);
            throw error; 
        }
    };

    const logout = () => {
        apiLogout(); // apiLogout handles localStorage removal
        setIsAuthenticated(false);
        setUser(null);
    };

    const value = {
        isAuthenticated,
        user,
        isLoading,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};