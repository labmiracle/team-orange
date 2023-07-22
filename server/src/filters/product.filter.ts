import { Injectable, DependencyLifeTime } from "@miracledevs/paradigm-web-di";
import { IFilter, HttpContext } from "@miracledevs/paradigm-express-webapi";
import { productSchema } from "../models/product.schema";

/**
 * Requires a mysql connection from the connection pool for the ongoing request.
 */
@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class ProductFilter implements IFilter {
    async beforeExecute(httpContext: HttpContext): Promise<void> {
        try {
            const { error } = productSchema.validate(httpContext.request.body);
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
