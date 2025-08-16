import axios from "axios";
import { API_URL } from "@/utils/constant";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
