import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default axiosInstance;

export const endpoints = {
  auth: {
    signup: `/api/v1/auth/signup`,
    signin: `/api/v1/auth/signin`,
    signout: `/api/v1/auth/signout`,
    me: `/api/v1/auth/me`,
  },
  todo: {
    create: `/api/v1/t/todos`,
    get: `/api/v1/t/todos`,
    update: `/api/v1/t/todo`,
    delete: (id: string) => `/api/v1/t/todos/${id}`,
    genereate_summary: `/api/v1/t/summarize`,
  },
};
