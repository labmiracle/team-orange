import { Injectable, DependencyLifeTime } from "@miracledevs/paradigm-web-di";
import { IFilter, HttpContext } from "@miracledevs/paradigm-express-webapi";
import { Response } from "express";

@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class ResponseFilter implements IFilter {
    async afterExecute(httpContext: HttpContext): Promise<void> {
        const send = httpContext.response.send;
        httpContext.response.send = data => {
            httpContext.response.send = send;
            const response = {
                data: data,
                error: false,
            };
            return send.call(httpContext.response, response) as Response;
        };
    }

    async onError(httpContext: HttpContext, _: undefined, error: Error): Promise<void> {
        httpContext.response.status(500).send({
            message: error.message,
            error: true,
        });
    }
}
