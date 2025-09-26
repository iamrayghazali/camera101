import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/UseAuth.tsx";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer.tsx";

export default function Login() {
    const { login, loading, errors } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [touched, setTouched] = useState({ email: false, password: false });
    const [isValid, setIsValid] = useState(false);
    const navigate = useNavigate();

    // Validate inputs
    useEffect(() => {
        const emailValid = /[^@\s]+@[^@\s]+\.[^@\s]+/.test(email);
        setIsValid(emailValid && password.length >= 6);
    }, [email, password]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid) return;
        const ok = await login(email, password);
        if (ok) navigate("/");
    };

    const renderErrors = () => {
        if (!errors || Object.keys(errors).length === 0) return null;
        
        return (
            <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3"
            >
                <div className="flex items-center gap-2">
                    <span className="text-red-500">⚠️</span>
                    <div>
                        {Object.entries(errors).map(([key, msgs]) =>
                            msgs.map((msg, i) => {
                                // Make server errors more user-friendly
                                let friendlyMsg = msg;
                                if (msg.includes("Invalid credentials") || msg.includes("authentication")) {
                                    friendlyMsg = "Invalid email or password. Please check your credentials and try again.";
                                } else if (msg.includes("not found") || msg.includes("does not exist")) {
                                    friendlyMsg = "No account found with this email. Please check your email or create a new account.";
                                } else if (msg.includes("network") || msg.includes("connection")) {
                                    friendlyMsg = "Unable to connect. Please check your internet connection and try again.";
                                } else if (msg.includes("server") || msg.includes("internal")) {
                                    friendlyMsg = "Something went wrong on our end. Please try again in a moment.";
                                }
                                
                                return (
                                    <div key={`${key}-${i}`} className="font-medium">
                                        {friendlyMsg}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </motion.div>
        );
    };

    const showFieldError = (field: "email" | "password") => {
        if (!touched[field]) return null;
        if (field === "email" && !/[^@\s]+@[^@\s]+\.[^@\s]+/.test(email)) {
            return "Please enter a valid email address (e.g., john@example.com)";
        }
        if (field === "password" && password.length < 6) {
            return "Password must be at least 6 characters long";
        }
        return null;
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
                    {/* Server errors */}
                    {renderErrors()}

                    <form
                        onSubmit={handleSubmit}
                        noValidate
                        className="bg-white rounded-2xl p-8 shadow-xl"
                        aria-describedby="login-form"
                    >
                        <h1 className="text-2xl font-rama font-extrabold text-gray-900 mb-6 text-center">Welcome Back</h1>

                        {/* Email */}
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                            aria-invalid={!!showFieldError("email")}
                            aria-describedby={showFieldError("email") ? "email-err" : undefined}
                            className={`w-full border-b-2 pb-2 mb-1 text-gray-900 bg-transparent focus:outline-none transition ${
                                showFieldError("email") ? "border-red-400" : "border-gray-200 focus:border-gray-700"
                            }`}
                            placeholder="you@example.com"
                        />
                        {showFieldError("email") && (
                            <motion.p
                                id="email-err"
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-sm text-red-500 mt-1 mb-3"
                            >
                                {showFieldError("email")}
                            </motion.p>
                        )}
                        {!showFieldError("email") && <div className="mb-3 h-[0.75rem]" />}

                        {/* Password */}
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                            aria-invalid={!!showFieldError("password")}
                            aria-describedby={showFieldError("password") ? "password-err" : undefined}
                            className={`w-full border-b-2 pb-2 mb-1 text-gray-900 bg-transparent focus:outline-none transition ${
                                showFieldError("password") ? "border-red-400" : "border-gray-200 focus:border-gray-700"
                            }`}
                            placeholder="Enter your password"
                        />
                        {showFieldError("password") && (
                            <motion.p
                                id="password-err"
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-sm text-red-500 mt-1 mb-3"
                            >
                                {showFieldError("password")}
                            </motion.p>
                        )}
                        {!showFieldError("password") && <div className="mb-3 h-[0.75rem]" />}

                        <button
                            type="submit"
                            disabled={!isValid || loading}
                            className={`mt-2 w-full py-3 rounded-lg font-semibold transition ${
                                !isValid || loading
                                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                    : "bg-gray-900 text-white hover:bg-gray-700"
                            }`}
                        >
                            {loading ? <span className="animate-pulse">Logging in...</span> : "Sign In"}
                        </button>

                        {/* Register Link */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Don't have an account?{" "}
                                <button
                                    onClick={() => navigate("/register")}
                                    className="text-primary hover:text-primary/80 font-semibold underline transition-colors"
                                >
                                    Create account
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