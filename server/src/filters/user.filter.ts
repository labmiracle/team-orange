import { Injectable, DependencyLifeTime } from "@miracledevs/paradigm-web-di";
import { IFilter, HttpContext } from "@miracledevs/paradigm-express-webapi";
import { userSmallSchema, userSchema, userLogin } from "../models/schemas/user.schema";
import { Response } from "express";
import jwt from "jsonwebtoken";

@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class UserFilter implements IFilter {
    async beforeExecute(httpContext: HttpContext): Promise<void> {
        const entity = httpContext.request.body.entity ? httpContext.request.body.entity : httpContext.request.body;
        const { error } = userSchema.validate(entity);
        if (error) throw new Error(error.details[0].message);
    }
}

@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class UserSmallFilter implements IFilter {
    async beforeExecute(httpContext: HttpContext): Promise<void> {
        const entity = httpContext.request.body.entity ? httpContext.request.body.entity : httpContext.request.body;
        const { error } = userSmallSchema.validate(entity);
        if (error) throw new Error(error.details[0].message);
    }
}

@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class LoginFilter implements IFilter {
    async beforeExecute(httpContext: HttpContext): Promise<void> {
        const { error } = userLogin.validate(httpContext.request.body);
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
