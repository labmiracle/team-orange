import type { AxiosInstance, AxiosRequestConfig } from "axios";
import axios from "axios";

class Fetcher {
    private fetcher: AxiosInstance;
    private static instance: Fetcher;

    constructor() {
        this.fetcher = axios.create({
            baseURL: "http:/localhost:4000/api",
        });

        if (!Fetcher.instance) {
            Fetcher.instance = this;
        }
        return Fetcher.instance;
    }

    async query(url?: string, options?: AxiosRequestConfig) {
        if (url && options) return await this.fetcher(url, options);
        if (url) return await this.fetcher(url);

        throw new Error("");
    }
}

export default new Fetcher();
