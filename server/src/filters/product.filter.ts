import { Injectable, DependencyLifeTime } from "@miracledevs/paradigm-web-di";
import { IFilter, HttpContext } from "@miracledevs/paradigm-express-webapi";
import { productSchema, productArray, productSaleArray, productForCreation } from "../models/schemas/product.schema";

/**
 * Validate product of type {@link ProductInterface}
 */
@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class ProductFilter implements IFilter {
    async beforeExecute(httpContext: HttpContext): Promise<void> {
        const { error } = productSchema.validate(httpContext.request.body);
        if (error) throw new Error(error.details[0].message);
    }
}

/**
 * Validate an array of products of type {@link ProductInterface}
 */
@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class ProductArrayFilter implements IFilter {
    async beforeExecute(httpContext: HttpContext): Promise<void> {
        const { error } = productArray.validate(httpContext.request.body);
        if (error) throw new Error(error.details[0].message);
    }
}

/**
 * Validate product of type {@link ProductSaleInterface}
 */
@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class ProductSaleArrayFilter implements IFilter {
    async beforeExecute(httpContext: HttpContext): Promise<void> {
        const { error } = productSaleArray.validate(httpContext.request.body);
        if (error) throw new Error(error.details[0].message);
    }
}

/**
 * Validate product of type {@link ProductForCreationInterface}
 */
@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class ProductForCreationFilter implements IFilter {
    async beforeExecute(httpContext: HttpContext): Promise<void> {
        const { error } = productForCreation.validate(httpContext.request.body);
        if (error) throw new Error(error.details[0].message);
    }
}
