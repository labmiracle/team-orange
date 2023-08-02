import { Injectable, DependencyLifeTime } from "@miracledevs/paradigm-web-di";
import { IFilter, HttpContext } from "@miracledevs/paradigm-express-webapi";
import jwt, { JwtPayload } from "jsonwebtoken";

@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class JWTAuth implements IFilter {
    async beforeExecute(httpContext: HttpContext) {
        try {
            const token = httpContext.request.header("x-auth");
            if (!token) throw new Error("Token not found");
            const decodedToken = jwt.verify(token, process.env.SHOPPY__ACCESS_TOKEN) as JwtPayload;
            delete decodedToken.iat;
            delete decodedToken.exp;
            httpContext.request.body = {
                entity: httpContext.request.body,
                decodedToken: decodedToken,
            };
        } catch (error) {
            httpContext.response.status(401).json({
                message: error.message,
                data: null,
                error: true,
            });
        }
    }
}

@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class isAdmin implements IFilter {
    async beforeExecute(httpContext: HttpContext) {
        try {
            const token = httpContext.request.header("x-auth-role");
            //const userLogged = httpContext.request.body.decodedToken;
            if (token !== "Admin") throw new Error("Unauthorized");
        } catch (error) {
            httpContext.response.status(401).json({
                message: error.message,
                data: null,
                error: true,
            });
        }
    }
}

@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class isManager implements IFilter {
    async beforeExecute(httpContext: HttpContext) {
        try {
            const token = httpContext.request.header("x-auth-role");
            //const userLogged = httpContext.request.body.decodedToken;
            if (token !== "Manager") throw new Error("Unauthorized");
        } catch (error) {
            httpContext.response.status(401).json({
                message: error.message,
                data: null,
                error: true,
            });
        }
    }
}
