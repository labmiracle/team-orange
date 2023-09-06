/* eslint-disable @typescript-eslint/no-explicit-any */
import { DependencyContainer, DependencyLifeTime, Injectable } from "@miracledevs/paradigm-web-di";
import { EditRepositoryBase } from "../core/repositories/edit.repository";
import { Store } from "../models/store";
import { MySqlConnection } from "../core/mysql/mysql.connection";

@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class StoreRepository extends EditRepositoryBase<Store> {
    constructor(dependecyContainer: DependencyContainer, connection: MySqlConnection) {
        super(dependecyContainer, connection, Store, "store");
    }

    async getNames() {
        const query = `SELECT id, name FROM \`${this.tableName}\` WHERE status = 1 `;
        const [rows] = await this.connection.connection.execute(query);
        return rows;
    }

    async getStores() {
        const query = `SELECT id, name, managerId, status, apiUrl FROM \`${this.tableName}\` `;
        const [rows] = await this.connection.connection.execute(query);
        return rows;
    }

    async getCategoriesAndSizesById(storeId: number) {
        const categoryQuery = `SELECT DISTINCT Category.name AS category
        FROM Product
        LEFT JOIN ProductCategory ON Product.id = ProductCategory.productId
        LEFT JOIN Category ON ProductCategory.categoryId = Category.id
        WHERE Product.storeId = ?;
        `;
        const sizeQuery = `SELECT DISTINCT Size.name AS size
        FROM Product
        LEFT JOIN ProductSize ON Product.id = ProductSize.productId
        LEFT JOIN Size ON ProductSize.sizeId = Size.id
        WHERE Product.storeId = ?;
        `;
        const [categories] = await this.connection.connection.query(categoryQuery, storeId);
        const [sizes] = await this.connection.connection.query(sizeQuery, storeId);
        return { categories, sizes };
    }
}
