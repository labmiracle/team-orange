/* eslint-disable @typescript-eslint/no-explicit-any */
import { productSchema, productArray } from "../src/models/schemas/product.schema";
import { ResponseInterface } from "../src/models/response";
import { ProductInterface } from "../src/models/product";
import { ApiClient } from "../src/core/http/api.client";
import { UserInterface } from "../src/models/user";
import bcrypt from "bcrypt";
import mysql, { ResultSetHeader, RowDataPacket, format } from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

/*****************
SETUP
*****************/
const apiUser = new ApiClient(process.env.BASE_URL + "/api/users");
const api = new ApiClient(process.env.BASE_URL + "/api/product");

const manager: UserInterface = {
    email: "testManager@example.com",
    password: "",
    name: "Test",
    lastName: "Manager",
    idDocumentType: "DNI",
    idDocumentNumber: 12312313,
    rol: "Manager",
};

const product: ProductInterface = {
    name: "test",
    description: "test test test test test test test",
    price: 35,
    discountPercentage: 1,
    currentStock: 30,
    reorderPoint: 10,
    minimum: 5,
    categories: ["Chaqueta", "Sudadera"],
    sizes: ["Hombre", "Niños"],
    brand: "Nike",
    url_img: "images/chaqueta_de_invierno.webp",
    status: 1,
};

const hashPassword = async () => {
    manager.password = await bcrypt.hash("test1234", 10);
};

const pool = mysql.createPool({
    host: process.env.SHOPPY__MYSQLHOST,
    port: Number(process.env.SHOPPY__MYSQLPORT),
    database: process.env.SHOPPY__MYSQLDATABASE,
    user: process.env.SHOPPY__MYSQLUSER,
    decimalNumbers: true,
    password: process.env.SHOPPY__MYSQLPASSWORD,
});

/*****************
TESTS
******************/

describe("Setup for manager tests", () => {
    it("create manager", async () => {
        await hashPassword();
        const query = format("INSERT INTO user SET ?", [manager]);
        const [response] = await pool.execute<ResultSetHeader>(query);
        manager.id = response.insertId;
    });
    it("create store", async () => {
        const query = format("INSERT INTO store SET name='test', managerId = ?, apiUrl = 'test.com'", [manager.id]);
        const [response] = await pool.execute<ResultSetHeader>(query);
    });
    it("login manager", async () => {
        const response = await apiUser.post<ResponseInterface<UserInterface>>("login", null, JSON.stringify({ email: manager.email, password: "test1234" }));
        const token = response.headers.get("x-auth");
        api.authorize(token);
    });
});

describe("GET /api/product", () => {
    it("should return an array of products", async () => {
        const response = await api.get<ResponseInterface<ProductInterface>>("");
        expect(response.data.message).toBe(undefined);
        expect(response.data.error).toBeFalsy;
        expect(response.status).toBe(200);
    });
});

describe("POST /api/product", () => {
    it("should create a product", async () => {
        const response = await api.post<ResponseInterface<ProductInterface>>("", null, JSON.stringify(product));
        expect(response.data.message).toBe(undefined);
        expect(response.status).toBe(200);
        product.id = response.data.data.id;
    });
    it("should not be authorized to create products in other stores", async () => {
        const response = await api.post<ResponseInterface<ProductInterface>>("", null, JSON.stringify({ ...product, storeId: 1 }));
        // eslint-disable-next-line no-useless-escape
        expect(response.data.message).toMatch(/\"storeId\" is not allowed/);
        expect(response.status).toBe(500);
    });
});

describe("GET /api/product/:id", () => {
    it("should return a product", async () => {
        const response = await api.get<ResponseInterface<ProductInterface>>(`${product.id}`);
        expect(response.data.data.name).toBe("test");
        expect(response.status).toBe(200);
    });
    it("should not found product", async () => {
        const response = await api.get<ResponseInterface<ProductInterface>>("-1");
        expect(response.data.message).not.toBe(undefined);
        expect(response.status).toBe(500);
        expect(response.data.error).toBe(true);
    });
});

describe("PUT api/product", () => {
    it("should update a product", async () => {
        const response = await api.put<ResponseInterface<ProductInterface>>(
            "",
            null,
            JSON.stringify({ ...product, categories: ["Zapatos", "Blusa"], sizes: ["Mujer"] })
        );
        expect(response.data.message).toBe(undefined);
        expect(response.status).toBe(200);
        expect(response.data.data.categories[0]).toMatch(/Zapatos/);
        expect(response.data.data.categories[1]).toMatch(/Blusa/);
        expect(response.data.data.sizes[0]).toMatch(/Mujer/);
    });
    it("should not be authorized to change products from other stores", async () => {
        const response = await api.put<ResponseInterface<ProductInterface>>("", null, JSON.stringify({ ...product, name: "test2", id: 1 }));
        expect(response.data.message).toMatch(/Unauthorized/);
        expect(response.status).toBe(500);
    });
});

describe("DELETE api/product", () => {
    it("should delete a product", async () => {
        await api.delete<ResponseInterface<ProductInterface>>("", JSON.stringify({ id: product.id }));
        const response = await api.get<ResponseInterface<ProductInterface>>(`${product.id}`);
        expect(response.data.message).toBe(undefined);
        expect(response.data.data.status).toBe(0);
        expect(response.status).toBe(200);
        expect(response.data.error).toBeFalsy();
    });
    it("should not be authorized to delete products from other stores", async () => {
        const response = await api.delete<ResponseInterface<ProductInterface>>("", JSON.stringify({ id: 33 }));
        expect(response.data.message).toMatch(/Unauthorized Store/);
        expect(response.status).toBe(500);
        expect(response.data.error).toBeTruthy();
    });
});

describe("Cleaning database", () => {
    it("delete store", async () => {
        const query = format("DELETE FROM store WHERE managerId = ?", [manager.id]);
        await pool.execute(query);
    });
    it("delete manager", async () => {
        await hashPassword();
        const query = format("DELETE FROM user WHERE email = ?", [manager.email]);
        await pool.execute<RowDataPacket[]>(query);
    });
    it("delete product", async () => {
        await pool.execute<RowDataPacket[]>(format("DELETE FROM productCategory WHERE productId = ?", [product.id]));
        await pool.execute<RowDataPacket[]>(format("DELETE FROM productSize WHERE productId = ?", [product.id]));
        await pool.execute<RowDataPacket[]>(format("DELETE FROM product WHERE id = ?", [product.id]));
        pool.end();
    });
});
