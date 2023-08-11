import { ApiClient } from "../src/core/http/api.client";
import { ResponseInterface } from "../src/models/response";
import { StoreInterface } from "../src/models/store";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { UserInterface } from "../src/models/user";
import { createPool } from "./db.setup";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

/*****************
SETUP
*****************/

let tokenAdmin: string;
let tokenManager: string;

const api = new ApiClient(process.env.BASE_URL + "/api/shop");
const pool = createPool();

const store: StoreInterface = {
    name: "tienda test",
    managerId: 1,
    apiUrl: "test@test.com",
};

const admin: UserInterface = {
    email: "testadmin1@example.com",
    password: "",
    name: "Test",
    lastName: "Admin",
    idDocumentType: "DNI",
    idDocumentNumber: 11312312,
    rol: "Admin",
};

const manager: UserInterface = {
    email: "testmanager1@example.com",
    password: "test1234",
    name: "Test",
    lastName: "Manager",
    idDocumentType: "DNI",
    idDocumentNumber: 11111111,
    rol: "Manager",
};

beforeAll(async () => {
    try {
        //Create Admin
        admin.password = await bcrypt.hash("test1234", 10);
        const [adminInsert] = await pool.query<ResultSetHeader>("INSERT INTO user SET ?", [admin]);
        admin.id = adminInsert.insertId;
        tokenAdmin = jwt.sign({ ...admin }, process.env.SHOPPY__ACCESS_TOKEN, { expiresIn: "1d" });
        api.authorize(tokenAdmin);

        //Create Manager
        manager.password = await bcrypt.hash("test1234", 10);
        const [managerInsert] = await pool.query<ResultSetHeader>("INSERT INTO user SET ?", [manager]);
        manager.id = managerInsert.insertId;
        tokenManager = jwt.sign({ ...manager }, process.env.SHOPPY__ACCESS_TOKEN, { expiresIn: "1d" });
    } catch (err) {
        console.error(err);
    }
});

afterAll(async () => {
    try {
        await pool.query<ResultSetHeader>("DELETE FROM user WHERE id = ?", [admin.id]);
        await pool.query<ResultSetHeader>("DELETE FROM user WHERE id = ?", [manager.id]);
        await pool.query<ResultSetHeader>("DELETE FROM store WHERE id = ?", [store.id]);
    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
});

/*****************
TESTS
******************/

describe("GET /api/shop/names", () => {
    it("should return all stores names", async () => {
        const response = await api.get<ResponseInterface<StoreInterface[]>>("names");
        expect(response.status).toBe(200);
        expect(response.data.data[0]).toHaveProperty("id");
        expect(response.data.data[0]).toHaveProperty("name");
    });
});

describe("POST /api/shop/", () => {
    it("should create a store", async () => {
        const response = await api.post<ResponseInterface<StoreInterface>>("", null, JSON.stringify(store));
        expect(response.data.message).toBe(undefined);
        expect(response.data.data.name).toBe("tienda test");
        store.id = response.data.data.id;
    });
    afterAll(async () => {
        await pool.query<RowDataPacket[]>("UPDATE store SET managerId = ? WHERE id = ?", [manager.id, store.id]);
    });
});

describe("GET /api/shop/:id", () => {
    it("should return a store", async () => {
        const response = await api.get<ResponseInterface<StoreInterface>>(`${store.id}`);
        expect(response.data.data).toHaveProperty("id");
        expect(response.data.data.name).toBe("tienda test");
        expect(response.status).toBe(200);
    });
});

describe("PUT /api/shop", () => {
    it("should update a store", async () => {
        api.authorize(tokenManager);
        const colors = {
            primary: {
                hue: 137,
                sat: 122,
                light: 122,
            },
            secondary: {
                hue: 137,
                sat: 122,
                light: 122,
            },
        };
        const response = await api.put<ResponseInterface<StoreInterface>>(
            "",
            null,
            JSON.stringify({ name: "tienda test 2", colors, managerId: manager.id, apiUrl: "asdasd.com" })
        );
        expect(response.data.message).toBe(undefined);
        const newStore = await api.get<ResponseInterface<StoreInterface>>(`${store.id}`);
        expect(newStore.data.data.name).toBe("tienda test 2");
    });
});

describe("DELETE /api/shop", () => {
    it("should disable a shop", async () => {
        api.authorize(tokenAdmin);
        const response = await api.delete("", JSON.stringify({ id: store.id }));
        const storeResponse = await api.get<ResponseInterface<StoreInterface>>(`${store.id}`);
        expect(response.status).toBe(200);
        expect(storeResponse.data.data.status).toBe(0);
    });
});
