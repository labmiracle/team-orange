import { useState } from "react";
import { UsersService } from "@/services/User.service";
import { StoreName, User } from "@/types";
import styles from "./setManager.module.css";
import { Button } from "@/components/ui/Button";

type Props = {
    data: { users: User[]; stores: StoreName[] };
    setData: React.Dispatch<
        React.SetStateAction<{
            users: User[];
            stores: StoreName[];
        }>
    >;
    userService: UsersService;
    manager: string;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    setShowModalError: React.Dispatch<React.SetStateAction<boolean>>;
    setMessageError: React.Dispatch<React.SetStateAction<string>>;
};

export default function SetManager({
    data,
    setData,
    userService,
    manager,
    setShowModal,
    setShowModalError,
    setMessageError,
}: Props) {
    const [storeSelect, setStoreSelect] = useState(0);

    const changeRole = async ({ idStore }: { idStore: number }) => {
        try {
            await userService.changeRoleManager({ email: manager, idStore });
            setShowModal(false);
        } catch (e) {
            setShowModalError(true);
            setMessageError((e as any).message);
            return;
        }

        const idUser = data.users.find(user => user.email === manager);
        if (!idUser || !idUser.id) throw new Error("User id not found");

        const newUsers = data.users.map(user => {
            user.id === idUser.id ? (user.rol = "Manager") : user;

            return user;
        });

        const newStores = data.stores.map(store => {
            store.id === idStore ? (store.managerId = idUser.id!) : store;
            return store;
        });

        setData({ stores: newStores, users: newUsers });
    };

    return (
        <div className={styles.set_manager}>
            <fieldset className={styles.fieldset}>
                {data.stores.map(store => {
                    return (
                        <div className={styles.storeItem} key={store.id}>
                            <input
                                type="radio"
                                id={store.name}
                                value={store.id}
                                name="stores"
                                onChange={event => setStoreSelect(Number(event.currentTarget.value))}
                                className={styles.radioInput}
                            />
                            <label htmlFor={store.name} className={styles.storeLabel}>
                                {store.name}
                            </label>
                        </div>
                    );
                })}
                <Button variant="modal" onClick={() => changeRole({ idStore: storeSelect })}>
                    Set Manager
                </Button>
            </fieldset>
        </div>
    );
}
