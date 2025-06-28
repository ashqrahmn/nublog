import axios from "axios";

export const BASE_URL = import.meta.env.VITE_BASE_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("adminToken");
  if (accessToken && config.url.startsWith("/admin")) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      if (originalRequest.url.includes("/admin/login")) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const { data } = await axios.post(
          `${BASE_URL}/admin/refresh`,
          {},
          { withCredentials: true }
        );
        localStorage.setItem("adminToken", data.accessToken);
        originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        localStorage.clear();
        window.location.href = "/admin/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;