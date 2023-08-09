import { ApiClient } from "../src/core/http/api.client";
import { ResponseInterface } from "../src/models/response";
import { StoreInterface } from "../src/models/store";
import bcrypt from "bcrypt";
import mysql, { ResultSetHeader, RowDataPacket, format } from "mysql2/promise";
import { UserInterface } from "../src/models/user";
import dotenv from "dotenv";
dotenv.config();

/*****************
SETUP
*****************/

const apiUser = new ApiClient(process.env.BASE_URL + "/api/users");
const api = new ApiClient(process.env.BASE_URL + "/api/shop");

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

const hashPassword = async () => {
    admin.password = await bcrypt.hash("test1234", 10);
};

const pool = mysql.createPool({
    host: process.env.SHOPPY__MYSQLHOST,
    port: Number(process.env.SHOPPY__MYSQLPORT),
    database: process.env.SHOPPY__MYSQLDATABASE,
    user: process.env.SHOPPY__MYSQLUSER,
    decimalNumbers: true,
    password: process.env.SHOPPY__MYSQLPASSWORD,
});

describe("Setup for store tests", () => {
    it("create admin", async () => {
        await hashPassword();
        const query = format("INSERT INTO user SET ?", [admin]);
        const [response] = await pool.execute<ResultSetHeader>(query);
        store.managerId = response.insertId;
    });
    it("login admin", async () => {
        const response = await apiUser.post<ResponseInterface<UserInterface>>("login", null, JSON.stringify({ email: admin.email, password: "test1234" }));
        expect(response.data.message).toBe(undefined);
        const token = response.headers.get("x-auth");
        api.authorize(token);
        apiUser.authorize(token);
    });
});

/*****************
TESTS
******************/

describe("/api/shop/names", () => {
    it("should return all stores names", async () => {
        const response = await api.get<ResponseInterface<StoreInterface[]>>("names");
        expect(response.status).toBe(200);
        expect(response.data.data[0]).toHaveProperty("id");
        expect(response.data.data[0]).toHaveProperty("name");
    });
});

describe("/api/shop/", () => {
    it("should create a store", async () => {
        const response = await api.post<ResponseInterface<StoreInterface>>("", null, JSON.stringify(store));
        expect(response.data.message).toBe(undefined);
        expect(response.data.data.name).toBe("tienda test");
        store.id = response.data.data.id;
    });
});

describe("/api/shop/:id", () => {
    it("should return a store", async () => {
        const response = await api.get<ResponseInterface<StoreInterface>>(`${store.id}`);
        expect(response.data.data).toHaveProperty("id");
        expect(response.data.data.name).toBe("tienda test");
        expect(response.status).toBe(200);
    });
});

describe("DELETE /api/shop", () => {
    it("should disable a shop", async () => {
        const response = await api.delete("", JSON.stringify({ id: store.id }));
        const storeResponse = await api.get<ResponseInterface<StoreInterface>>(`${store.id}`);
        expect(response.status).toBe(200);
        expect(storeResponse.data.data.status).toBe(0);
    });
});

/*****************
DELETE ADMIN
*****************/

describe("/admin/delete", () => {
    it("should auto delete", async () => {
        const response = await apiUser.delete<ResponseInterface<UserInterface>>(
            "admin/delete",
            JSON.stringify({ id: admin.id, password: "test1234", email: admin.email })
        );
        expect(response.data.message).toBe(undefined);
        expect(response.status).toBe(200);
    });
});

describe("delete store", () => {
    it("should delete store", async () => {
        const query = format("DELETE FROM store WHERE id= ?", [store.id]);
        await pool.execute<ResultSetHeader>(query);
        pool.end();
    });
});
