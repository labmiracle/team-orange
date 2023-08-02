/* eslint-disable @typescript-eslint/no-explicit-any */
import { userDBSchema, userSchema } from "../src/models/schemas/user.schema";
import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";
import mysql, { RowDataPacket, format } from "mysql2/promise";
import { UserI } from "../src/models/user";

const base_url = "http://localhost:4000/api/users";

/* type User = {
    id?: number;
    email: string;
    password: string;
    name: string;
    lastName: string;
    idDocumentType: string;
    idDocumentNumber: number;
    rol?: string;
}; */

const user: UserI = {
    email: "test@email.com",
    password: "test12345",
    name: "test",
    lastName: "test",
    idDocumentType: "DNI",
    idDocumentNumber: 12322312,
};
let token: string;

//const adminHashedPassword = hashPassword();

//const adminHashedPassword = await bcrypt.hash("test1234", 10);
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

describe("Admin", () => {
    it("create admin", async () => {
        await hashPassword();
        const query = format("INSERT INTO user SET ?", [admin]);
        const [rows] = await pool.execute<RowDataPacket[]>(query);
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

        const responseObj = await response.json();
        expect(response.status).toBe(201);
        expect(responseObj.error).toBe(false);
        expect(responseObj.message).toMatch(/User created/);
    });
    it("should fail on duplicate email", async () => {
        const response = await fetch(base_url + "/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...user, idDocumentNumber: 12312313 }),
        });
        const responseObj = await response.json();
        expect(response.status).toBe(500);
        expect(responseObj.error).toBe(true);
        expect(responseObj.message).toMatch(/Email already exists/);
    });
    it("should fail on duplicate document number", async () => {
        const response = await fetch(base_url + "/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...user, email: "test2@email.com" }),
        });
        const responseObj = await response.json();
        expect(response.status).toBe(500);
        expect(responseObj.error).toBe(true);
        expect(responseObj.message).toMatch(/ID document number already exists/);
    });
});

describe("/login", () => {
    it("should login user", async () => {
        const response = await fetch(base_url + "/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: user.email, password: user.password }),
        });
        //expect(response.status).toBe(200);
        token = response.headers.get("x-auth");
        const responseObj = await response.json();
        expect(response.status).toBe(200);
        expect(responseObj.error).toBe(false);
        expect(responseObj.message).toMatch(/Login successful/);
        user.id = responseObj.data.id;
    });
    it("should fail on password", async () => {
        const response = await fetch(base_url + "/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: user.email, password: "incorrectPW" }),
        });
        const responseObj = await response.json();
        expect(response.status).toBe(401);
        expect(responseObj.error).toBe(true);
        expect(responseObj.message).toMatch(/Incorrect username or password/);
    });
    it("should fail on email", async () => {
        const response = await fetch(base_url + "/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "user@example", password: user.password }),
        });
        const responseObj = await response.json();
        expect(response.status).toBe(400);
        expect(responseObj.error).toBe(true);
        expect(responseObj.message).toMatch(/Invalid email format/);
    });
});

describe("/:id", () => {
    it("should get an user", async () => {
        const response = await fetch(base_url + `/${user.id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json", "x-auth": token },
        });
        const responseObj = await response.json();
        expect(response.status).toBe(200);
        expect(responseObj.error).toBe(false);
        expect(responseObj.data.email).toBe(user.email);
    });
});

describe("/update", () => {
    it("should change name", async () => {
        const response = await fetch(base_url + "/update", {
            method: "PUT",
            headers: { "Content-Type": "application/json", "x-auth": token },
            body: JSON.stringify({ ...user, name: "testdos" }),
        });
        const responseObj = await response.json();
        expect(response.status).toBe(201);
        expect(responseObj.error).toBe(false);
        expect(responseObj.data.name).toBe("testdos");
        user.name = responseObj.data.name;
    });
});

describe("/disable", () => {
    it("should disable user", async () => {
        const response = await fetch(base_url + "/disable", {
            method: "DELETE",
            headers: { "Content-Type": "application/json", "x-auth": token },
            body: JSON.stringify(user),
        });
        const responseObj = await response.json();
        expect(response.status).toBe(200);
        expect(responseObj.error).toBe(false);
        expect(responseObj.message).toBe("User deleted");
        expect(responseObj.data.status).toBe(0);
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
        const responseObj = await response.json();
        expect(response.status).toBe(200);
        expect(responseObj.error).toBe(false);
        expect(responseObj.message).toMatch(/Login successful/);
        expect(responseObj.data.rol).toBe("Admin");
        admin.id = responseObj.data.id;
    });
});

describe("/", () => {
    it("should get all users", async () => {
        const response = await fetch(base_url, {
            method: "GET",
            headers: { "Content-Type": "application/json", "x-auth": token },
        });
        const responseObj = await response.json();
        expect(response.status).toBe(200);
        expect(responseObj.message).toMatch(/Users found/);
        expect(responseObj.error).toBe(false);
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
        expect(responseObj.error).toBe(false);
        expect(responseObj.message).toMatch(/User restored/);
        expect(responseObj.data.status).toBe(1);
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
        expect(responseObj.error).toBe(false);
        expect(responseObj.message).toMatch(/User disabled/);
        expect(responseObj.data.status).toBe(0);
    });
});

describe("/admin/delete", () => {
    it("should delete user", async () => {
        const response = await fetch(base_url + "/admin/delete", {
            method: "DELETE",
            headers: { "Content-Type": "application/json", "x-auth": token },
            body: JSON.stringify({ id: user.id }),
        });
        const responseObj = await response.json();
        expect(response.status).toBe(200);
        expect(responseObj.error).toBe(false);
        expect(responseObj.message).toMatch(/User deleted/);
    });
    it("should auto delete", async () => {
        const response = await fetch(base_url + "/admin/delete", {
            method: "DELETE",
            headers: { "Content-Type": "application/json", "x-auth": token },
            body: JSON.stringify({ id: admin.id, password: "test1234" }),
        });
        const responseObj = await response.json();
        expect(response.status).toBe(200);
        expect(responseObj.error).toBe(false);
        expect(responseObj.message).toMatch(/User deleted/);
    });
});
