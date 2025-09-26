import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers = config.headers || {};
    (config.headers as any)["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token is invalid or expired
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
      
      // Dispatch a custom event to notify auth context
      window.dispatchEvent(new CustomEvent('auth:token-expired'));
      
      // Only redirect to login for protected routes, not public routes
      const publicRoutes = ["/", "/faq", "/about", "/learn"];
      const currentPath = window.location.pathname;
      
      if (!publicRoutes.includes(currentPath) && 
          currentPath !== "/login" && 
          currentPath !== "/register" &&
          !currentPath.startsWith("/simulators/")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;