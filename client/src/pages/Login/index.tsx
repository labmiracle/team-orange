import { Navigate } from "react-router-dom";
import { useAuth } from "../../Context/authContext";
import { useLogin } from "../../services/useLogin";
import { Input } from "../../components/ui/Input";
import styles from "./index.module.css";
import { Button } from "../../components/ui/Button";

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
        <>
            <header className={styles.header}>
                <p className={styles.logo}>Shoppy</p>
            </header>
            <main className={styles.main}>
                <p className={styles.title}>Iniciar sesion</p>
                <form onSubmit={login} className={styles.loginForm}>
                    <Input id="user" type="text" required>
                        Usuario
                    </Input>
                    <Input id="password" type="password" required>
                        Clave
                    </Input>
                    <div className={styles.buttonContainer}>
                        <Button type="submit">Acceder</Button>
                        <Button variant="ghost">Registrarse</Button>
                    </div>
                </form>
            </main>
        </>
    );
}
