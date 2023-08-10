import { ResponseInterface } from "../src/models/response";
import { ProductInterface, ProductSaleInterface } from "../src/models/product";
import { InvoiceViewInterface } from "../src/models/invoiceView";
import { ApiClient } from "../src/core/http/api.client";
import { UserInterface } from "../src/models/user";
import bcrypt from "bcrypt";
import mysql, { ResultSetHeader, format, QueryError } from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

/*********************
SETUP
**********************/
const apiUser = new ApiClient(process.env.BASE_URL + "/api/users");
const apiCheckout = new ApiClient(process.env.BASE_URL + "/api/checkout");

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

const pool = mysql.createPool({
    host: process.env.SHOPPY__MYSQLHOST,
    port: Number(process.env.SHOPPY__MYSQLPORT),
    database: process.env.SHOPPY__MYSQLDATABASE,
    user: process.env.SHOPPY__MYSQLUSER,
    decimalNumbers: true,
    password: process.env.SHOPPY__MYSQLPASSWORD,
});

describe("/api/users/signup", () => {
    it("should create an user", async () => {
        const response = await apiUser.post<ResponseInterface<UserInterface>>("signup", null, JSON.stringify(user));
        expect(response.data.message).toBe(undefined);
        const token = response.headers.get("x-auth");
        apiCheckout.authorize(token);
        user.id = response.data.data.id;
    });
});

/******************
TESTS
*******************/

describe("POST /api/checkout/produce", () => {
    it("should produce an invoice", async () => {
        const response = await apiCheckout.post<ResponseInterface<InvoiceResponse>>("produce", null, JSON.stringify(products1));
        expect(response.data.message).toBe(undefined);
        expect(response.data.data.total).toBe(300);
        expect(response.data.data.email).toBe("testcheckout@email.com");
    }, 15000);
    it("should produce an invoice", async () => {
        const response = await apiCheckout.post<ResponseInterface<InvoiceResponse>>("produce", null, JSON.stringify(products2));
        expect(response.data.message).toBe(undefined);
        expect(response.data.data.total).toBe(160);
        expect(response.data.data.email).toBe("testcheckout@email.com");
    }, 15000);
});

describe("GET /api/checkout/get", () => {
    it("should get an invoice", async () => {
        const response = await apiCheckout.get<ResponseInterface<InvoiceResponse[]>>("get");
        expect(response.data.message).toBe(undefined);
        expect(response.data.data[0].total).toBe(300);
        expect(response.data.data[1].total).toBe(160);
        expect(response.data.data[0].email).toBe("testcheckout@email.com");
    });
});

/******************
CLEANUP
*******************/

describe("cleanup", () => {
    it("delete invoice from database", async () => {
        const query = format("DELETE FROM invoice WHERE userId = ?", [user.id]);
        try {
            await pool.execute<ResultSetHeader>(query);
        } catch (err) {
            expect((err as QueryError).fatal).toBeFalsy();
        }
    });
    it("delete user from database", async () => {
        const query = format("DELETE FROM user WHERE id = ?", [user.id]);
        try {
            await pool.execute<ResultSetHeader>(query);
        } catch (err) {
            expect((err as QueryError).fatal).toBeFalsy();
        }
        pool.end();
    });
});
