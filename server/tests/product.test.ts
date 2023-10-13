/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable */
import { ResponseInterface } from "../src/models/response";
import { ProductForCreationInterface, ProductInterface } from "../src/models/product";
import { ApiClient } from "../src/core/http/api.client";
import { UserInterface } from "../src/models/user";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { createPool } from "./db.setup";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

/*****************
SETUP
*****************/

const api = new ApiClient(process.env.BASE_URL + "/api/product");
const pool = createPool();

const manager: UserInterface = {
    email: "testManager@example.com",
    password: "",
    name: "Test",
    lastName: "Manager",
    idDocumentType: "DNI",
    idDocumentNumber: 12312313,
    rol: "Manager",
};

const productForCreation: ProductForCreationInterface = {
    name: "test1",
    description: "test test test test test test test",
    price: 35,
    discountPercentage: 1,
    currentStock: 30,
    reorderPoint: 10,
    minimum: 5,
    categories: ["Chaqueta", "Sudadera"],
    sizes: ["Hombre", "Niños"],
    brand: "Nike",
    img_file: null,
};

let storeId: number;

beforeAll(async () => {
    try {
        //Create manager
        manager.password = await bcrypt.hash("test1234", 10);
        const [response] = await pool.query<ResultSetHeader>("INSERT INTO user SET ?", [manager]);
        manager.id = response.insertId;
        const token = jwt.sign({ ...manager }, process.env.SHOPPY__ACCESS_TOKEN, { expiresIn: "1d" });
        api.authorize(token);
        //Create store
        const [result] = await pool.query<ResultSetHeader>("INSERT INTO store SET name='test', managerId = ?, apiUrl = 'test.com'", [manager.id]);
        storeId = result.insertId;
        //Login Manager
    } catch (err) {
        console.error(err);
    }
});

afterAll(async () => {
    try {
        await pool.query<RowDataPacket[]>("DELETE FROM user WHERE email = ?", [manager.email]);
        await pool.query("DELETE FROM store WHERE managerId = ?", [manager.id]);
        await pool.query<RowDataPacket[]>("DELETE FROM product WHERE id = ?", [productForCreation.id]);
    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
});

/*****************
TESTS
******************/

describe("GET /api/product", () => {
    it("should return an array of products", async () => {
        const response = await api.get<ResponseInterface<ProductInterface>>(`store/${storeId}/q`);
        expect(response.data.message).toBe(undefined);
        expect(response.data.error).toBeFalsy;
        expect(response.status).toBe(200);
    });
});

describe("POST /api/product", () => {
    it("should fail to create products with invalid fields and rollback any changes", async () => {
        const newProduct = {
            ...productForCreation,
            name: "test3",
            sizes: { size1: "Elefante", size2: "Niños" }, //object is not valid size
        } as any;
        const response = await api.post<ResponseInterface<ProductInterface>>("", null, JSON.stringify(newProduct));
        expect(response.data.message).toBe('"sizes" must be one of [string, array]');
        const failResponse = await pool.query<RowDataPacket[any]>("SELECT * FROM product WHERE name = ?", [productForCreation.name]);
        expect(failResponse[0].length).toBe(0);
    });
    it("should create products", async () => {
        const response = await api.post<ResponseInterface<ProductInterface[]>>("", null, JSON.stringify(productForCreation));
        expect(response.data.message).toBe(undefined);
        expect(response.status).toBe(200);
        productForCreation.id = response.data.data[0].id;
    });
});

describe("GET /api/product/:id", () => {
    it("should return a product 1", async () => {
        const response = await api.get<ResponseInterface<ProductInterface>>(`${productForCreation.id}`);
        expect(response.data.data.name).toBe("test1");
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
        const { img_file, ...productForUpdate } = productForCreation;
        const response = await api.put<ResponseInterface<ProductInterface>>(
            "",
            null,
            JSON.stringify({ ...productForUpdate, categories: ["Zapatos", "Blusa"], sizes: ["Mujer"] })
        );
        expect(response.data.message).toBe(undefined);
        expect(response.status).toBe(200);
        expect(response.data.data.categories[0]).toMatch(/Zapatos/);
        expect(response.data.data.categories[1]).toMatch(/Blusa/);
        expect(response.data.data.sizes[0]).toMatch(/Mujer/);
    });
    it("should not be authorized to change products from other stores", async () => {
        const { img_file, ...productForUpdate } = productForCreation;
        const response = await api.put<ResponseInterface<ProductInterface>>("", null, JSON.stringify({ ...productForUpdate, name: "test2", id: 33 }));
        expect(response.data.message).toMatch(/Unauthorized/);
        expect(response.status).toBe(500);
    });
});

describe("DELETE api/product", () => {
    it("should disable a product", async () => {
        await api.delete<ResponseInterface<ProductInterface>>(`${productForCreation.id}`);
        const response = await api.get<ResponseInterface<ProductInterface>>(`${productForCreation.id}`);
        expect(response.data.message).toBe(undefined);
        expect(response.data.data.status).toBe(0);
        expect(response.status).toBe(200);
        expect(response.data.error).toBeFalsy();
    });
    it("should not be authorized to disable products from other stores", async () => {
        const response = await api.delete<ResponseInterface<ProductInterface>>("33");
        expect(response.data.message).toMatch(/Unauthorized Store/);
        expect(response.status).toBe(500);
        expect(response.data.error).toBeTruthy();
    });
});
