'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { loginUser as apiLogin, logoutUser as apiLogout } from '../services/api'; // Assuming api.ts exports these

// Define the shape of the user object (adjust based on your backend response)
interface User {
    id: number;
    username: string;
    // Add other relevant user fields
}

// Define the shape of the context data
interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    isLoading: boolean; // To handle initial check
    login: (credentials: any) => Promise<void>; // Adjust 'any' to your credentials type
    logout: () => void;
}

// Create the context with a default value (can be undefined or null initially)
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
                // Basic check: If token exists, assume authenticated for initial load.
                // A better check would involve verifying the token with the backend.
                setIsAuthenticated(true);
                setUser(JSON.parse(userInfo));
            } catch (error) {
                console.error("Failed to parse user info from localStorage", error);
                // Clear invalid storage if parsing fails
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
            throw error; // Re-throw error so the form can handle it
        }
    };

    const logout = () => {
        apiLogout(); // apiLogout handles localStorage removal
        setIsAuthenticated(false);
        setUser(null);
        // Optionally redirect to login page or home page
    };

    // Value provided to consuming components
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