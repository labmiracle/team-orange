import { Injectable, DependencyLifeTime } from "@miracledevs/paradigm-web-di";
import { IFilter, HttpContext } from "@miracledevs/paradigm-express-webapi";
import { productSchema, productArray, productSaleArray } from "../models/schemas/product.schema";
import { MySqlConnection } from "../core/mysql/mysql.connection";
import { BatchDbCommand } from "../core/repositories/commands/batch.command";
import { RowDataPacket } from "mysql2/promise";

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

@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class ProductSaleArrayFilter implements IFilter {
    async beforeExecute(httpContext: HttpContext): Promise<void> {
        const { error } = productSaleArray.validate(httpContext.request.body);
        if (error) throw new Error(error.details[0].message);
    }
}

@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class authProductFilter implements IFilter {
    protected batch: BatchDbCommand;
    constructor(protected readonly connection: MySqlConnection) {
        this.batch = new BatchDbCommand(connection);
    }

    async beforeExecute(httpContext: HttpContext): Promise<void> {
        const { id: idUser } = httpContext.request.body.decodedToken;
        const { id: idProduct } = httpContext.request.body.entity;
        const [rowsP] = await this.connection.connection.execute<RowDataPacket[]>(
            "SELECT * FROM product p JOIN store s ON s.id = p.storeId WHERE managerId = ? AND p.id = ?",
            [idUser, idProduct]
        );
        if (!rowsP || rowsP.length === 0) throw new Error("Unauthorized Store");
    }
}
