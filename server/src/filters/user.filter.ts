import { Injectable, DependencyLifeTime } from "@miracledevs/paradigm-web-di";
import { IFilter, HttpContext } from "@miracledevs/paradigm-express-webapi";
import { userSchema, userLogin } from "../models/schemas/user.schema";
import { Response } from "express";
import { ProcessToken } from "../utils/processToken";

/**
 * Validate user of type {@link UserInterface}
 */
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

/**
 * Validate login user of type {@link UserLoginInterface}
 * and set the auth token in x-auth header
 */
@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class LoginFilter implements IFilter {
    constructor(private readonly processToken: ProcessToken) {}

    async beforeExecute(httpContext: HttpContext): Promise<void> {
        const user = httpContext.request.body;
        console.log(user);
        delete user.rol;
        delete user.createdAt;
        delete user.updatedAt;
        console.log(user);
        const { error } = userLogin.validate(user);
        if (error) throw new Error(error.details[0].message);
    }

    async afterExecute(httpContext: HttpContext): Promise<void> {
        const send = httpContext.response.send;
        httpContext.response.send = user => {
            httpContext.response.send = send;
            const token = this.processToken.sign(user.data);
            httpContext.response.setHeader("x-auth", token);
            return send.call(httpContext.response, user) as Response;
        };
    }
}
