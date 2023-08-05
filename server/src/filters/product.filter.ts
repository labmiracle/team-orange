import { Injectable, DependencyLifeTime } from "@miracledevs/paradigm-web-di";
import { IFilter, HttpContext } from "@miracledevs/paradigm-express-webapi";
import { productSchema, productArray } from "../models/schemas/product.schema";

/**
 * Requires a mysql connection from the connection pool for the ongoing request.
 */
@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class ProductFilter implements IFilter {
    async beforeExecute(httpContext: HttpContext): Promise<void> {
        const { error } = productSchema.validate(httpContext.request.body);
        if (error) throw new Error(error.details[0].message);
    }
}

@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class ProductArrayFilter implements IFilter {
    async beforeExecute(httpContext: HttpContext): Promise<void> {
        const { error } = productArray.validate(httpContext.request.body);
        if (error) throw new Error(error.details[0].message);
    }
}
