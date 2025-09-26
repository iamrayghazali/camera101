import {createContext, useContext, useState, useEffect, type ReactNode} from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

type AuthContextType = {
    token: string | null;
    user: any;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    register: (username: string, email: string, password: string) => Promise<boolean>;
    logout: () => void;
    clearAuth: () => void;
    loading: boolean;
    initialLoading: boolean;
    errors: Record<string, string[]>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    // Load token from localStorage on mount
    useEffect(() => {
        const savedToken = localStorage.getItem("authToken");
        const savedUser = localStorage.getItem("authUser");
        if (savedToken) {
            setToken(savedToken);
            if (savedUser) {
                setUser(JSON.parse(savedUser));
            }
        }
        setInitialLoading(false);
    }, []);

    // Listen for token expiration events
    useEffect(() => {
        const handleTokenExpired = () => {
            setToken(null);
            setUser(null);
        };

        window.addEventListener('auth:token-expired', handleTokenExpired);
        return () => window.removeEventListener('auth:token-expired', handleTokenExpired);
    }, []);

    // TODO: add paid-check logic later if needed

    const login = async (email: string, password: string): Promise<boolean> => {
        setLoading(true);
        setErrors({});
        try {
            const normalizedEmail = email.trim().toLowerCase();
            const { data } = await axios.post(`${API_BASE_URL}/api/payments/token/`, { email: normalizedEmail, password });
            setToken(data.access);
            setUser({ email: normalizedEmail });
            localStorage.setItem("authToken", data.access);
            localStorage.setItem("authUser", JSON.stringify({ email: normalizedEmail }));
            return true;
        } catch (err: any) {
            const responseErrors: Record<string, string[]> = {};
            if (err.response?.data) {
                const data = err.response.data;
                for (const key in data) {
                    responseErrors[key] = Array.isArray(data[key]) ? data[key] : [String(data[key])];
                }
            } else {
                responseErrors.general = ["Login failed"];
            }
            setErrors(responseErrors);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const register = async (username: string, email: string, password: string): Promise<boolean> => {
        setLoading(true);
        setErrors({});
        try {
            const normalizedEmail = email.trim().toLowerCase();
            await axios.post(`${API_BASE_URL}/api/payments/register/`, { username: username.trim(), email: normalizedEmail, password });
            return await login(normalizedEmail, password);
        } catch (err: any) {
            const responseErrors: Record<string, string[]> = {};
            if (err.response?.data) {
                for (const key in err.response.data) {
                    responseErrors[key] = Array.isArray(err.response.data[key])
                        ? err.response.data[key]
                        : [err.response.data[key]];
                }
            } else {
                responseErrors.general = ["Registration failed"];
            }
            setErrors(responseErrors);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("authToken");
        localStorage.removeItem("authUser");
    };

    const clearAuth = () => {
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                user,
                isAuthenticated: !!token,
                login,
                register,
                logout,
                clearAuth,
                loading,
                initialLoading,
                errors,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};