import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/UseAuth.tsx";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer.tsx";

export default function Login() {
    const { login, loading, errors } = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [touched, setTouched] = useState({ username: false, password: false });
    const [isValid, setIsValid] = useState(false);
    const navigate = useNavigate();

    // Validate inputs
    useEffect(() => {
        setIsValid(username.trim().length > 2 && password.length >= 6);
    }, [username, password]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid) return;
        const ok = await login(username, password);
        if (ok) navigate("/");
    };

    const renderErrors = () =>
        Object.entries(errors).map(([key, msgs]) =>
            msgs.map((msg, i) => (
                <div
                    key={`${key}-${i}`}
                    className="text-red-500 text-sm mt-1"
                >
                    {msg}
                </div>
            ))
        );

    const showFieldError = (field: "username" | "password") => {
        if (!touched[field]) return null;
        if (field === "username" && username.trim().length <= 2) {
            return <div className="text-red-500 text-sm mt-1">Username must be at least 3 characters</div>;
        }
        if (field === "password" && password.length < 6) {
            return <div className="text-red-500 text-sm mt-1">Password must be at least 6 characters</div>;
        }
        return null;
    };

    return (
        <div className="">
            <Navbar />
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex justify-center items-center min-h-screen bg-gray-900 p-4"
            >
                <div className="w-full max-w-md space-y-6">
                    {renderErrors()}

                    <form
                        onSubmit={handleSubmit}
                        className="bg-gray-800 p-8 rounded-2xl shadow-xl space-y-6 transform hover:scale-[1.02] transition"
                    >
                        <h2 className="text-white text-3xl font-extrabold text-center mb-4">
                            Welcome Back
                        </h2>

                        <div className="space-y-1">
                            <input
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                onBlur={() => setTouched((t) => ({ ...t, username: true }))}
                                placeholder="Username"
                                className="w-full p-4 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white transition"
                            />
                            {showFieldError("username")}
                        </div>

                        <div className="space-y-1">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                                placeholder="Password"
                                className="w-full p-4 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white transition"
                            />
                            {showFieldError("password")}
                        </div>

                        <button
                            type="submit"
                            disabled={!isValid || loading}
                            className={`w-full py-4 rounded-lg font-bold transition
                                ${isValid && !loading
                                ? "bg-white text-gray-900 hover:bg-gray-200"
                                : "bg-gray-500 text-gray-700 cursor-not-allowed"
                            }`}
                        >
                            {loading ? <span className="animate-pulse">Logging in...</span> : "Login"}
                        </button>
                    </form>
                </div>
            </motion.div>
            <Footer />
        </div>
    );
}