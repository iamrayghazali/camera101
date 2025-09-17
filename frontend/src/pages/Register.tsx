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
        if (!v || v.trim().length === 0) return "Username is required.";
        if (v.trim().length < 3) return "Username must be at least 3 characters.";
        return "";
    };
    const validateEmail = (v: string) => {
        if (!v || v.trim().length === 0) return "Email is required.";
        if (!emailRx.test(v)) return "Please enter a valid email address.";
        return "";
    };
    const validatePassword = (v: string) => {
        if (!v || v.length === 0) return "Password is required.";
        if (v.length < 6) return "Password must be at least 6 characters.";
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
        if (serverErrors[field] && serverErrors[field].length > 0) return serverErrors[field][0];
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
                className="flex-grow flex items-center justify-center p-4"
            >
                <div className="w-full max-w-md">
                    {/* small, subtle general server error (if any) */}
                    {serverErrors.general && serverErrors.general.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-4 bg-gray-800 text-red-400 text-sm rounded px-3 py-2"
                        >
                            {serverErrors.general.map((m, i) => <div key={i}>{m}</div>)}
                        </motion.div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        noValidate
                        className="bg-white rounded-2xl p-8 shadow-xl"
                        aria-describedby="register-form"
                    >
                        <h1 className="text-2xl font-extrabold text-gray-900 mb-4 text-center">Create account</h1>

                        {/* Username */}
                        <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                        <input
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                                clearServerField("username");
                            }}
                            onBlur={() => setTouched(prev => ({ ...prev, username: true }))}
                            aria-invalid={!!getFieldMessage("username")}
                            aria-describedby={getFieldMessage("username") ? "username-err" : undefined}
                            className={`w-full border-b-2 pb-2 mb-1 text-gray-900 focus:outline-none transition ${
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                clearServerField("email");
                            }}
                            onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
                            aria-invalid={!!getFieldMessage("email")}
                            aria-describedby={getFieldMessage("email") ? "email-err" : undefined}
                            className={`w-full border-b-2 pb-2 mb-1 text-gray-900 focus:outline-none transition ${
                                getFieldMessage("email") ? "border-red-400" : "border-gray-200 focus:border-gray-700"
                            }`}
                            placeholder="you@example.com"
                            inputMode="email"
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                clearServerField("password");
                            }}
                            onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
                            aria-invalid={!!getFieldMessage("password")}
                            aria-describedby={getFieldMessage("password") ? "password-err" : undefined}
                            className={`w-full border-b-2 pb-2 mb-1 text-gray-900 focus:outline-none transition ${
                                getFieldMessage("password") ? "border-red-400" : "border-gray-200 focus:border-gray-700"
                            }`}
                            placeholder="minimum 6 characters"
                            type="password"
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
                    </form>
                </div>
            </motion.main>
            <Footer />
        </div>
    );
}