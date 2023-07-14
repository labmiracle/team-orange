import { Request, Response } from "express";
import { getUserService, createUserService, deleteUserService, updateUserService, getUsersService } from "../services/userService";
import { User } from "../models/userModel";

const getUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (isNaN(Number(id))) {
            return res.status(400).json({
                message: "ID must be a numeric value.",
                data: undefined,
                error: true,
            });
        }
        const user = await getUserService(id);
        return res.status(200).json({
            message: "User found",
            data: user,
            error: true,
        });
    } catch (error: any) {
        if (error.message === "User not found") {
            return res.status(404).json({
                message: error.message,
                data: undefined,
                error: true,
            });
        }
        return res.status(500).json({
            message: error.message,
            data: undefined,
            error: true,
        });
    }
};

const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await getUsersService();
        if (users.length > 0) {
            res.status(200).json({
                message: "Users found",
                data: users,
                error: false,
            });
        }
        res.status(200).json({
            message: "No users found",
            data: users,
            error: false,
        });
    } catch (error: any) {
        return res.status(500).json({
            message: "Internal server error",
            data: undefined,
            error: true,
        });
    }
};

const createUser = async (req: Request, res: Response) => {
    try {
        const { name, lastName, email, password, idDocumentType, idDocumentNumber, rol } = req.body;
        const user: User = {
            name,
            lastName,
            email,
            password,
            idDocumentType,
            idDocumentNumber,
            rol,
        };
        const createdUser = await createUserService(user);
        return res.status(201).json({
            message: "User created",
            data: createdUser,
            error: false,
        });
    } catch (error: any) {
        if (error.message === "Email already exists" || error.message === "ID document number already exists") {
            return res.status(409).json({
                message: error.message,
                data: undefined,
                error: true,
            });
        }
        return res.status(500).json({
            error: "Internal server error",
        });
    }
};

const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userData: User = req.body;
        if (id && userData) {
            const userUpdated = await updateUserService(id, userData);
            console.log(userUpdated);
            if (userUpdated === null) {
                return res.status(204).json({
                    message: "No change was made",
                    data: undefined,
                    error: false,
                });
            } else if (userUpdated) {
                return res.status(200).json({
                    message: "User updated",
                    data: userUpdated,
                    error: false,
                });
            }
        } else {
            return res.status(400).json({
                message: "Invalid request",
                data: undefined,
                error: true,
            });
        }
    } catch (error: any) {
        if (error.message === "User not found") {
            return res.status(404).json({
                message: "User not found",
                data: undefined,
                error: true,
            });
        } else {
            return res.status(500).json({
                message: "Internal server error",
                data: undefined,
                error: true,
            });
        }
    }
};

const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (isNaN(Number(id))) {
            return res.status(400).json({
                message: "ID must be a numeric value.",
                data: undefined,
                error: true,
            });
        }
        const userDeleted = await deleteUserService(Number(id));
        if (userDeleted) {
            return res.status(200).json({
                message: "User deleted seccessfully",
                data: undefined,
                error: false,
            });
        } else {
            return res.status(404).json({
                message: "User not found",
                data: undefined,
                error: true,
            });
        }
    } catch (error: any) {
        return res.status(500).json({
            message: "Internal server error",
            data: undefined,
            error: true,
        });
    }
};

export default {
    getUser,
    getUsers,
    createUser,
    updateUser,
    deleteUser,
};
