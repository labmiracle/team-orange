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
//
describe("Admin", () => {
    it("create admin", async () => {
        await hashPassword();
        const query = format("INSERT INTO user SET ?", [admin]);
        const [rows] = await pool.execute<RowDataPacket[]>(query);
        //expect(typeof rows[0].insertId).toBe("number");
        pool.end();
    });
});

// --detectOpenHandles

describe("/api/users/signup", () => {
    it("should create an user", async () => {
        const response = await fetch(base_url + "/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
        });
        //expect(response.status).toBe(201);

        const responseObj = await response.json();
        const { error, value } = userDBSchema.validate(responseObj.data);
        expect(error).toBe(undefined);
        expect(responseObj.message).toMatch(/User created/);
    });
    it("should fail on duplicate email", async () => {
        const response = await fetch(base_url + "/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...user, idDocumentNumber: 12312313 }),
        });
        expect(response.status).toBe(500);
        const responseObj = await response.json();
        expect(responseObj.error).toBe(true);
        expect(responseObj.message).toMatch(/Email already exists/);
    });
    it("should fail on duplicate document number", async () => {
        const response = await fetch(base_url + "/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...user, email: "test2@email.com" }),
        });
        expect(response.status).toBe(500);
        const responseObj = await response.json();
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
        expect(responseObj.error).toBe(false);
        expect(responseObj.message).toMatch(/Login successful/);
        user.id = responseObj.data.id;
    });
});

describe("/:id", () => {
    it("should get an user", async () => {
        const response = await fetch(base_url + `/${user.id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json", "x-auth": token },
        });
        const responseObj = await response.json();
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
        expect(responseObj.data.name).toBe("testdos");
        user.name = responseObj.data.name;
    });
});

describe("/disable", () => {
    it("should disable user", async () => {
        await fetch(base_url + "/disable", {
            method: "DELETE",
            headers: { "Content-Type": "application/json", "x-auth": token },
            body: JSON.stringify(user),
        });
        const response = await fetch(base_url + `/${user.id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json", "x-auth": token },
        });
        const responseObj = await response.json();
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
        //expect(response.status).toBe(200);
        token = response.headers.get("x-auth");
        const responseObj = await response.json();
        expect(responseObj.error).toBe(false);
        expect(responseObj.message).toMatch(/Login successful/);
        admin.id = responseObj.data.id;
    });
});

describe("/delete", () => {
    it("should delete user", async () => {
        const response = await fetch(base_url + "/admin/delete", {
            method: "DELETE",
            headers: { "Content-Type": "application/json", "x-auth": token },
            body: JSON.stringify({ id: user.id }),
        });
        const responseObj = await response.json();
        expect(responseObj.message).toMatch(/User deleted/);
    });
});

describe("/delete", () => {
    it("should auto delete", async () => {
        const response = await fetch(base_url + "/admin/delete", {
            method: "DELETE",
            headers: { "Content-Type": "application/json", "x-auth": token },
            body: JSON.stringify({ id: admin.id }),
        });
        const responseObj = await response.json();
        expect(responseObj.message).toMatch(/User deleted/);
    });
});
