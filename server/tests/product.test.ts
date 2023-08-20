/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable */
import { ResponseInterface } from "../src/models/response";
import { ProductInterface } from "../src/models/product";
import { ApiClient } from "../src/core/http/api.client";
import { UserInterface } from "../src/models/user";
import mysql, { ResultSetHeader, RowDataPacket, format } from "mysql2/promise";
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

const product: ProductInterface[] = [
    {
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
    },
    {
        name: "test2",
        description: "test test test test test test test",
        price: 100,
        discountPercentage: 0.5,
        currentStock: 30,
        reorderPoint: 10,
        minimum: 5,
        categories: ["Chaqueta", "Sudadera"],
        sizes: ["Hombre", "Niños"],
        brand: "Nike",
        url_img: "images/chaqueta_de_invierno.webp",
        status: 1,
    },
];

beforeAll(async () => {
    try {
        //Create manager
        manager.password = await bcrypt.hash("test1234", 10);
        const [response] = await pool.query<ResultSetHeader>("INSERT INTO user SET ?", [manager]);
        manager.id = response.insertId;
        const token = jwt.sign({ ...manager }, process.env.SHOPPY__ACCESS_TOKEN, { expiresIn: "1d" });
        api.authorize(token);
        //Create store
        await pool.query<ResultSetHeader>("INSERT INTO store SET name='test', managerId = ?, apiUrl = 'test.com'", [manager.id]);
        //Login Manager
    } catch (err) {
        console.error(err);
    }
});

afterAll(async () => {
    try {
        await pool.query("DELETE FROM store WHERE managerId = ?", [manager.id]);
        await pool.query<RowDataPacket[]>("DELETE FROM user WHERE email = ?", [manager.email]);
        await pool.query<RowDataPacket[]>("DELETE FROM product WHERE id = ?", [product[0].id]);
        await pool.query<RowDataPacket[]>("DELETE FROM product WHERE id = ?", [product[1].id]);
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
        const response = await api.get<ResponseInterface<ProductInterface>>("");
        expect(response.data.message).toBe(undefined);
        expect(response.data.error).toBeFalsy;
        expect(response.status).toBe(200);
    });
});

describe("POST /api/product", () => {
    it("should fail to create products with invalid fields and rollback any changes", async () => {
        const newProducts = [
            ...product,
            {
                ...product[0],
                name: "test3",
                sizes: ["Elefante", "Niños"], //Elefante is not a valid size
            },
        ];
        const response = await api.post<ResponseInterface<ProductInterface[]>>("", null, JSON.stringify(newProducts));
        expect(response.data.message).toBe('"[2].sizes[0]" must be one of [Hombre, Mujer, Niños]'); //newProducts[2].size[0] failed
        const failResponse = await pool.query<RowDataPacket[any]>("SELECT * FROM product WHERE name = ?", [product[0].name]);
        expect(failResponse[0].length).toBe(0);
    });
    it("should create products", async () => {
        const response = await api.post<ResponseInterface<ProductInterface[]>>("", null, JSON.stringify(product));
        expect(response.data.message).toBe(undefined);
        expect(response.status).toBe(200);
        product[0].id = response.data.data[0].id;
        product[1].id = response.data.data[1].id;
    });
});

describe("GET /api/product/:id", () => {
    it("should return a product 1", async () => {
        const response = await api.get<ResponseInterface<ProductInterface>>(`${product[0].id}`);
        expect(response.data.data.name).toBe("test");
        expect(response.status).toBe(200);
    });
    it("should return a product 2", async () => {
        const response = await api.get<ResponseInterface<ProductInterface>>(`${product[1].id}`);
        expect(response.data.data.name).toBe("test2");
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
            JSON.stringify({ ...product[0], categories: ["Zapatos", "Blusa"], sizes: ["Mujer"] })
        );
        expect(response.data.message).toBe(undefined);
        expect(response.status).toBe(200);
        expect(response.data.data.categories[0]).toMatch(/Zapatos/);
        expect(response.data.data.categories[1]).toMatch(/Blusa/);
        expect(response.data.data.sizes[0]).toMatch(/Mujer/);
    });
    it("should not be authorized to change products from other stores", async () => {
        const response = await api.put<ResponseInterface<ProductInterface>>("", null, JSON.stringify({ ...product[0], name: "test2", id: 33 }));
        expect(response.data.message).toMatch(/Unauthorized/);
        expect(response.status).toBe(500);
    });
});

describe("DELETE api/product", () => {
    it("should disable a product", async () => {
        await api.delete<ResponseInterface<ProductInterface>>("", JSON.stringify({ id: product[0].id }));
        const response = await api.get<ResponseInterface<ProductInterface>>(`${product[0].id}`);
        expect(response.data.message).toBe(undefined);
        expect(response.data.data.status).toBe(0);
        expect(response.status).toBe(200);
        expect(response.data.error).toBeFalsy();
    });
    it("should not be authorized to disable products from other stores", async () => {
        const response = await api.delete<ResponseInterface<ProductInterface>>("", JSON.stringify({ id: 33 }));
        expect(response.data.message).toMatch(/Unauthorized Store/);
        expect(response.status).toBe(500);
        expect(response.data.error).toBeTruthy();
    });
});
