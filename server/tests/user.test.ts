/* eslint-disable @typescript-eslint/no-explicit-any */
import { userDBSchema, userDBArray } from "../src/models/schemas/user.schema";
import { ResponseInterface } from "../src/models/response";
import { UserInterface } from "../src/models/user";
import { StoreInterface } from "../src/models/store";
import { ApiClient } from "../src/core/http/api.client";
import { createPool } from "./db.setup";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

/*****************
SETUP
*****************/

let storeId: number;

const api = new ApiClient(process.env.BASE_URL + "/api/users");
const pool = createPool();

const user: UserInterface = {
    email: "testuser@email.com",
    password: "test12345",
    name: "test",
    lastName: "test",
    idDocumentType: "DNI",
    idDocumentNumber: 12322312,
};

const admin: UserInterface = {
    email: "testadminuser@example.com",
    password: "",
    name: "Test",
    lastName: "Admin",
    idDocumentType: "DNI",
    idDocumentNumber: 12312312,
    rol: "Admin",
};

beforeAll(async () => {
    try {
        //Create admin
        admin.password = await bcrypt.hash("test1234", 10);
        await pool.query<RowDataPacket[]>("INSERT INTO user SET ?", [admin]);
        //CREATE store
        const [store] = await pool.query<ResultSetHeader>("INSERT INTO store SET name='testUserStore', managerId = ?, apiUrl = 'test.com'", [admin.id]);
        storeId = store.insertId;
    } catch (err) {
        console.error(err);
    }
});

