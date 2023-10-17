import { Product, ProductInterface } from "../models/product";
import { MySqlConnection } from "../core/mysql/mysql.connection";
import { DependencyContainer, DependencyLifeTime, Injectable } from "@miracledevs/paradigm-web-di";
import { EditRepositoryBase } from "../core/repositories/edit.repository";
import { RowDataPacket, format } from "mysql2";

@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class ProductRepository extends EditRepositoryBase<Product> {
    constructor(dependecyContainer: DependencyContainer, connection: MySqlConnection) {
        super(dependecyContainer, connection, Product, "product_view");
    }

    async getFilteredProducts(storeId: number, page: number, per_page: number, size?: string, category?: string): Promise<ProductInterface[]> {
        const queryConditions: string[] = [];
        const params: (number | string)[] = [];

        if (size) {
            queryConditions.push("JSON_SEARCH(sizes, 'one', ?) IS NOT NULL");
            params.push(size);
        }

        if (category) {
            queryConditions.push("JSON_SEARCH(categories, 'one', ?) IS NOT NULL");
            params.push(category);
        }

        if (storeId) {
            queryConditions.push("storeId = ?");
            params.push(storeId);
        }

        let query = "";
        if (queryConditions.length > 0) {
            query = " WHERE " + queryConditions.join(" AND ");
            query += " AND status=1";
        }

        if (page && per_page) {
            const offset = (Number(page) - 1) * Number(per_page);
            query += " LIMIT ?, ?";
            params.push(offset, Number(per_page));
        }

        const [rows] = await this.connection.connection.query<RowDataPacket[]>("SELECT * FROM product_view " + query, params);
        return this.map(rows, this.entityType);
    }

    async getCountFilteredProducts(storeId: number, size?: string, category?: string): Promise<number> {
        const queryConditions: string[] = [];
        const params: (number | string)[] = [];

        if (size) {
            queryConditions.push("JSON_SEARCH(sizes, 'one', ?) IS NOT NULL");
            params.push(size);
        }

        if (category) {
            queryConditions.push("JSON_SEARCH(categories, 'one', ?) IS NOT NULL");
            params.push(category);
        }

        if (storeId) {
            queryConditions.push("storeId = ?");
            params.push(storeId);
        }

        let query = "";
        if (queryConditions.length > 0) {
            query = " WHERE " + queryConditions.join(" AND ");
        }

        const [rows] = await this.connection.connection.query<RowDataPacket[]>("SELECT COUNT(*) as total_products FROM product_view " + query, params);
        return rows[0].total_products;
    }

    async getAllProducts(storeId: number, pageNumber = 1, productAmount: number) {
        const limit = [(pageNumber - 1) * productAmount, pageNumber * productAmount];
        const query = format(`SELECT * FROM \`${this.tableName}\` WHERE storeId = ? LIMIT ?`, [storeId, limit]);
        const [rows] = await this.connection.connection.query(query);
        return this.map(rows, this.entityType);
    }

    async getByManagerId(managerId: number) {
        const [rows] = await this.connection.connection.query(
            `SELECT * FROM \`${this.tableName}\` as pv JOIN store ON storeId = store.id WHERE managerId = ?`,
            [managerId]
        );
        return this.map(rows, this.entityType);
    }
}
