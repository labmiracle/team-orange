import { useAuthContext } from "@/Context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import styles from "./userData.module.css";
import { UsersService } from "@/services/User.service";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UserData() {
    const { user, setUser, logOut } = useAuthContext();
    const [showSaveBtn, setShowSaveBtn] = useState(false);
    const [showDisableBox, setShowDisableBox] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    if (!user) throw new Error("");

    const handleEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (user) {
            setError("");
            setUser({ ...user, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async () => {
        const userService = new UsersService();
        try {
            const data = await userService.update({ ...user, password: password });
            if (data) setUser(data);
        } catch (e) {
            setError((e as Error).message);
        }
    };

    const handleDisable = async () => {
        const userService = new UsersService();
        await userService.disable({ ...user, password: password });
        navigate("/");
        logOut();
    };

    return (
        <div className={styles.container}>
            {error && <p className={styles.error}>{error}</p>}
            <h1>Datos personales</h1>
            <p>Email: {user.email}</p>
            <p>Nombre: </p>
            <Input value={user.name} type="text" onChange={handleEdit} name="name" />
            <p>Apellido: </p>
            <Input value={user.lastName} type="text" onChange={handleEdit} name="lastName" />
            <p>DNI: {user.idDocumentNumber}</p>
            <Button
                hidden={showSaveBtn}
                className={styles.modifyButton}
                variant="solid"
                onClick={() => setShowSaveBtn(true)}>
                Modificar Datos
            </Button>
            {showSaveBtn && (
                <div className={styles.changeData}>
                    <p>Ingresar contraseña: </p>
                    <Input type="password" name="password" onChange={event => setPassword(event.target.value)} />
                    <Button variant="solid" className={styles.modifyButton} onClick={handleSubmit}>
                        Guardar Datos
                    </Button>
                </div>
            )}
            <Button variant="solid" onClick={() => setShowDisableBox(true)}>
                Deshabilitar Cuenta
            </Button>
            {showDisableBox && (
                <div>
                    <label>
                        Ingresar Contraseña
                        <Input type="password" name="password" onChange={event => setPassword(event.target.value)} />
                    </label>
                    <Button variant="solid" onClick={handleDisable}>
                        Deshabilitar
                    </Button>
                </div>
            )}
        </div>
    );
}
