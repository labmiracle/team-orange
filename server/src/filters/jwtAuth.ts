import { Injectable, DependencyLifeTime } from "@miracledevs/paradigm-web-di";
import { IFilter, HttpContext } from "@miracledevs/paradigm-express-webapi";
import jwt, { JwtPayload } from "jsonwebtoken";

@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class JWTAuth implements IFilter {
    async beforeExecute(httpContext: HttpContext) {
        const token = httpContext.request.header("x-auth");
        try {
            if (!token) throw new Error("Token not found");
            token.replace("Bearer ", "");
            const entity = httpContext.request.body;
            httpContext.request.body = {};
            httpContext.request.body.entity = entity;
            const decodedToken = jwt.verify(token, process.env.SHOPPY__ACCESS_TOKEN) as JwtPayload;
            delete decodedToken.iat;
            delete decodedToken.exp;
            httpContext.request.body.decodedToken = decodedToken;
        } catch (error) {
            httpContext.response.clearCookie("token");
            httpContext.response.status(401).json({
                message: error.message,
                data: null,
                error: true,
            });
        }
    }
}
