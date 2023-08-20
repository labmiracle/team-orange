import { Injectable, DependencyLifeTime } from "@miracledevs/paradigm-web-di";
import { IFilter, HttpContext } from "@miracledevs/paradigm-express-webapi";
import { productSchema, productArray, productSaleArray } from "../models/schemas/product.schema";
import { MySqlConnection } from "../core/mysql/mysql.connection";
import { BatchDbCommand } from "../core/repositories/commands/batch.command";
import { RowDataPacket } from "mysql2/promise";
import { ProductInterface, ProductSaleInterface } from "../models/product";
import { ProductDBRepository } from "../repositories/productDB.repository";

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
 * Check if the product to be modified belong to the manager's store
 */
@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class authProductFilter implements IFilter {
    protected batch: BatchDbCommand;
    constructor(protected readonly connection: MySqlConnection, private productDBRepo: ProductDBRepository) {
        this.batch = new BatchDbCommand(connection);
    }

    async beforeExecute(httpContext: HttpContext): Promise<void> {
        const { id: idUser } = JSON.parse(httpContext.request.header("x-auth"));
        const { id: idProduct } = httpContext.request.body;
        const idManager = await this.productDBRepo.getManager(idProduct);
        if (idManager !== idUser) throw new Error("Unauthorized Store");
    }
}
