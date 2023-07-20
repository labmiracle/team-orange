import { Navigate } from "react-router-dom";
import { useAuth } from "../../Context/authContext";
import { useLogin } from "../../services/useLogin";

export function Login() {
    const { setUser } = useAuth();
    const { isAuth, data } = useLogin();

    function login(event: React.FormEvent) {
        event.preventDefault();
        const { user, password } = event.target as HTMLFormElement;
        isAuth(user.value, password.value);
        if (data) {
            setUser(data);
        }
    }

    return data ? (
        <Navigate to={"/"} />
    ) : (
        <main>
            <form onSubmit={login}>
                <div>
                    <label htmlFor="user">Usuario</label>
                    <input type="text" id="user" required />
                </div>
                <div>
                    <label htmlFor="password">Clave</label>
                    <input type="password" id="password" required />
                </div>
                <button type="submit">Acceder</button>
                <button>Registrarse</button>
            </form>
        </main>
    );
}
