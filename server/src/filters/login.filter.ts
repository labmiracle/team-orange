import { Injectable, DependencyLifeTime } from "@miracledevs/paradigm-web-di";
import { IFilter, HttpContext } from "@miracledevs/paradigm-express-webapi";
import { userLogin } from "../models/schemas/user.schema";
import jwt from "jsonwebtoken";
import { Response, Send } from "express";

@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class LoginFilter implements IFilter {
    async beforeExecute(httpContext: HttpContext): Promise<void> {
        const { error } = userLogin.validate(httpContext.request.body);
        if (error) throw new Error(error.details[0].message);
    }

    async afterExecute(httpContext: HttpContext): Promise<void> {
        const send = httpContext.response.send;
        //const userd
        httpContext.response.send = user => {
            httpContext.response.send = send;
            const token = jwt.sign({ ...user }, process.env.SHOPPY__ACCESS_TOKEN, { expiresIn: "1d" });
            httpContext.response.setHeader("x-auth", token);
            return send.call(httpContext.response, user) as Response;
        };
    }
}
