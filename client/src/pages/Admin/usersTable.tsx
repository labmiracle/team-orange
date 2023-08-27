import { UsersService } from "../../services/User.service";
import { StoreName, User } from "../../types";
import styles from "./index.module.css";
import { useState } from "react";
import SetManager from "./SetManager";
import { Modal } from "../../components/Shared/Modal";

type Props = {
    data: { users: User[]; stores: StoreName[] };
    setData: React.Dispatch<
        React.SetStateAction<{
            users: User[];
            stores: StoreName[];
        }>
    >;
};

export default function UsersTable({ data, setData }: Props) {
    const [managerWindow, setManagerWindow] = useState({
        email: "",
        show: false,
    });
    const [showModal, setShowModal] = useState(false);

    const userService = new UsersService();

    const handleDisable = async (user: User) => {
        try {
            userService.disable(user);
        } catch (e) {
            alert((e as any).message);
            return;
        }
        const updatedUser = data.users.map(u => (u.id === user.id ? { ...u, status: 0 } : u));
        setData({ ...data, users: updatedUser });
    };

    const handleRestore = (user: User) => {
        try {
            userService.restore(user);
        } catch (e) {
            alert((e as any).message);
            return;
        }
        const updatedUser = data.users.map(u => (u.id === user.id ? { ...u, status: 1 } : u));
        setData({ ...data, users: updatedUser });
    };

    const handleDelete = async (user: User) => {
        try {
            await userService.delete(user);
        } catch (e) {
            alert((e as any).message);
            return;
        }
        const userIndex = data.users.indexOf(user);
        data.users.splice(userIndex, 1);
        setData({ ...data });
    };

    const handleChangeRolesManager = (user: User) => {
        setManagerWindow({ email: user.email, show: true });
    };

    const handleChangeRolesUser = async (user: User) => {
        try {
            await userService.changeRoleClient(user);
        } catch (e) {
            alert((e as any).message);
            return;
        }
        const updatedUser = data.users.map(u => (u.id === user.id ? { ...u, rol: "Client" } : u));
        const updatedStore = data.stores.map(s => (s.managerId === user.id ? { ...s, managerId: null } : s));
        setData({ stores: updatedStore, users: updatedUser });
    };

    const users = data?.users?.map(user => {
        return (
            <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name + " " + user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.rol}</td>
                <td>{user.idDocumentType}</td>
                <td>{user.idDocumentNumber}</td>
                <td>{user.status}</td>
                <td>{user.createdAt?.toString().slice(0, 10)}</td>
                <td>{user.updatedAt?.toString().slice(0, 10)}</td>
                <td>
                    {
                        <>
                            <button className={styles.button} title="disable" onClick={() => handleDisable(user)}>
                                ⛔
                            </button>
                            <button className={styles.button} title="restore" onClick={() => handleRestore(user)}>
                                ✅
                            </button>
                            <button
                                className={styles.button}
                                title="change role manager"
                                onClick={() => handleChangeRolesManager(user)}>
                                ⚡
                            </button>
                            <button
                                className={styles.button}
                                title="change role user"
                                onClick={() => handleChangeRolesUser(user)}>
                                ⚡
                            </button>
                            <button className={styles.button} title="delete" onClick={() => handleDelete(user)}>
                                ❌
                            </button>
                        </>
                    }
                </td>
            </tr>
        );
    });

    return (
        <>
            <Modal title="test" isOpen={showModal} handleClose={() => setShowModal(false)}>
                Form
            </Modal>
            <div className={styles.main}>
                {managerWindow.show && (
                    <SetManager
                        {...{
                            data,
                            setData,
                            userService,
                            managerWindow,
                            setManagerWindow,
                        }}
                    />
                )}

                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th colSpan={10}>USERS</th>
                        </tr>
                        <tr>
                            <th>id</th>
                            <th>name</th>
                            <th>email</th>
                            <th>rol</th>
                            <th>documentType</th>
                            <th>documentNumber</th>
                            <th>status</th>
                            <th>createdAt</th>
                            <th>updatedAt</th>
                            <th>actions</th>
                        </tr>
                    </thead>
                    <tbody>{users}</tbody>
                </table>
            </div>
        </>
    );
}