afterAll(async () => {
    try {
        await pool.query<ResultSetHeader>("DELETE FROM store WHERE id = ?", [storeId]);
    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
});

/*****************
TESTS
******************/

describe("POST /api/users/signup", () => {
    it("should create an user", async () => {
        const response = await api.post<ResponseInterface<UserInterface>>("signup", null, JSON.stringify(user));
        expect(response.data.message).toBe(undefined);
        const { error } = userDBSchema.validate(response.data.data);
        expect(error).toBeFalsy();
    });
    it("should fail on duplicate email", async () => {
        const response = await api.post<ResponseInterface<UserInterface>>("signup", null, JSON.stringify(user));
        expect(response.status).toBe(500);
        expect(response.data.error).toBe(true);
    });
    it("should fail on duplicate document number", async () => {
        const response = await api.post<ResponseInterface<UserInterface>>("signup", null, JSON.stringify({ ...user, email: "test2@email.com" }));
        expect(response.data.error).toBe(true);
    });
});

describe("POST /login", () => {
    it("should login user", async () => {
        const response = await api.post<ResponseInterface<UserInterface>>("login", null, JSON.stringify({ email: user.email, password: user.password }));
        expect(response.data.message).toBe(undefined);
        const token = response.headers.get("x-auth");
        api.authorize(token);
        const { error } = userDBSchema.validate(response.data.data);
        expect(response.status).toBe(200);
        expect(error).toBeFalsy();
        user.id = response.data.data.id;
    });
    it("should fail on password", async () => {
        const response = await api.post<ResponseInterface<UserInterface>>("login", null, JSON.stringify({ email: user.email, password: "incorrectPW" }));
        expect(response.data.error).toBe(true);
        expect(response.data.message).toMatch(/Incorrect username or password/);
    });
    it("should fail on email", async () => {
        const response = await api.post<ResponseInterface<UserInterface>>("login", null, JSON.stringify({ email: "user@example", password: user.password }));
        expect(response.data.error).toBe(true);
    });
});

describe("GET /:id", () => {
    it("should get an user", async () => {
        const response = await api.get<ResponseInterface<UserInterface>>(`${user.id}`, null);
        const { error } = userDBSchema.validate(response.data.data);
        expect(response.data.message).toBe(undefined);
        expect(response.status).toBe(200);
        expect(error).toBeFalsy();
        expect(response.data.data.email).toBe(user.email);
    });
    it("should not find an user", async () => {
        const response = await api.get<ResponseInterface<UserInterface>>("-3", null);
        expect(response.status).toBe(500);
        expect(response.data.message).toMatch(/Unable to retrieve the entity./);
    });
});

describe("PUT /update", () => {
    it("should change name", async () => {
        const response = await api.put<ResponseInterface<UserInterface>>("update", null, JSON.stringify({ ...user, name: "testdos" }));
        const { error } = userDBSchema.validate(response.data.data);
        expect(response.data.message).toBe(undefined);
        expect(response.status).toBe(200);
        expect(error).toBeFalsy();
        user.name = response.data.data.name;
    });
});

describe("DELETE /disable", () => {
    it("user should be able to disable itself", async () => {
        // const response = await api.delete("disable", null)
        const response = await api.delete<ResponseInterface<UserInterface>>("disable", JSON.stringify(user));
        expect(response.data.message).toBe(undefined);
        const { error } = userDBSchema.validate(response.data.data);
        expect(error).toBeFalsy();
        expect(response.status).toBe(200);
    });
    it("should not be authorized to disable another user", async () => {
        const response = await api.delete<ResponseInterface<UserInterface>>("disable", JSON.stringify({ ...user, email: "another2@user.com" }));
        expect(response.data.message).toMatch(/Unauthorized/);
        expect(response.data.error).toBe(true);
        expect(response.status).toBe(500);
    });
});

describe("DELETE /admin/delete", () => {
    it("should not be authorized to access this route", async () => {
        const response = await api.delete<ResponseInterface<UserInterface>>("admin/delete", JSON.stringify({ id: admin.id }));
        expect(response.data.message).toMatch(/Unauthorized/);
        expect(response.data.error).toBeTruthy();
    });
});

describe("POST /login", () => {
    it("should login admin", async () => {
        const response = await api.post<ResponseInterface<UserInterface>>("login", null, JSON.stringify({ email: admin.email, password: "test1234" }));
        expect(response.data.message).toBe(undefined);
        const token = response.headers.get("x-auth");
        api.authorize(token);
        const { error } = userDBSchema.validate(response.data.data);
        expect(error).toBeFalsy();
        expect(response.status).toBe(200);
        expect(response.data.data.rol).toBe("Admin");
        admin.id = response.data.data.id;
    });
});

describe("GET /", () => {
    it("should get all users", async () => {
        const response = await api.get<ResponseInterface<UserInterface[]>>("");
        expect(response.data.message).toBe(undefined);
        const { error } = userDBArray.validate(response.data.data);
        expect(error).toBeFalsy;
        expect(response.status).toBe(200);
    });
});

describe("PUT /admin/restore", () => {
    it("should restore an user", async () => {
        const response = await api.put<ResponseInterface<UserInterface>>("admin/restore", null, JSON.stringify({ id: user.id, email: user.email }));
        expect(response.data.message).toBe(undefined);
        expect(response.status).toBe(200);
    });
});

describe("PUT /admin/change_role", () => {
    it("should change user role from client to manager", async () => {
        const response = await api.put<ResponseInterface<UserInterface>>("admin/change_role", null, JSON.stringify({ email: user.email, idStore: storeId }));
        expect(response.data.message).toBe(undefined);
        expect(response.data.data.rol).toBe("Manager");
        const [store] = (await pool.query<RowDataPacket[]>("SELECT * FROM store WHERE managerId = ?", [user.id]))[0] as StoreInterface[];
        expect(store.name).toBe("testUserStore");
    });
});

describe("DELETE /admin/disable", () => {
    it("should disable an user", async () => {
        const response = await api.delete<ResponseInterface<UserInterface>>(
            "admin/disable",
            JSON.stringify({ id: user.id, email: user.email, password: "test1234" })
        );
        expect(response.data.message).toBe(undefined);
        expect(response.status).toBe(200);
    });
});

describe("DELETE /admin/delete", () => {
    it("should delete user", async () => {
        const response = await api.delete<ResponseInterface<UserInterface>>(
            "admin/delete",
            JSON.stringify({ id: user.id, email: user.email, password: "test1234" })
        );
        expect(response.data.message).toBe(undefined);
        expect(response.status).toBe(200);
    });
    it("should auto delete", async () => {
        const response = await api.delete<ResponseInterface<UserInterface>>(
            "admin/delete",
            JSON.stringify({ id: admin.id, password: "test1234", email: admin.email })
        );
        expect(response.data.message).toBe(undefined);
        expect(response.status).toBe(200);
    });
});
