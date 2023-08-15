import type { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import axios from "axios";

class Fetcher {
    private fetcher: AxiosInstance;
    private static instance: Fetcher;

    constructor() {
        this.fetcher = axios.create({
            baseURL: import.meta.env.VITE_API_URL,
            headers: { "Content-Type": "application/json" },
        });

        if (!Fetcher.instance) {
            Fetcher.instance = this;
        }
        return Fetcher.instance;
    }

    async query<T>(url: string, options?: AxiosRequestConfig): Promise<T> {
        if (url && options) return await this.fetcher(url, options);
        return await this.fetcher(url);

        throw new Error("");
    }

    addInterceptor(callback: (config: InternalAxiosRequestConfig<any>) => InternalAxiosRequestConfig<any>) {
        this.fetcher.interceptors.request.use(callback);
    }
}

export default new Fetcher();
