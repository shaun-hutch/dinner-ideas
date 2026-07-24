import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { login as apiLogin, register as apiRegister } from "../api/Api";

interface User {
    id: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    login: async () => {},
    register: async () => {},
    logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem("dinner-ideas-token");
        const storedUser = localStorage.getItem("dinner-ideas-user");
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        const response = await apiLogin(email, password);
        localStorage.setItem("dinner-ideas-token", response.token);
        localStorage.setItem("dinner-ideas-user", JSON.stringify(response.user));
        setToken(response.token);
        setUser(response.user);
    }, []);

    const register = useCallback(async (email: string, password: string) => {
        const response = await apiRegister(email, password);
        localStorage.setItem("dinner-ideas-token", response.token);
        localStorage.setItem("dinner-ideas-user", JSON.stringify(response.user));
        setToken(response.token);
        setUser(response.user);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem("dinner-ideas-token");
        localStorage.removeItem("dinner-ideas-user");
        setToken(null);
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
