import { Navigate, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../Context/AuthContext";
import { UsersService } from "../../services/User.service";
import { User } from "../../types";

export function RequiredPage({ children, rol }: { children: React.ReactNode; rol?: string }) {
    const { user } = useAuthContext();
    const navigate = useNavigate();

    if (!user) {
        return <Navigate to={"/"} />;
    }

    if (rol) {
        const userService = new UsersService();
        const loaderUser = async () => {
            const loadedUser = await userService.get(user.email);
            if (loadedUser.rol !== rol) return navigate("/");
        };
        loaderUser();
    }

    return <>{children}</>;
}
