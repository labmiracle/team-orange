import { Injectable, DependencyLifeTime } from "@miracledevs/paradigm-web-di";
import { IFilter, HttpContext } from "@miracledevs/paradigm-express-webapi";
import { storeSchema } from "../models/schemas/store.schema";

/**
 * Requires a mysql connection from the connection pool for the ongoing request.
 */
@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class StoreFilter implements IFilter {
    async beforeExecute(httpContext: HttpContext): Promise<void> {
        const { error } = storeSchema.validate(httpContext.request.body);
        if (error) throw new Error(error.details[0].message);
    }
}
