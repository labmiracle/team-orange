import { HttpClient, HttpRequest, HttpHeaders } from "@miracledevs/paradigm-web-fetch";
import type { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import axios from "axios";

class Fetcher {
    private fetcher: HttpClient;
    private static instance: Fetcher;

    constructor() {
        // this.fetcher = axios.create({
        //     baseURL: "http:/localhost:4000/api",
        //     headers: { "Content-Type": "application/json" },
        // });
        const httpClient = new HttpClient();
        this.fetcher = httpClient;

        if (!Fetcher.instance) {
            Fetcher.instance = this;
        }
        return Fetcher.instance;
    }

    async query<T>(url: string, options?: { method: string; data: T }) {
        if (url) {
            const config: HttpRequest = new HttpRequest(url);
            config.method = options?.method;
            config.headers = new HttpHeaders();
            config.headers.set("content-type", "application/json");
            if (options?.data) {
                config.body = JSON.stringify(options.data);
            }
            const response = await this.fetcher.request(config);
            const body = await response.json();

            let headers: any = {};
            response.headers.forEach((value, key) => {
                headers = { ...headers, [key]: value };
            });

            return { headers, data: body, status: response.status };
        }
        throw new Error("");

        // if (url && options) return await this.fetcher(url, options);
        // if (url) return await this.fetcher(url);
    }

    addInterceptor(callback: (config: InternalAxiosRequestConfig<any>) => InternalAxiosRequestConfig<any>) {
        // this.fetcher.interceptors.request.use(callback);
    }
}

export default new Fetcher();
