import type { RegisterData } from "../types";
import { useAuthContext } from "../Context/AuthContext";
import { UsersService } from "./User.service";

export function useLogin() {
    const { user, setUser } = useAuthContext();

    async function getAuth(email: string, password: string) {
        const userService = new UsersService();
        const authData = await userService.login(email, password);
        if (authData) {
            setUser(authData);
        }
    }

    async function register({ email, password, name, lastName, docType, docNumber }: RegisterData) {
        const userService = new UsersService();
        const httpStatus = await userService.register({ email, password, name, lastName, docType, docNumber });
        if (httpStatus === 200) {
            await getAuth(email, password);
        }
    }

    return { user, getAuth, register };
}
