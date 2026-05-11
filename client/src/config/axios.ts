import axios from "axios";
import { env } from "../env";

export const api = axios.create({
  baseURL: env.SERVER_API,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
