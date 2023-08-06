/* eslint-disable @typescript-eslint/no-explicit-any */
import { userDBSchema, userDBArray } from "../src/models/schemas/user.schema";
import { UserI } from "../src/models/user";
import { ApiClient } from "../src/core/http/api.client";
import bcrypt from "bcrypt";
import mysql, { RowDataPacket, format } from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

/*****************
SETUP
*****************/

const api = new ApiClient("http://localhost:4000/api/users");

interface ResponseI<T> {
    message: string;
    data: T | undefined;
    error: boolean;
}

const user: UserI = {
    email: "test@email.com",
    password: "test12345",
    name: "test",
    lastName: "test",
    idDocumentType: "DNI",
    idDocumentNumber: 12322312,
};

const admin: UserI = {
    email: "testadmin@example.com",
    password: "",
    name: "Test",
    lastName: "Admin",
    idDocumentType: "DNI",
    idDocumentNumber: 12312312,
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

/*****************
TESTS
******************/

describe("Admin", () => {
    it("create admin", async () => {
        await hashPassword();
        const query = format("INSERT INTO user SET ?", [admin]);
        await pool.execute<RowDataPacket[]>(query);
        pool.end();
    });
});

describe("/api/users/signup", () => {
    it("should create an user", async () => {
        const response = await api.post<ResponseI<UserI>>("signup", null, JSON.stringify(user));
        const { error } = userDBSchema.validate(response.data.data);
        expect(response.status).toBe(200);
        expect(error).toBeFalsy();
    });
    it("should fail on duplicate email", async () => {
        const response = await api.post<ResponseI<UserI>>("signup", null, JSON.stringify(user));
        expect(response.status).toBe(500);
        expect(response.data.error).toBe(true);
    });
    it("should fail on duplicate document number", async () => {
        const response = await api.post<ResponseI<UserI>>("signup", null, JSON.stringify({ ...user, email: "test2@email.com" }));
        expect(response.data.error).toBe(true);
    });
});

describe("/login", () => {
    it("should login user", async () => {
        const response = await api.post<ResponseI<UserI>>("login", null, JSON.stringify({ email: user.email, password: user.password }));
        const token = response.headers.get("x-auth");
        api.authorize(token);
        const { error } = userDBSchema.validate(response.data.data);
        expect(response.status).toBe(200);
        expect(error).toBeFalsy();
        user.id = response.data.data.id;
    });
    it("should fail on password", async () => {
        const response = await api.post<ResponseI<UserI>>("login", null, JSON.stringify({ email: user.email, password: "incorrectPW" }));
        expect(response.data.error).toBe(true);
        expect(response.data.message).toMatch(/Incorrect username or password/);
    });
    it("should fail on email", async () => {
        const response = await api.post<ResponseI<UserI>>("login", null, JSON.stringify({ email: "user@example", password: user.password }));
        expect(response.data.error).toBe(true);
    });
});

describe("/:id", () => {
    it("should get an user", async () => {
        const response = await api.get<ResponseI<UserI>>(`${user.id}`, null);
        const { error } = userDBSchema.validate(response.data.data);
        expect(response.data.message).toBe(undefined);
        expect(response.status).toBe(200);
        expect(error).toBeFalsy();
        expect(response.data.data.email).toBe(user.email);
    });
    it("should not find an user", async () => {
        const response = await api.get<ResponseI<UserI>>("-3", null);
        expect(response.status).toBe(500);
        expect(response.data.message).toMatch(/Unable to retrieve the entity./);
    });
});

describe("/update", () => {
    it("should change name", async () => {
        const response = await api.put<ResponseI<UserI>>("update", null, JSON.stringify({ ...user, name: "testdos" }));
        const { error } = userDBSchema.validate(response.data.data);
        expect(response.data.message).toBe(undefined);
        expect(response.status).toBe(200);
        expect(error).toBeFalsy();
        user.name = response.data.data.name;
    });
});

describe("/disable", () => {
    it("should disable user", async () => {
        // const response = await api.delete("disable", null)
        const response = await api.delete<ResponseI<UserI>>("disable", JSON.stringify(user));
        expect(response.data.message).toBe(undefined);
        const { error } = userDBSchema.validate(response.data.data);
        expect(error).toBeFalsy();
        expect(response.status).toBe(200);
    });
    it("should not be authorized to disable another user", async () => {
        const response = await api.delete<ResponseI<UserI>>("disable", JSON.stringify({ ...user, email: "another2@user.com" }));
        expect(response.data.message).toMatch(/Unauthorized/);
        expect(response.data.error).toBe(true);
        expect(response.status).toBe(500);
    });
});

describe("/admin/delete", () => {
    it("should not be authorized to access this route", async () => {
        const response = await api.delete<ResponseI<UserI>>("admin/delete", JSON.stringify({ id: admin.id }));
        expect(response.data.message).toMatch(/Unauthorized/);
        expect(response.data.error).toBeTruthy();
    });
});

describe("/login", () => {
    it("should login admin", async () => {
        const response = await api.post<ResponseI<UserI>>("login", null, JSON.stringify({ email: admin.email, password: "test1234" }));
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

describe("/", () => {
    it("should get all users", async () => {
        const response = await api.get<ResponseI<UserI[]>>("");
        expect(response.data.message).toBe(undefined);
        const { error } = userDBArray.validate(response.data.data);
        expect(error).toBeFalsy;
        expect(response.status).toBe(200);
    });
});

describe("/admin/restore", () => {
    it("should restore an user", async () => {
        const response = await api.put<ResponseI<UserI>>("admin/restore", null, JSON.stringify({ id: user.id, email: user.email }));
        expect(response.data.message).toBe(undefined);
        expect(response.status).toBe(200);
    });
});

describe("/admin/disable", () => {
    it("should disable an user", async () => {
        const response = await api.delete<ResponseI<UserI>>("admin/disable", JSON.stringify({ id: user.id, email: user.email, password: "test1234" }));
        expect(response.data.message).toBe(undefined);
        expect(response.status).toBe(200);
    });
});

describe("/admin/delete", () => {
    it("should delete user", async () => {
        const response = await api.delete<ResponseI<UserI>>("admin/delete", JSON.stringify({ id: user.id, email: user.email, password: "test1234" }));
        expect(response.data.message).toBe(undefined);
        expect(response.status).toBe(200);
    });
    it("should auto delete", async () => {
        const response = await api.delete<ResponseI<UserI>>("admin/delete", JSON.stringify({ id: admin.id, password: "test1234", email: admin.email }));
        expect(response.data.message).toBe(undefined);
        expect(response.status).toBe(200);
    });
});
