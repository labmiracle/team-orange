import { Injectable, DependencyLifeTime } from "@miracledevs/paradigm-web-di";
import { IFilter, HttpContext } from "@miracledevs/paradigm-express-webapi";
import jwt from "jsonwebtoken";

@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class JWTAuth implements IFilter {
    async beforeExecute(httpContext: HttpContext): Promise<void> {
        const token = httpContext.request.cookies.token;
        try {
            const user = jwt.verify(token, process.env.SHOPPY__ACCESS_TOKEN);
            httpContext.request.body.user = user;
        } catch {
            httpContext.response.clearCookie("token");
            return httpContext.response.redirect("/");
        }
    }
}
