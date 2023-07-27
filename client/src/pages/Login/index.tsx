import { Navigate, useNavigate } from "react-router-dom";
import { useLogin } from "../../services/useLogin";
import { Input } from "../../components/ui/Input";
import styles from "./index.module.css";
import { Button } from "../../components/ui/Button";

export function Login() {
    const { getAuth, user } = useLogin();
    const navigate = useNavigate();

    function login(event: React.FormEvent) {
        event.preventDefault();
        const { email, password } = event.target as HTMLFormElement;
        getAuth(email.value, password.value);
    }

    return user ? (
        <Navigate to={"/"} />
    ) : (
        <>
            <header className={styles.header}>
                <p className={styles.logo}>Shoppy</p>
            </header>
            <main className={styles.main}>
                <p className={styles.title}>Iniciar sesion</p>
                <form onSubmit={login} className={styles.loginForm}>
                    <Input id="email" type="text" required>
                        Correo electronico
                    </Input>
                    <Input id="password" type="password" required>
                        Clave
                    </Input>
                    <div className={styles.buttonContainer}>
                        <Button type="submit">Acceder</Button>
                        <Button variant="ghost" type="button" onClick={() => navigate("/register")}>
                            Registrarse
                        </Button>
                    </div>
                </form>
            </main>
        </>
    );
}
