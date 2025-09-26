import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App";
import NotFound from "./pages/NotFound";
import "./index.css";
import Register from "./pages/Register.tsx";
import Login from "./pages/Login.tsx";
import {AuthProvider} from "./hooks/UseAuth.tsx";
import FAQ from "./pages/FAQ.tsx";
import Lessons from "./pages/lessons/Lessons.tsx";
import CourseOverview from "./pages/CourseOverview";
import LessonView from "./pages/LessonView";
import CameraSimulator from "./pages/CameraSimulator";
import Cancel from "./pages/Cancel";
import Success from "./pages/Success";

const router = createBrowserRouter([
    { path: "/", element: <App /> },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/faq", element: <FAQ /> },
    { path: "/about", element: <NotFound /> },

    // Payment pages
    { path: "/cancel", element: <Cancel /> },
    { path: "/success", element: <Success /> },
    { path: "/404", element: <NotFound /> },

    // Lessons parent
    { path: "/learn", element: <Lessons /> },
    { path: "/:courseSlug", element: <CourseOverview /> },
    { path: "/:courseSlug/:chapterSlug/:number", element: <LessonView /> },

    // Simulators
    { path: "/simulators/iphone", element: <CameraSimulator /> },

    { path: "*", element: <NotFound /> },
]);

createRoot(document.getElementById("root")!).render(
    <AuthProvider>
    <RouterProvider router={router} />
    </AuthProvider>

);