import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App";
import NotFound from "./pages/NotFound";
import "./index.css";
import Register from "./pages/Register.tsx";
import Login from "./pages/Login.tsx";
import {AuthProvider} from "./hooks/UseAuth.tsx";

const router = createBrowserRouter([
    { path: "/", element: <App /> },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "*", element: <NotFound /> },
]);

createRoot(document.getElementById("root")!).render(
    <AuthProvider>
    <RouterProvider router={router} />
    </AuthProvider>

);