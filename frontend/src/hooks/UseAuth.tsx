import {createContext, useContext, useState, useEffect, type ReactNode, useCallback} from "react";
import axios from "axios";

type AuthContextType = {
    token: string | null;
    user: any;
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<boolean>;
    register: (username: string, email: string, password: string) => Promise<boolean>;
    logout: () => void;
    loading: boolean;
    errors: Record<string, string[]>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(false);
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
    }, []);

    const checkIfUserHasPaid = () => {

    }

    const login = async (username: string, password: string): Promise<boolean> => {
        setLoading(true);
        setErrors({});
        try {
            const { data } = await axios.post("http://localhost:8000/api/token/", { username, password });
            setToken(data.access);
            setUser({ username });
            localStorage.setItem("authToken", data.access);
            localStorage.setItem("authUser", JSON.stringify({ username }));
            return true;
        } catch (err: any) {
            setErrors({ general: [err.response?.data?.detail || "Login failed"] });
            return false;
        } finally {
            setLoading(false);
        }
    };

    const register = async (username: string, email: string, password: string): Promise<boolean> => {
        setLoading(true);
        setErrors({});
        try {
            await axios.post("http://localhost:8000/api/register/", { username, email, password });
            return await login(username, password);
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

    return (
        <AuthContext.Provider
            value={{
                token,
                user,
                isAuthenticated: !!token,
                login,
                register,
                logout,
                loading,
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