import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App";
import NotFound from "./pages/NotFound";
import "./index.css";
import Register from "./pages/Register.tsx";
import Login from "./pages/Login.tsx";
import {AuthProvider} from "./hooks/UseAuth.tsx";
import FAQ from "./pages/FAQ.tsx";

const router = createBrowserRouter([
    { path: "/", element: <App /> },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/faq", element: <FAQ /> },
    { path: "/about", element: <NotFound /> },
    { path: "/learn", element: <NotFound /> },
    { path: "*", element: <NotFound /> },
]);

createRoot(document.getElementById("root")!).render(
    <AuthProvider>
    <RouterProvider router={router} />
    </AuthProvider>

);