import bcrypt from "bcrypt";
import { User } from "../models/userModel";
import { getUser, getUsers, createUser, deleteUser, updateUser } from "../repositories/userRepository";

export const getUserService = async (id: string | undefined): Promise<User | undefined> => {
    const user = await getUser(id);
    if (user) {
        return user;
    } else {
        throw new Error("User not found");
    }
};

export const getUsersService = async (): Promise<User[]> => {
    return await getUsers();
};

export const createUserService = async (user: User): Promise<User> => {
    if (user.password) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;
    }
    return await createUser(user);
};

export const deleteUserService = async (id: number) => {
    //agregar baja lógica
    return deleteUser(id);
};

export const updateUserService = async (id: string, userData: User) => {
    const userUpdated = await updateUser(id, userData);
    if (userUpdated === "No change was made") {
        return undefined;
    } else {
        return userUpdated;
    }
};
