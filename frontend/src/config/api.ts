import axios, { AxiosInstance } from "axios";

export const API_URL = "http://localhost:3001/api/";

const createApiInstance = (contentType: string): AxiosInstance => {
  return axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type": contentType,
    },
    // withCredentials: true,
  });
};

export const apiJson = createApiInstance("application/json");
export const apiMultipart = createApiInstance("multipart/form-data");
export const api = createApiInstance("");
