import { ResultSetHeader, RowDataPacket } from "mysql2";
import { User } from "../models/userModel";
import { createPool } from "mysql2/promise";
import { dbconfig } from "../config/db";

const pool = createPool(dbconfig);

export const getUser = async (id: string | undefined): Promise<User | User[] | undefined> => {
    const connection = await pool.getConnection();
    try {
        if (id) {
            const [rows] = await connection.execute<RowDataPacket[] & User[]>("SELECT id, name, lastName, email, idDocumentType, idDocumentNumber, rol FROM User WHERE id = ?", [
                id,
            ]);
            if (rows.length) {
                const user = rows[0];
                return user;
            }
        } else {
            const [users] = await connection.execute<RowDataPacket[] & User[]>("SELECT id, name, lastName, email, idDocumentType, idDocumentNumber, rol FROM User");
            return users;
        }
    } catch (error) {
        throw new Error("Internal Server Error");
    } finally {
        connection.release();
    }
};

export const createUser = async (user: User): Promise<User> => {
    const connection = await pool.getConnection();
    try {
        const [result] = await connection.execute<ResultSetHeader>(
            "INSERT INTO User (name, lastName, email, password, idDocumentType, idDocumentNumber, rol) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [user.name, user.lastName, user.email, user.password, user.idDocumentType, user.idDocumentNumber, user.rol]
        );
        const newUser: User = {
            id: result.insertId,
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            idDocumentType: user.idDocumentType,
            idDocumentNumber: user.idDocumentNumber,
            rol: user.rol,
        };
        return newUser;
    } catch (error: any) {
        if (error.code === "ER_DUP_ENTRY" && error.sqlMessage.includes("email")) {
            throw new Error("Email already exists");
        } else if (error.code === "ER_DUP_ENTRY" && error.sqlMessage.includes("idDocumentNumber")) {
            throw new Error("ID document number already exists");
        } else {
            throw new Error("Failed to create user");
        }
    } finally {
        connection.release();
    }
};

export const deleteUser = async (id: number) => {
    const connection = await pool.getConnection();
    try {
        const [result] = await connection.execute<ResultSetHeader>("DELETE FROM User WHERE id = ?", [id]);
        return result.affectedRows === 1;
    } catch (error) {
        console.log(error);
        throw new Error("Internal Server Error");
    } finally {
        connection.release();
    }
};

export const updateUser = async (id: string, userData: User) => {
    const connection = await pool.getConnection();
    try {
        const updateUserQuery = "UPDATE User SET ? WHERE id = ?";
        const [result] = await connection.query(updateUserQuery, [userData, id]);
        const resultParsed = JSON.parse(JSON.stringify(result));

        if (resultParsed.affectedRows === 0) {
            return null;
        }

        return getUser(id);
    } catch (error) {
        throw new Error("Failed to update user");
    } finally {
        connection.release();
    }
};