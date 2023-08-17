import { Injectable, DependencyLifeTime } from "@miracledevs/paradigm-web-di";
import { IFilter, HttpContext } from "@miracledevs/paradigm-express-webapi";
import { userSchema, userLogin } from "../models/schemas/user.schema";
import { Response } from "express";
import jwt from "jsonwebtoken";

@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class UserFilter implements IFilter {
    async beforeExecute(httpContext: HttpContext): Promise<void> {
        const user = httpContext.request.body;
        delete user.rol;
        delete user.status;
        delete user.iat;
        delete user.exp;
        const { error } = userSchema.validate(user);
        if (error) throw new Error(error.details[0].message);
    }
}

@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class LoginFilter implements IFilter {
    async beforeExecute(httpContext: HttpContext): Promise<void> {
        const user = httpContext.request.body;
        delete user.rol;
        const { error } = userLogin.validate(user);
        if (error) throw new Error(error.details[0].message);
    }

    async afterExecute(httpContext: HttpContext): Promise<void> {
        const send = httpContext.response.send;
        httpContext.response.send = user => {
            httpContext.response.send = send;
            const token = jwt.sign({ ...user.data }, process.env.SHOPPY__ACCESS_TOKEN, { expiresIn: "1d" });
            httpContext.response.setHeader("x-auth", token);
            return send.call(httpContext.response, user) as Response;
        };
    }
}
