import { AuthorizationInterceptor } from "@miracledevs/paradigm-web-fetch/interceptors/authorization.interceptor";
import { ContentTypeInterceptor } from "@miracledevs/paradigm-web-fetch/interceptors/content-type.interceptor";
import { HttpClient, QueryString } from "@miracledevs/paradigm-web-fetch/http-client";
import { HttpRequest } from "@miracledevs/paradigm-web-fetch/http-request";
import { HttpResponse } from "@miracledevs/paradigm-web-fetch/http-response";
import { NodeFetcher } from "@miracledevs/paradigm-web-fetch/fetchers/node.fetcher";
import { DependencyLifeTime, Injectable } from "@miracledevs/paradigm-web-di";

interface TResult<T> {
    data: T;
    headers: Headers;
    status: number;
}

class OurHttpClient extends HttpClient {
    async deleteB(url: string, body?: BodyInit): Promise<HttpResponse> {
        const request = new HttpRequest(url);
        request.method = "DELETE";
        request.body = body;
        return await this.request(request);
    }
}

@Injectable({ lifeTime: DependencyLifeTime.Singleton })
export class ApiClient {
    private readonly httpClient: OurHttpClient;

    constructor(private readonly baseUrl: string) {
        this.httpClient = new OurHttpClient();
        const nodeFetcher = new NodeFetcher();
        this.httpClient.setFetcher(nodeFetcher);
        this.httpClient.registerInterceptor(new ContentTypeInterceptor("application/json"));
    }

    authorize(token: string): void {
        this.httpClient.registerInterceptor(new AuthorizationInterceptor(token));
    }

    async get<T>(url: string, queryString?: QueryString): Promise<TResult<T>> {
        //return (await (await this.httpClient.get(`${this.baseUrl}/${url}`, queryString)).json()) as TResult;
        const response = await this.httpClient.get(`${this.baseUrl}/${url}`, queryString);
        const dataR = {} as TResult<T>;
        dataR.data = await response.json();
        dataR.headers = response.headers;
        dataR.status = response.status;
        return dataR;
    }

    async post<T>(url: string, queryString?: QueryString, body?: BodyInit): Promise<TResult<T>> {
        //return (await (await this.httpClient.post(`${this.baseUrl}/${url}`, queryString, body)).json()) as TResult;
        const response = await this.httpClient.post(`${this.baseUrl}/${url}`, queryString, body);
        const dataR = {} as TResult<T>;
        dataR.data = await response.json();
        dataR.headers = response.headers;
        dataR.status = response.status;
        return dataR;
    }

    async put<T>(url: string, queryString?: QueryString, body?: BodyInit): Promise<TResult<T>> {
        const response = await this.httpClient.put(`${this.baseUrl}/${url}`, queryString, body);
        const dataR = {} as TResult<T>;
        dataR.data = await response.json();
        dataR.headers = response.headers;
        dataR.status = response.status;
        return dataR;
    }

    async patch<T>(url: string, queryString?: QueryString, body?: BodyInit): Promise<TResult<T>> {
        const response = await this.httpClient.patch(`${this.baseUrl}/${url}`, queryString, body);
        const dataR = {} as TResult<T>;
        dataR.data = await response.json();
        dataR.headers = response.headers;
        dataR.status = response.status;
        return dataR;
    }

    async delete<T>(url: string, body?: BodyInit): Promise<TResult<T>> {
        //return (await (await this.httpClient.delete(`${this.baseUrl}/${url}`, queryString)).json()) as TResult;
        const response = await this.httpClient.deleteB(`${this.baseUrl}/${url}`, body);
        const dataR = {} as TResult<T>;
        dataR.data = await response.json();
        dataR.headers = response.headers;
        dataR.status = response.status;
        return dataR;
    }
}
