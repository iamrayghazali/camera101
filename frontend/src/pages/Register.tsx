import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/UseAuth.tsx";
import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer.tsx";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const { register, loading, errors } = useAuth();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // touched = field was focused then blurred (we only show client errors after blur)
    const [touched, setTouched] = useState({
        username: false,
        email: false,
        password: false,
    });

    // copy of server errors so we can clear specific server field errors on change
    const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});

    useEffect(() => {
        setServerErrors(errors || {});
    }, [errors]);

    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // client validators return string or empty
    const validateUsername = (v: string) => {
        if (!v || v.trim().length === 0) return "Please choose a username";
        if (v.trim().length < 3) return "Username needs to be at least 3 characters long";
        if (v.trim().length > 150) return "Username must be 150 characters or fewer";
        if (v.includes(' ')) return "Username cannot contain spaces";
        // Check for valid characters: letters, digits and @/./+/-/_ only
        if (!/^[a-zA-Z0-9@.+\-_]+$/.test(v)) return "Username can only contain letters, numbers, and @/./+/-/_";
        return "";
    };
    const validateEmail = (v: string) => {
        if (!v || v.trim().length === 0) return "Please enter your email address";
        if (!emailRx.test(v)) return "Please enter a valid email address (e.g., john@example.com)";
        return "";
    };
    const validatePassword = (v: string) => {
        if (!v || v.length === 0) return "Please create a password";
        if (v.length < 8) return "Password must be at least 8 characters long";
        // Check if password is entirely numeric (backend will reject this)
        if (/^\d+$/.test(v)) return "Password cannot be entirely numbers";
        return "";
    };

    // current client errors (not shown until touched)
    const clientErrors = {
        username: validateUsername(username),
        email: validateEmail(email),
        password: validatePassword(password),
    };

    // form is valid when client validators pass
    const isFormValid =
        clientErrors.username === "" &&
        clientErrors.email === "" &&
        clientErrors.password === "";

    const navigate = useNavigate();

    // helper: get visible message for a field (server first if exists, else client)
    const getFieldMessage = (field: "username" | "email" | "password") => {
        // prefer server errors (first message) if present
        if (serverErrors[field] && serverErrors[field].length > 0) {
            const serverError = serverErrors[field][0];
            // Make server errors more user-friendly
            if (serverError.includes("already exists") || serverError.includes("taken")) {
                return field === "email" ? "This email is already registered. Try signing in instead." : "This username is already taken. Please choose another one.";
            }
            if (serverError.includes("invalid")) {
                return field === "email" ? "Please enter a valid email address" : "Please check your input and try again";
            }
            return serverError;
        }
        // else show client error only if field touched
        if (touched[field]) return (clientErrors as any)[field] || "";
        return "";
    };

    const clearServerField = (field: string) => {
        if (!serverErrors[field]) return;
        setServerErrors(prev => {
            const copy = { ...prev };
            delete copy[field];
            return copy;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // stop if client invalid
        if (!isFormValid) {
            // mark all fields touched so user sees msgs
            setTouched({ username: true, email: true, password: true });
            return;
        }

        const ok = await register(username.trim(), email.trim(), password);
        if (ok) {
            navigate("/");
        } else {
            // server errors are already synced into serverErrors by effect.
            // mark all touched so field errors are visible
            setTouched({ username: true, email: true, password: true });
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-900">
            <Navbar />
            <motion.main
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-20 flex-grow flex items-center justify-center p-4"
            >
                <div className="w-full max-w-md">
                    {/* small, subtle general server error (if any) */}
                    {serverErrors.general && serverErrors.general.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3"
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-red-500">⚠️</span>
                                <div>
                                    {serverErrors.general.map((m, i) => (
                                        <div key={i} className="font-medium">
                                            {m.includes("network") || m.includes("connection") 
                                                ? "Unable to connect. Please check your internet connection and try again."
                                                : m.includes("server") 
                                                ? "Something went wrong on our end. Please try again in a moment."
                                                : m
                                            }
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        noValidate
                        className="bg-white rounded-2xl p-8 shadow-xl"
                        aria-describedby="register-form"
                    >
                        <h1 className="text-2xl font-rama font-extrabold text-gray-900 mb-4 text-center">Create account</h1>

                        {/* Username */}
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            autoComplete="off"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                                clearServerField("username");
                            }}
                            onBlur={() => setTouched(prev => ({ ...prev, username: true }))}
                            aria-invalid={!!getFieldMessage("username")}
                            aria-describedby={getFieldMessage("username") ? "username-err" : undefined}
                            className={`w-full border-b-2 pb-2 mb-1 text-gray-900 bg-transparent focus:outline-none transition ${
                                getFieldMessage("username") ? "border-red-400" : "border-gray-200 focus:border-gray-700"
                            }`}
                            placeholder="pick a username"
                        />
                        {/* inline small message */}
                        {getFieldMessage("username") && (
                            <motion.p
                                id="username-err"
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-sm text-red-500 mt-1 mb-3"
                            >
                                {getFieldMessage("username")}
                            </motion.p>
                        )}
                        {!getFieldMessage("username") && <div className="mb-3 h-[0.75rem]" />}

                        {/* Email */}
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                clearServerField("email");
                            }}
                            onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
                            aria-invalid={!!getFieldMessage("email")}
                            aria-describedby={getFieldMessage("email") ? "email-err" : undefined}
                            className={`w-full border-b-2 pb-2 mb-1 text-gray-900 bg-transparent focus:outline-none transition ${
                                getFieldMessage("email") ? "border-red-400" : "border-gray-200 focus:border-gray-700"
                            }`}
                            placeholder="you@example.com"
                        />
                        {getFieldMessage("email") && (
                            <motion.p
                                id="email-err"
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-sm text-red-500 mt-1 mb-3"
                            >
                                {getFieldMessage("email")}
                            </motion.p>
                        )}
                        {!getFieldMessage("email") && <div className="mb-3 h-[0.75rem]" />}

                        {/* Password */}
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                clearServerField("password");
                            }}
                            onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
                            aria-invalid={!!getFieldMessage("password")}
                            aria-describedby={getFieldMessage("password") ? "password-err" : undefined}
                            className={`w-full border-b-2 pb-2 mb-1 text-gray-900 bg-transparent focus:outline-none transition ${
                                getFieldMessage("password") ? "border-red-400" : "border-gray-200 focus:border-gray-700"
                            }`}
                            placeholder="minimum 8 characters"
                        />
                        {getFieldMessage("password") && (
                            <motion.p
                                id="password-err"
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-sm text-red-500 mt-1 mb-3"
                            >
                                {getFieldMessage("password")}
                            </motion.p>
                        )}
                        {!getFieldMessage("password") && <div className="mb-3 h-[0.75rem]" />}

                        <button
                            type="submit"
                            disabled={!isFormValid || loading}
                            className={`mt-2 w-full py-3 rounded-lg font-semibold transition ${
                                !isFormValid || loading
                                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                    : "bg-gray-900 text-white hover:bg-gray-700"
                            }`}
                        >
                            {loading ? "Registering…" : "Create account"}
                        </button>

                        <p className="mt-4 text-xs text-gray-500 text-center">
                            By creating an account you agree to our terms.
                        </p>
                        
                        {/* Login Link */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Already have an account?{" "}
                                <button
                                    onClick={() => navigate("/login")}
                                    className="text-primary hover:text-primary/80 font-semibold underline transition-colors"
                                >
                                    Sign in
                                </button>
                            </p>
                        </div>
                    </form>
                </div>
            </motion.main>
            <Footer />
        </div>
    );
}