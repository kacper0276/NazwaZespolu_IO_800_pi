import axios from "axios";
import { API_URL } from "../App";

export const apiJson = axios.create({
  baseURL: `${API_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const apiMultipart = axios.create({
  baseURL: `${API_URL}`,
  headers: {
    "Content-Type": "multipart/form-data",
  },
  withCredentials: true,
});

export const api = axios.create({
  baseURL: `${API_URL}`,
  withCredentials: true,
});
