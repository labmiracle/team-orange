import { ResponseInterface } from "../src/models/response";
import { ProductSaleInterface } from "../src/models/product";
import { InvoiceViewInterface } from "../src/models/invoiceView";
import { ApiClient } from "../src/core/http/api.client";
import { UserInterface } from "../src/models/user";
import { createPool } from "./db.setup";
import { ResultSetHeader } from "mysql2/promise";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

/*********************
SETUP
**********************/

const api = new ApiClient(process.env.BASE_URL + "/api/checkout");
const pool = createPool();

interface InvoiceResponse extends InvoiceViewInterface {
    messageUrl: string | false;
}

const user: UserInterface = {
    email: "testcheckout@email.com",
    password: "test12345",
    name: "test",
    lastName: "test",
    idDocumentType: "DNI",
    idDocumentNumber: 11122233,
};

const products1: ProductSaleInterface[] = [
    {
        id: 3,
        name: "Zapatillas de running",
        description: "Zapatillas ligeras para correr",
        price: 90,
        discountPercentage: 0.5,
        currentStock: 100,
        reorderPoint: 30,
        minimum: 15,
        storeId: 3,
        categories: ["Zapatillas"],
        sizes: ["Niños"],
        brand: "Adidas",
        url_img: "images/zapatillas_adidas.webp",
        quantity: 2,
    },
    {
        id: 4,
        name: "Vestido floral",
        description: "Vestido de estilo floral para ocasiones especiales",
        price: 70,
        discountPercentage: 1,
        currentStock: 30,
        reorderPoint: 5,
        minimum: 3,
        storeId: 1,
        categories: ["Vestido"],
        sizes: ["Mujer"],
        brand: "Casio",
        url_img: "images/vestido_floral.webp",
        quantity: 3,
    },
];

const products2: ProductSaleInterface[] = [
    {
        id: 3,
        name: "Zapatillas de running",
        description: "Zapatillas ligeras para correr",
        price: 90,
        discountPercentage: 0.5,
        currentStock: 100,
        reorderPoint: 30,
        minimum: 15,
        storeId: 3,
        categories: ["Zapatillas"],
        sizes: ["Niños"],
        brand: "Adidas",
        url_img: "images/zapatillas_adidas.webp",
        quantity: 2,
    },
    {
        id: 4,
        name: "Vestido floral",
        description: "Vestido de estilo floral para ocasiones especiales",
        price: 70,
        discountPercentage: 1,
        currentStock: 30,
        reorderPoint: 5,
        minimum: 3,
        storeId: 1,
        categories: ["Vestido"],
        sizes: ["Mujer"],
        brand: "Casio",
        url_img: "images/vestido_floral.webp",
        quantity: 1,
    },
];

beforeAll(async () => {
    try {
        user.password = await bcrypt.hash("test1234", 10);
        const [response] = await pool.query<ResultSetHeader>("INSERT INTO user SET ?", [user]);
        user.id = response.insertId;
        const token = jwt.sign({ ...user }, process.env.SHOPPY__ACCESS_TOKEN, { expiresIn: "1d" });
        api.authorize(token);
    } catch (err) {
        console.error(err);
    }
});

afterAll(async () => {
    try {
        await pool.query("DELETE FROM invoice WHERE userId = ?", [user.id]);
        await pool.query("DELETE FROM user WHERE id = ?", [user.id]);
    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
});

/******************
TESTS
*******************/

describe("POST /api/checkout/produce", () => {
    it("should produce an invoice", async () => {
        const response = await api.post<ResponseInterface<InvoiceResponse>>("produce", null, JSON.stringify(products1));
        expect(response.data.message).toBe(undefined);
        expect(response.data.data.total).toBe(300);
        expect(response.data.data.email).toBe("testcheckout@email.com");
    }, 15000);
    it("should produce an invoice", async () => {
        const response = await api.post<ResponseInterface<InvoiceResponse>>("produce", null, JSON.stringify(products2));
        expect(response.data.message).toBe(undefined);
        expect(response.data.data.total).toBe(160);
        expect(response.data.data.email).toBe("testcheckout@email.com");
    }, 15000);
});

describe("GET /api/checkout/get", () => {
    it("should get an invoice", async () => {
        const response = await api.get<ResponseInterface<InvoiceResponse[]>>("get");
        expect(response.data.message).toBe(undefined);
        expect(response.data.data[0].total).toBe(300);
        expect(response.data.data[1].total).toBe(160);
        expect(response.data.data[0].email).toBe("testcheckout@email.com");
    });
});
