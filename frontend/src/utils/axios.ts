import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000",
});

// Attach token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
        config.headers = config.headers || {};
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 + refresh
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers["Authorization"] = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) {
                localStorage.removeItem("authToken");
                localStorage.removeItem("authUser");
                localStorage.removeItem("refreshToken");
                window.dispatchEvent(new Event("auth:token-expired"));
                isRefreshing = false;
                return Promise.reject(error);
            }

            try {
                const { data } = await axios.post(
                    `${api.defaults.baseURL}/api/payments/token/refresh/`,
                    { refresh: refreshToken }
                );

                localStorage.setItem("authToken", data.access);
                if (data.refresh) {
                    localStorage.setItem("refreshToken", data.refresh);
                }

                api.defaults.headers.common["Authorization"] = `Bearer ${data.access}`;
                processQueue(null, data.access);

                originalRequest.headers["Authorization"] = `Bearer ${data.access}`;
                return api(originalRequest);
            } catch (err) {
                processQueue(err, null);
                localStorage.removeItem("authToken");
                localStorage.removeItem("authUser");
                localStorage.removeItem("refreshToken");
                window.dispatchEvent(new Event("auth:token-expired"));
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;