import { HttpClient, HttpRequest, HttpHeaders } from "@miracledevs/paradigm-web-fetch";

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

    async query<T>(url: string, options?: { method: string; data?: T; token?: string }) {
        if (url) {
            const config: HttpRequest = new HttpRequest(url);
            config.method = options?.method;
            config.headers = new HttpHeaders();
            config.headers.set("content-type", "application/json");
            if (options?.token) {
                config.headers.set("x-auth", options.token);
            }
            if (options?.data) {
                config.body = JSON.stringify(options.data);
            }
            const response = await this.fetcher.request(config);
            const body = await response.json();

            let headers: any = {};
            response.headers.forEach((value, key) => {
                headers = { ...headers, [key]: value };
            });

            return { headers, data: body.data, status: response.status };
        }
        throw new Error("");
    }

    // addInterceptor(callback: (config: InternalAxiosRequestConfig<any>) => InternalAxiosRequestConfig<any>) {
    //     this.fetcher.interceptors.request.use(callback);
    // }
}

export default new Fetcher();
