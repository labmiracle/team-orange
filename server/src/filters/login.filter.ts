import { Injectable, DependencyLifeTime } from "@miracledevs/paradigm-web-di";
import { IFilter, HttpContext } from "@miracledevs/paradigm-express-webapi";
import { userLogin } from "../models/schemas/user.schema";

@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class LoginFilter implements IFilter {
    async beforeExecute(httpContext: HttpContext): Promise<void> {
        try {
            const { error } = userLogin.validate(httpContext.request.body);
            if (error) throw new Error(error.details[0].message);
        } catch (err) {
            httpContext.response.status(400).json({
                message: err.message,
                data: undefined,
                error: true,
            });
        }
    }
}
