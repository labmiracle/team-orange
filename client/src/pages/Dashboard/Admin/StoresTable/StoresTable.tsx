import { StoreName, User } from "../../../../types";
import styles from "../index.module.css";
import { StoreService } from "../../../../services/Store.service";
import { useState } from "react";
import { Button } from "../../../../components/ui/Button";
import CreateStore from "./CreateStore";
import { Modal } from "../../../../components/ui/Modal";

type Props = {
    data: { users: User[]; stores: StoreName[] };
    setData: React.Dispatch<
        React.SetStateAction<{
            users: User[];
            stores: StoreName[];
        }>
    >;
};

export default function StoresTable({ data, setData }: Props) {
    const [showModal, setShowModal] = useState(false);
    const [showModalError, setShowModalError] = useState(false);
    const [messageError, setMessageError] = useState("");

    const storeService = new StoreService();

    const handleDisable = async (storeId: number) => {
        try {
            storeService.disable(storeId);
        } catch (e) {
            setShowModalError(true);
            setMessageError((e as any).message);
            return;
        }
        const updatedStore = data.stores.map(store => (store.id === storeId ? { ...store, status: 0 } : store));
        setData({ ...data, stores: updatedStore });
    };

    const handleRestore = (storeId: number) => {
        try {
            storeService.restore(storeId);
        } catch (e) {
            setShowModalError(true);
            setMessageError((e as any).message);
            return;
        }
        const updatedStore = data.stores.map(store => (store.id === storeId ? { ...store, status: 1 } : store));
        setData({ ...data, stores: updatedStore });
    };

    const handleDelete = (storeId: number) => {
        try {
            storeService.delete(storeId);
        } catch (e) {
            setShowModalError(true);
            setMessageError((e as any).message);
            return;
        }
        const storesUpdated = data.stores.filter(store => store.id !== storeId)
        setData({ ...data, stores: storesUpdated });
    };

    const stores = data.stores.map(store => {
        return (
            <tr key={store.id}>
                <td>{store.id}</td>
                <td>{store.name}</td>
                <td>{store.managerId}</td>
                <td>{store.status}</td>
                <td>
                    {
                        <>
                            <button className={styles.button} title="disable" onClick={() => handleDisable(store.id)}>
                                ⛔
                            </button>
                            <button className={styles.button} title="restore" onClick={() => handleRestore(store.id)}>
                                ✅
                            </button>
                            <button className={styles.button} title="delete" onClick={() => handleDelete(store.id)}>
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
            <Modal title="Create store" isOpen={showModal} handleClose={() => setShowModal(false)}>
                <CreateStore
                    {...{
                        setData,
                        storeService,
                        setShowModal,
                        setShowModalError,
                        setMessageError,
                    }}
                />
            </Modal>
            <Modal title="Error" isOpen={showModalError} handleClose={() => setShowModalError(false)}>
                {messageError}
            </Modal>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th colSpan={5}>STORES</th>
                    </tr>
                    <tr>
                        <th>id</th>
                        <th>name</th>
                        <th>manager</th>
                        <th>status</th>
                        <th>actions</th>
                    </tr>
                </thead>
                <tbody>{stores}</tbody>
            </table>
            <Button variant="modal" onClick={() => setShowModal(true)}>
                Crear tienda
            </Button>
        </>
    );
}
