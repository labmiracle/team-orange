import { useAuthContext } from "../../../../Context/AuthContext";
import { Button } from "../../../../components/ui/Button";
import { Input } from "../../../../components/ui/Input";
import styles from "./userData.module.css";
import { UsersService } from "../../../../services/User.service";
import { useState } from "react";

export default function UserData() {
    const { user, setUser } = useAuthContext();
    const [showSaveBtn, setShowSaveBtn] = useState(false);
    const [password, setPassword] = useState("");
    if (!user) throw new Error("");

    const handleEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (user) {
            setUser({ ...user, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async () => {
        const userService = new UsersService();
        const data = await userService.update({ ...user, password: password });
        if (data) setUser(data);
    };
    return (
        <div className={styles.container}>
            <h1>Datos personales</h1>
            <p>Email: {user.email}</p>
            <p>Nombre: </p>
            <Input value={user.name} type="text" onChange={handleEdit} name="name" />
            <p>Apellido: </p>
            <Input value={user.lastName} type="text" onChange={handleEdit} name="lastName" />
            <p>DNI: {user.idDocumentNumber}</p>
            <Button hidden={showSaveBtn} variant="solid" onClick={() => setShowSaveBtn(true)}>
                Modificar Datos
            </Button>
            {showSaveBtn && (
                <div className={styles.changeData}>
                    <p>Ingresar contraseña: </p>
                    <Input type="password" name="password" onChange={event => setPassword(event.target.value)} />
                    <Button variant="solid" onClick={handleSubmit}>
                        Guardar Datos
                    </Button>
                </div>
            )}
        </div>
    );
}
