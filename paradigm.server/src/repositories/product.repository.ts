import { ResultSetHeader, RowDataPacket, QueryError } from "mysql2";
import { Product } from "../models/product";
import { MySqlConnection } from "../core/mysql/mysql.connection";
import { DependencyContainer, DependencyLifeTime, Injectable } from "@miracledevs/paradigm-web-di";
import { EditRepositoryBase } from "../core/repositories/edit.repository";

/* export const getProduct = async (id: string | undefined): Promise<Product | undefined> => {
    try {
        const conn = new MySqlConnection();
        const [rows] = await conn.connection.execute<RowDataPacket[] & Product[]>(`
        SELECT * FROM product_view
        HAVING
            storeId = ?;
            `,[id]);
        if (rows.length) {
            const product = rows[0];
            return product;
        }
    } catch (error) {
        const { name, message } = error as QueryError;
        console.error(name + message);
        throw new Error(name + ": " + message);
    }
}; */

@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class ProductRepository extends EditRepositoryBase<Product> {
    constructor(dependecyContainer: DependencyContainer, connection: MySqlConnection) {
        super(dependecyContainer, connection, Product, "product_view");
    }
}

/*
export const getProducts = async (storeId: number): Promise<Product[]> => {
    try {
        const conn = new MySqlConnection();
        const [products] = await conn.connection.execute<RowDataPacket[] & Product[]>(
            `SELECT * FROM product_view HAVING
                storeId = ?;`,
            [storeId]
        );
        return products;
    } catch (error) {
        const { name, message } = error as QueryError;
        console.error(name + message);
        throw new Error(name + ": " + message);
    }
}; */
/*
export const createProduct = async (product: ResponseProduct): Promise<boolean | undefined | ResultSetHeader> => {
    const connection = await pool.getConnection();
    try {
        const [resultBrand] = await connection.execute<RowDataPacket[]>(
            `
                SELECT id FROM Brand
                WHERE name = ?
            `,
            [product.brandName]
        );

        const [result] = await connection.execute<ResultSetHeader>(
            `
            INSERT INTO Product (name, description, price, discountPercentage, currentStock, reorderPoint, minimum, brandId, storeId)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                product.name,
                product.description,
                product.price,
                product.discountPercentage,
                product.currentStock,
                product.reorderPoint,
                product.minimum,
                resultBrand[0].id,
                product.storeId,
            ]
        );
        try {
            for (const category of product.categories) {
                const [categoryResponse] = await connection.execute<RowDataPacket[]>(
                    `
                SELECT id FROM Category
                WHERE name = ?;
                `,
                    [category]
                );

                await connection.execute<ResultSetHeader>(
                    `
                    INSERT INTO ProductCategory (productId, categoryId)
                    VALUES (?, ?)`,
                    [result.insertId, categoryResponse[0].id]
                );
            }
        } catch (e) {
            throw new Error("Invalid category");
        }

        try {
            for (const size of product.sizes) {
                const [sizeResponse] = await connection.execute<RowDataPacket[]>(
                    `
                SELECT id FROM Size
                WHERE name = ?;
                `,
                    [size]
                );

                await connection.execute<ResultSetHeader>(
                    `
                    INSERT INTO ProductSize (productId, sizeId)
                    VALUES (?, ?)`,
                    [result.insertId, sizeResponse[0].id]
                );
            }
        } catch (e) {
            throw new Error("Invalid size");
        }
        if (result.insertId) return true;
    } catch (error) {
        const { name, message } = error as QueryError;
        console.error(name + message);
        throw new Error(name + ": " + message);
    } finally {
        connection.release();
    }
};

export const deleteProduct = async (id: number) => {
    const connection = await pool.getConnection();
    try {
        const [result] = await connection.execute<ResultSetHeader>("DELETE FROM Product WHERE id = ?", [id]);
        return result.affectedRows === 1;
    } catch (error) {
        const { name, message } = error as QueryError;
        throw new Error(name + ": " + message);
    } finally {
        connection.release();
    }
};

type QueryParamsT = {
    price?: number;
    discountPercentage?: number;
    reorderPoint?: number;
    minimum?: number;
    currentStock?: number;
};

export const updateProduct = async (id: string, { price, discountPercentage, reorderPoint, minimum, currentStock }: Product): Promise<boolean | undefined> => {
    const connection = await pool.getConnection();
    try {
        const queryParameters: QueryParamsT = {};
        if (price) queryParameters["price"] = price;
        if (discountPercentage) queryParameters["discountPercentage"] = discountPercentage;
        if (reorderPoint) queryParameters["reorderPoint"] = reorderPoint;
        if (minimum) queryParameters["minimum"] = minimum;
        if (currentStock) queryParameters["currentStock"] = currentStock;
        const sqlquery = "UPDATE Product SET ? WHERE id = ?";
        const inserts = [queryParameters, id];
        const sql = format(sqlquery, inserts);
        const [result] = await connection.execute<ResultSetHeader>(sql);
        if (!result.affectedRows) throw new Error("Product not found");
        return true;
    } catch (error) {
        const { name, message } = error as QueryError;
        throw new Error(name + ": " + message);
    } finally {
        connection.release();
    }
}; */
