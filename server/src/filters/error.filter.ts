import { Injectable, DependencyLifeTime } from "@miracledevs/paradigm-web-di";
import { IFilter, HttpContext } from "@miracledevs/paradigm-express-webapi";

@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class ErrorFilter implements IFilter {
    async onError(httpContext: HttpContext, _: any, error: Error): Promise<void> {
        httpContext.response.status(500).send({
            message: error.message,
            error: true,
        });
    }
}
