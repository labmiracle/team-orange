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

    async getFilteredProducts(size: string, category: string) {
        let query = `SELECT p.*, c.name AS categories, s.name AS sizes
                    FROM Product AS p
                    JOIN ProductSize AS ps ON p.id = ps.productId
                    JOIN Size AS s ON ps.sizeId = s.id
                    JOIN ProductCategory AS pc ON p.id = pc.productId
                    JOIN Category AS c ON pc.categoryId = c.id`;

        const params: string[] = [];
        if (size) {
            query += " WHERE s.name = ?";
            params.push(size);
        }

        if (category) {
            query += size ? " AND c.name = ?" : " WHERE c.name = ?";
            params.push(category);
        }

        const [rows] = await this.connection.connection.execute(query, params);
        return rows;
    }
}
