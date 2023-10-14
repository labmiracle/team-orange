/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient, HttpRequest, HttpHeaders, AuthorizationInterceptor } from "@miracledevs/paradigm-web-fetch";

class Fetcher {
    private fetcher: HttpClient;
    private static instance: Fetcher;

    constructor() {
        const httpClient = new HttpClient();
        this.fetcher = httpClient;

        if (!Fetcher.instance) {
            Fetcher.instance = this;
        }
        return Fetcher.instance;
    }

    async query<T>(url: string, options?: { method: string; data?: any; token?: string; form?: boolean }) {
        const config: HttpRequest = new HttpRequest(url);
        config.method = options?.method;
        config.headers = new HttpHeaders();

        if (options?.token) {
            config.headers.set("x-auth", options.token);
        }
        if (options?.data) {
            if (options.form) {
                config.body = options.data;
            } else {
                config.headers.set("content-type", "application/json");
                config.body = JSON.stringify(options.data);
            }
        }
        const response = await this.fetcher.request(config);
        const body = await response.json();

        let headers: any = {};
        response.headers.forEach((value, key) => {
            headers = { ...headers, [key]: value };
        });
        if (body.error) throw new Error(body.message);

        return { headers, data: body.data as T, status: response.status };
    }

    addAuthInterceptor(token: string) {
        this.fetcher.registerInterceptor(new AuthorizationInterceptor(token));
    }
}

export default new Fetcher();
