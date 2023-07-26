import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { useLogin } from "../../services/useLogin";
import { Input } from "../../components/ui/Input";
import styles from "./index.module.css";
import { Button } from "../../components/ui/Button";
import { useState } from "react";

enum InputError {
    "PASSWORD_MISMATCH",
    "NONE",
}
const ErrorMessages = {
    [InputError.NONE]: "",
    [InputError.PASSWORD_MISMATCH]: "Las claves no coinciden",
};

export function Register() {
    const { setUser } = useAuth();
    const { register, data } = useLogin();
    const [error, setError] = useState<InputError>(InputError.NONE);
    const navigate = useNavigate();

    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        setError(InputError.NONE);
        const { email, password, passwordConfirm, firstname, lastname, docType, docNumber } =
            event.target as HTMLFormElement;
        if (password.value !== passwordConfirm.value) {
            setError(InputError.PASSWORD_MISMATCH);
        } else {
            register({
                email: email.value,
                password: password.value,
                name: firstname.value,
                lastname: lastname.value,
                docType: docType.value,
                docNumber: Number(docNumber.value),
            });
        }
        if (data) {
            console.log(data);
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
                <p className={styles.title}>Registrarse</p>
                <form onSubmit={handleSubmit} className={styles.loginForm}>
                    <div className={styles.mainContent}>
                        <div className={styles.accountData}>
                            <Input id="email" type="email" required>
                                Correo electronico
                            </Input>

                            <Input
                                id="password"
                                type="password"
                                error={error === InputError.PASSWORD_MISMATCH ? ErrorMessages[error] : ""}
                                minLength={8}
                                required>
                                Clave
                            </Input>
                            <Input
                                id="passwordConfirm"
                                error={error === InputError.PASSWORD_MISMATCH ? ErrorMessages[error] : ""}
                                type="password"
                                minLength={8}>
                                Confimar clave
                            </Input>
                        </div>
                        <hr />
                        <div className={styles.personalData}>
                            <Input id="firstname" type="text" required>
                                Nombre
                            </Input>
                            <Input id="lastname" type="text" required>
                                Apellido
                            </Input>
                            <div className={styles.documentContainer}>
                                <div className={styles.docTypeContainer}>
                                    <label htmlFor="">Tipo de documento</label>
                                    <select className={styles.docType} name="docType" id="">
                                        <option value="DNI">DNI</option>
                                        <option value="LE">LE</option>
                                        <option value="LC">LC</option>
                                    </select>
                                </div>
                                <Input id="docNumber" minLength={8} required>
                                    Numero de documento
                                </Input>
                            </div>
                        </div>
                    </div>
                    <div className={styles.buttonContainer}>
                        <Button type="submit">Crear cuenta</Button>
                        <Button variant="ghost" type="button" onClick={() => navigate("/login")}>
                            Iniciar sesion
                        </Button>
                    </div>
                </form>
            </main>
        </>
    );
}
