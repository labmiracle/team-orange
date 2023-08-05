/* eslint-disable @typescript-eslint/no-explicit-any */
import { userDBSchema } from "../src/models/schemas/user.schema";
import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";
import mysql, { RowDataPacket, format } from "mysql2/promise";
import { UserI } from "../src/models/user";

const base_url = "http://localhost:4000/api/users";

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

let token: string;

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
        const response = await fetch(base_url + "/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
        });
        const userR = await response.json();
        expect(response.status).toBe(200);
        const { error } = userDBSchema.validate(userR);
        expect(error).toBeFalsy();
    });
    it("should fail on duplicate email", async () => {
        const response = await fetch(base_url + "/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...user, idDocumentNumber: 12312313 }),
        });
        const responseObj = await response.json();
        expect(responseObj.error).toBe(true);
    });
    it("should fail on duplicate document number", async () => {
        const response = await fetch(base_url + "/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...user, email: "test2@email.com" }),
        });
        const responseObj = await response.json();
        expect(responseObj.error).toBe(true);
    });
});

describe("/login", () => {
    it("should login user", async () => {
        const response = await fetch(base_url + "/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: user.email, password: user.password }),
        });
        token = response.headers.get("x-auth");
        const userR = await response.json();
        expect(response.status).toBe(200);
        const { error } = userDBSchema.validate(userR);
        expect(error).toBeFalsy();
        user.id = userR.id;
    });
    it("should fail on password", async () => {
        const response = await fetch(base_url + "/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: user.email, password: "incorrectPW" }),
        });
        const userR = await response.json();
        expect(userR.error).toBe(true);
        expect(userR.message).toMatch(/Incorrect username or password/);
    });
    it("should fail on email", async () => {
        const response = await fetch(base_url + "/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "user@example", password: user.password }),
        });
        const responseObj = await response.json();
        expect(responseObj.error).toBe(true);
    });
});

describe("/:id", () => {
    it("should get an user", async () => {
        const response = await fetch(base_url + `/${user.id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json", "x-auth": token },
        });
        const userR = await response.json();
        expect(response.status).toBe(200);
        const { error } = userDBSchema.validate(userR);
        expect(error).toBeFalsy();
        expect(userR.email).toBe(user.email);
    });
});

describe("/update", () => {
    it("should change name", async () => {
        const response = await fetch(base_url + "/update", {
            method: "PUT",
            headers: { "Content-Type": "application/json", "x-auth": token },
            body: JSON.stringify({ ...user, name: "testdos" }),
        });
        const userR = await response.json();
        console.log(userR.message);
        expect(response.status).toBe(200);
        const { error } = userDBSchema.validate(userR);
        expect(error).toBeFalsy();
        user.name = userR.name;
    });
});

describe("/disable", () => {
    it("should disable user", async () => {
        const response = await fetch(base_url + "/disable", {
            method: "DELETE",
            headers: { "Content-Type": "application/json", "x-auth": token },
            body: JSON.stringify(user),
        });
        const userR = await response.json();
        const { error } = userDBSchema.validate(userR);
        expect(error).toBeFalsy();
        expect(response.status).toBe(200);
        expect(userR.status).toBe(0);
    });
});

describe("/login", () => {
    it("should login admin", async () => {
        const response = await fetch(base_url + "/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: admin.email, password: "test1234" }),
        });
        token = response.headers.get("x-auth");
        const userR = await response.json();
        const { error } = userDBSchema.validate(userR);
        expect(error).toBeFalsy();
        expect(response.status).toBe(200);
        expect(userR.rol).toBe("Admin");
        admin.id = userR.id;
    });
});

describe("/", () => {
    it("should get all users", async () => {
        const response = await fetch(base_url, {
            method: "GET",
            headers: { "Content-Type": "application/json", "x-auth": token },
        });
        expect(response.status).toBe(200);
    });
});

describe("/admin/restore", () => {
    it("should restore an user", async () => {
        const response = await fetch(base_url + "/admin/restore", {
            method: "PUT",
            headers: { "Content-Type": "application/json", "x-auth": token },
            body: JSON.stringify({ id: user.id }),
        });
        const responseObj = await response.json();
        expect(response.status).toBe(200);
        expect(responseObj.status).toBe(1);
    });
});

describe("/admin/disable", () => {
    it("should disable an user", async () => {
        const response = await fetch(base_url + "/admin/disable", {
            method: "DELETE",
            headers: { "Content-Type": "application/json", "x-auth": token },
            body: JSON.stringify({ id: user.id }),
        });
        const responseObj = await response.json();
        expect(response.status).toBe(200);
        expect(responseObj.status).toBe(0);
    });
});

describe("/admin/delete", () => {
    it("should delete user", async () => {
        const response = await fetch(base_url + "/admin/delete", {
            method: "DELETE",
            headers: { "Content-Type": "application/json", "x-auth": token },
            body: JSON.stringify({ id: user.id }),
        });
        expect(response.status).toBe(200);
    });
    it("should auto delete", async () => {
        const response = await fetch(base_url + "/admin/delete", {
            method: "DELETE",
            headers: { "Content-Type": "application/json", "x-auth": token },
            body: JSON.stringify({ id: admin.id, password: "test1234" }),
        });
        expect(response.status).toBe(200);
    });
});
