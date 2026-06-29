import axios, { type AxiosInstance } from "axios";

export const apiClient: AxiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});