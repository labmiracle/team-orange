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
    const existingUser = await getUser(id);
    if (!existingUser) {
        throw new Error("User not found");
    }

    const hasChanges = (userData: User, existingUser: User | User[]) => {
        if (Array.isArray(existingUser)) {
            return false;
        }
        return Object.keys(userData).some(key => {
            return userData[key as keyof User] !== existingUser[key as keyof User];
        });
    };

    if (hasChanges(userData, existingUser)) {
        const updatedUser = { ...existingUser, ...userData };
        const result = await updateUser(id, updatedUser);
        return result;
    } else {
        return;
    }
};
