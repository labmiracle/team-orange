import { Product } from "../models/product";
import { MySqlConnection } from "../core/mysql/mysql.connection";
import { DependencyContainer, DependencyLifeTime, Injectable } from "@miracledevs/paradigm-web-di";
import { EditRepositoryBase } from "../core/repositories/edit.repository";
import { format } from "mysql2";

@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class ProductRepository extends EditRepositoryBase<Product> {
    constructor(dependecyContainer: DependencyContainer, connection: MySqlConnection) {
        super(dependecyContainer, connection, Product, "product_view");
    }

    async getFilteredProducts(size?: string, category?: string, limit?: string, store?:string) {
        const queryStrings: string[] = [];

        const params: string[] = [];

        if (size) {
            queryStrings.push("sizes = ?");
            params.push(size);
        }

        if (category) {
            queryStrings.push("categories = ?");
            params.push(category);
        }

        if(store) {
            queryStrings.push("storeId = ?");
            params.push(store);
        }

        let query = queryStrings.join(" AND ");
        if(size || category) query = " WHERE " + query;

        if(limit) {
            query += " LIMIT = ?";
            params.push(limit);
        }

        const [rows] = await this.connection.connection.query("SELECT * FROM product_view" + query, params);
        return rows;
    }

    async getAllProducts(storeId:number, pageNumber = 1, productAmount: number) {
        const limit = [(pageNumber - 1) * productAmount, (pageNumber) * productAmount];
        const query = format(`SELECT * FROM \`${this.tableName}\` WHERE storeId = ? LIMIT ?` , [storeId, limit]);
        const [rows] = await this.connection.connection.query(query);
        return this.map(rows, this.entityType);
    }
}
