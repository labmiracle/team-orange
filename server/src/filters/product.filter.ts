import { Injectable, DependencyLifeTime } from "@miracledevs/paradigm-web-di";
import { IFilter, HttpContext } from "@miracledevs/paradigm-express-webapi";
import { productSchema, productArray, productSaleArray } from "../models/schemas/product.schema";
import { NextFunction } from "express";
import multer from "multer";

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
 * Process image from product creation form
 */

/* declare class nextFunction {
    readonly next: NextFunction;
    constructor(next: NextFunction);
} */

@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class HandleImages implements IFilter {
    async beforeExecute(httpContext: HttpContext): Promise<void> {
        const upload = multer({ dest: ".public/" }).single("img_file");
        upload(httpContext.request, httpContext.response, () => {
            const body = httpContext.request.body;
            const files = httpContext.request.file;
            console.log(body);
            console.log(files);
            return httpContext.request;
        });
    }
}
