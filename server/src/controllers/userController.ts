import { Request, Response } from "express";
import { pool } from "../db";
import bcrypt from "bcrypt";

const handleUnknownError = (res: Response, error: unknown) => {
    if (error instanceof Error) {
        return res.status(500).json({
            message: error.message,
            data: undefined,
            error: true,
        });
    }
    res.status(500).json({
        message: "An unknown error occurred",
        data: undefined,
        error: true,
    });
};

const getUsers = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (id) {
            const [result] = await pool.query(`SELECT * FROM User WHERE id = ?`, [id]);
            const user = JSON.parse(JSON.stringify(result));
            if (Array.isArray(result) && result.length) {
                return res.status(200).json({
                    message: "User found",
                    data: user,
                    error: false,
                });
            } else {
                return res.status(404).json({
                    message: "User not found",
                    data: undefined,
                    error: true,
                });
            }
        }
        const [users] = await pool.query(`SELECT * FROM User`);
        return res.status(200).json({
            message: "Users found",
            data: users,
            error: false,
        });
    } catch (error: unknown) {
        handleUnknownError(res, error);
    }
};

const createUser = async (req: Request, res: Response) => {
    try {
        const { name, lastName, email, idDocumentType, idDocumentNumber, rol } = req.body;
        let { password } = req.body;
        password = await bcrypt.hash(password, 10);
        const [result] = await pool.query(`INSERT INTO User (name, lastName, email, password, idDocumentType, idDocumentNumber, rol) VALUES (?, ?, ?, ?, ?, ?, ?)`, [
            name,
            lastName,
            email,
            password,
            idDocumentType,
            idDocumentNumber,
            rol,
        ]);
        password = undefined;
        const newUser = JSON.parse(JSON.stringify(result));
        return res.status(201).json({
            message: "User created",
            data: { id: newUser.insertId, name, lastName, email, idDocumentType, idDocumentNumber, rol },
            error: false,
        });
    } catch (error: unknown) {
        handleUnknownError(res, error);
    }
};

const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, lastName, email, password, idDocumentType, idDocumentNumber, rol } = req.body;
        const [result] = await pool.query(
            "UPDATE User SET name = IFNULL(?, name), lastName = IFNULL(?, lastName), email = IFNULL(?, email), password = IFNULL(?, password), idDocumentType = IFNULL(?, idDocumentType), idDocumentNumber = IFNULL(?, idDocumentNumber), rol = IFNULL(?, rol) WHERE id = ?",
            [name, lastName, email, password, idDocumentType, idDocumentNumber, rol, id]
        );
        const resultParsed = JSON.parse(JSON.stringify(result));
        if (resultParsed.affectedRows === 0) {
            return res.status(404).json({
                message: "User not found",
                data: undefined,
                error: true,
            });
        }
        const [user] = await pool.query("SELECT * FROM User WHERE id = ?", [id]);
        return res.json({
            message: "User updated",
            data: user,
            error: false,
        });
    } catch (error: unknown) {
        handleUnknownError(res, error);
    }
};

const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (id) {
            const [result] = await pool.query(`DELETE FROM User WHERE id = ?`, [id]);
            const userDeleted = JSON.parse(JSON.stringify(result));
            if (userDeleted.affectedRows === 0) {
                return res.status(404).json({
                    message: "User not found",
                    data: undefined,
                    error: true,
                });
            }
            return res.status(200).json({
                message: `User with id ${id} was deleted`,
                data: undefined,
                error: false,
            });
        }
    } catch (error: unknown) {
        handleUnknownError(res, error);
    }
};

export default {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
};
