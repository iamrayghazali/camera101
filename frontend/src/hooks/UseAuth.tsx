import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
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

const api = axios.create({
    baseURL: API_BASE_URL,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    useEffect(() => {
        const reqId = api.interceptors.request.use((config) => {
            const t = localStorage.getItem("authToken");
            if (t && config && config.headers) {
                config.headers.Authorization = `Bearer ${t}`;
            }
            return config;
        });

        // Response interceptor: handle 401 -> try refresh -> retry original request
        const resId = api.interceptors.response.use(
            (resp) => resp,
            async (error) => {
                const originalRequest = error.config;
                if (!originalRequest || (originalRequest as any)._retry) {
                    return Promise.reject(error);
                }

                // If we got 401 Unauthorized, try refresh flow once
                if (error.response?.status === 401) {
                    (originalRequest as any)._retry = true;
                    const refreshToken = localStorage.getItem("refreshToken");
                    if (!refreshToken) {
                        localStorage.removeItem("authToken");
                        localStorage.removeItem("refreshToken");
                        localStorage.removeItem("authUser");
                        window.dispatchEvent(new Event("auth:token-expired"));
                        return Promise.reject(error);
                    }

                    try {
                        const { data } = await axios.post(`${API_BASE_URL}/api/payments/token/refresh/`, {
                            refresh: refreshToken,
                        });

                        if (data.access) {
                            localStorage.setItem("authToken", data.access);
                            setToken(data.access);
                            // update api instance header for subsequent requests
                            api.defaults.headers.common.Authorization = `Bearer ${data.access}`;
                        }
                        if (data.refresh) {
                            // if backend rotates refresh tokens, update stored refresh token
                            localStorage.setItem("refreshToken", data.refresh);
                        }

                        // set header on original request and retry it
                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${data.access}`;
                        }
                        return api(originalRequest);
                    } catch (refreshErr) {
                        // refresh failed -> logout
                        localStorage.removeItem("authToken");
                        localStorage.removeItem("refreshToken");
                        localStorage.removeItem("authUser");
                        window.dispatchEvent(new Event("auth:token-expired"));
                        return Promise.reject(refreshErr);
                    }
                }

                return Promise.reject(error);
            }
        );

        // cleanup on unmount
        return () => {
            api.interceptors.request.eject(reqId);
            api.interceptors.response.eject(resId);
        };
    }, []); // empty deps — add interceptors once

    // load saved tokens/user once on mount
    useEffect(() => {
        const savedToken = localStorage.getItem("authToken");
        const savedUser = localStorage.getItem("authUser");
        if (savedToken) {
            setToken(savedToken);
            api.defaults.headers.common.Authorization = `Bearer ${savedToken}`;
        }
        if (savedUser) setUser(JSON.parse(savedUser));
        setInitialLoading(false);
    }, []);

    // listen to global logout events (optional)
    useEffect(() => {
        const handleTokenExpired = () => {
            setToken(null);
            setUser(null);
        };
        window.addEventListener("auth:token-expired", handleTokenExpired);
        return () => window.removeEventListener("auth:token-expired", handleTokenExpired);
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        setLoading(true);
        setErrors({});
        try {
            const normalizedEmail = email.trim().toLowerCase();
            // login via api instance (no token needed yet)
            const { data } = await api.post("/api/payments/token/", { email: normalizedEmail, password });

            if (data.access) {
                setToken(data.access);
                localStorage.setItem("authToken", data.access);
                api.defaults.headers.common.Authorization = `Bearer ${data.access}`;
            }
            if (data.refresh) {
                localStorage.setItem("refreshToken", data.refresh);
            }
            setUser({ email: normalizedEmail });
            localStorage.setItem("authUser", JSON.stringify({ email: normalizedEmail }));
            return true;
        } catch (err: any) {
            const responseErrors: Record<string, string[]> = {};
            if (err.response?.data) {
                for (const key in err.response.data) {
                    responseErrors[key] = Array.isArray(err.response.data[key]) ? err.response.data[key] : [String(err.response.data[key])];
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
            await api.post("/api/payments/register/", { username: username.trim(), email: normalizedEmail, password });
            return await login(normalizedEmail, password);
        } catch (err: any) {
            const responseErrors: Record<string, string[]> = {};
            if (err.response?.data) {
                for (const key in err.response.data) {
                    responseErrors[key] = Array.isArray(err.response.data[key]) ? err.response.data[key] : [String(err.response.data[key])];
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
        localStorage.removeItem("refreshToken");
        delete api.defaults.headers.common.Authorization;
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