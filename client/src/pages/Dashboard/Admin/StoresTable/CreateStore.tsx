import { useState } from "react";
import { StoreService } from "@/services/Store.service";
import { StoreName, User } from "@/types";
import { Button } from "@/components/ui/Button";
import styles from "./createStore.module.css";

type Props = {
    setData: React.Dispatch<
        React.SetStateAction<{
            users: User[];
            stores: StoreName[];
        }>
    >;
    storeService: StoreService;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    setShowModalError: React.Dispatch<React.SetStateAction<boolean>>;
    setMessageError: React.Dispatch<React.SetStateAction<string>>;
};

export default function CreateStore({
    setData,
    storeService,
    setShowModal,
    setShowModalError,
    setMessageError,
}: Props) {
    const [store, setStore] = useState({
        name: "",
        managerId: 0,
        apiUrl: "",
    });

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.currentTarget.name;
        const value = e.currentTarget.value;
        setStore((prev: typeof store) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            setShowModal(false);
            e.preventDefault();
            const newStore = await storeService.create(store);
            if (newStore) {
                setData(prevData => ({
                    ...prevData,
                    stores: [
                        ...prevData.stores,
                        {
                            id: newStore.id,
                            name: newStore.name,
                            managerId: newStore.managerId,
                            status: newStore.status,
                        },
                    ],
                }));
            }
        } catch (error) {
            setShowModalError(true);
            setMessageError((error as any).message);
            return;
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div>
                <label htmlFor="name">Name: </label>
                <input name="name" onChange={handleChange} />
            </div>
            <div>
                <label htmlFor="managerId">Manager: </label>
                <input name="managerId" onChange={handleChange} />
            </div>
            <div>
                <label htmlFor="apiUrl">ApiUrl:</label>
                <input name="apiUrl" onChange={handleChange} />
            </div>
            <Button variant="modal" type="submit">
                Create
            </Button>
        </form>
    );
}
