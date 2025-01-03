import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { useUser } from "../context/UserContext";
import LocalStorageService from "../services/localStorage.service";
import { useNavigate } from "react-router-dom";

export const API_URL = "http://localhost:3001/api/";

const useApiInstance = (contentType: string): AxiosInstance => {
  const { token, refreshToken, login, logout, user } = useUser();
  const navigate = useNavigate();

  const instance = axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type": contentType,
    },
  });

  instance.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig | undefined;

      if (
        (error.response?.status === 401 || error.response?.status === 403) &&
        originalRequest
      ) {
        try {
          const refreshResponse = await axios.post(`${API_URL}auth/refresh`, {
            refreshToken,
          });

          const { token: newToken, refreshToken: newRefreshToken } =
            refreshResponse.data;

          login({ ...user! }, newToken, newRefreshToken);

          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${newToken}`,
          };

          return axios(originalRequest);
        } catch (refreshError) {
          logout();
          LocalStorageService.clear();
          navigate("/welcome-page");
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

export const useApiJson = () => useApiInstance("application/json");
export const useApiMultipart = () => useApiInstance("multipart/form-data");
export const useApi = () => useApiInstance("");
