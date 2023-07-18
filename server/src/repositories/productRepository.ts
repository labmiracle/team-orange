import { ResultSetHeader, RowDataPacket } from "mysql2";
import { Product, ResponseProduct } from "../models/productModel";
import { createPool, format } from "mysql2/promise";
import { dbconfig } from "../config/db";

const pool = createPool(dbconfig);

export const getProduct = async (id: string | undefined): Promise<Product | undefined> => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute<RowDataPacket[] & Product[]>(
            `
        SELECT
          Product.id,
          Product.name,
          Product.description,
          Product.price,
          Product.discountPercentage,
          Product.currentStock,
          Product.reorderPoint,
          Product.minimum,
          Brand.name AS brand,
          Product.url_img,
          (
            SELECT JSON_ARRAYAGG(CategoryName)
            FROM (
              SELECT DISTINCT Category.name AS CategoryName
              FROM Category
              INNER JOIN ProductCategory ON ProductCategory.categoryId = Category.id
              WHERE ProductCategory.productId = Product.id
            ) AS Categories
          ) AS category,
          JSON_ARRAYAGG(size.name) AS size
        FROM
            Product
        LEFT JOIN
            brand ON Product.brandId = brand.id
        LEFT JOIN
            ProductSize ON Product.id = ProductSize.productId
        LEFT JOIN
            Size ON ProductSize.sizeId = Size.id
        GROUP BY
            Product.id,
            Product.name,
            Product.description,
            Product.price,
            Product.discountPercentage,
            Product.currentStock,
            Product.reorderPoint,
            Product.minimum,
            Product.url_img
        HAVING
            Product.id = ?;
            `,
            [id]
        );
        if (rows.length) {
            const product = rows[0];
            return product;
        }
    } catch (error) {
        throw new Error("Internal Server Error");
    } finally {
        connection.release();
    }
};

export const getProducts = async (): Promise<Product[]> => {
    const connection = await pool.getConnection();
    try {
        const [products] = await connection.execute<RowDataPacket[] & Product[]>(`
        SELECT
          Product.id,
          Product.name,
          Product.description,
          Product.price,
          Product.discountPercentage,
          Product.currentStock,
          Product.reorderPoint,
          Product.minimum,
          Brand.name AS brand,
          Product.url_img,
          (
            SELECT JSON_ARRAYAGG(CategoryName)
            FROM (
              SELECT DISTINCT Category.name AS CategoryName
              FROM Category
              INNER JOIN ProductCategory ON ProductCategory.categoryId = Category.id
              WHERE ProductCategory.productId = Product.id
            ) AS Categories
          ) AS category,
          JSON_ARRAYAGG(size.name) AS size
        FROM
            Product
        LEFT JOIN
            brand ON Product.brandId = brand.id
        LEFT JOIN
            ProductSize ON Product.id = ProductSize.productId
        LEFT JOIN
            Size ON ProductSize.sizeId = Size.id
        GROUP BY
            Product.id,
            Product.name,
            Product.description,
            Product.price,
            Product.discountPercentage,
            Product.currentStock,
            Product.reorderPoint,
            Product.minimum,
            Product.url_img;
            `);
        return products;
    } catch (error: any) {
        throw new Error(error.message);
    } finally {
        connection.release();
    }
};

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
            INSERT INTO Product (name, description, price, discountPercentage, currentStock, reorderPoint, minimum, brandId, url_img, storeId)
            VALUES (?, ?, ?, ?, ?, ?, ?,?,?,?)`,
            [
                product.name,
                product.description,
                product.price,
                product.discountPercentage,
                product.currentStock,
                product.reorderPoint,
                product.minimum,
                resultBrand[0].id,
                product.url_img,
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
    } catch (error: any) {
        if (error.code === "ER_DUP_ENTRY" && error.sqlMessage.includes("email")) {
            throw new Error("Email already exists");
        } else if (error.code === "ER_DUP_ENTRY" && error.sqlMessage.includes("idDocumentNumber")) {
            throw new Error("ID document number already exists");
        } else {
            throw new Error("Failed to create product: " + error.message);
        }
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
        throw new Error("Internal Server Error");
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
    } catch (error: any) {
        throw new Error("Internal Server Error");
    } finally {
        connection.release();
    }
};
