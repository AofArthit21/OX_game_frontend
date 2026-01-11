// /frontend/lib/api.ts

import axios from "axios";
import { useGameStore } from "@/store/gameStore";

// URL ของ NestJS Backend
const API_BASE_URL =
  process.env.NEXT_PUBLIC_NEST_API_BASE_URL || "http://localhost:3000";

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api/game`,
});

// Interceptor: แทรก JWT Token ก่อนส่ง Request
api.interceptors.request.use(
  (config) => {
    const token = useGameStore.getState().playerToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
