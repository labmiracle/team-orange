import { useState } from "react";
import { UsersService } from "../../services/User.service";
import { StoreName, User } from "../../types";
import styles from "./index.module.css";

export default function SetManager({
    data,
    setData,
    userService,
    managerWindow,
    setManagerWindow,
}: {
    data: { users: User[]; stores: StoreName[] };
    setData: React.Dispatch<
        React.SetStateAction<{
            users: User[];
            stores: StoreName[];
        }>
    >;
    userService: UsersService;
    managerWindow: {
        email: string;
        show: boolean;
    };
    setManagerWindow: React.Dispatch<
        React.SetStateAction<{
            email: string;
            show: boolean;
        }>
    >;
}) {
    const [storeSelect, setStoreSelect] = useState(0);

    const changeRole = async ({ idStore }: { idStore: number }) => {
        try {
            await userService.changeRoleManager({ email: managerWindow.email, idStore });
        } catch (e) {
            alert((e as any).message);
            return;
        }

        const idUser = data.users.find(user => user.email === managerWindow.email);
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
        setManagerWindow(prev => ({ ...prev, show: false }));
    };

    return (
        <div className={styles.set_manager_window}>
            <button onClick={() => setManagerWindow(prev => ({ ...prev, show: false }))}>[x]</button>
            <fieldset>
                <legend>Select Store</legend>
                {data.stores.map(store => {
                    return (
                        <div key={store.id}>
                            <input
                                type="radio"
                                id={store.name}
                                value={store.id}
                                name="stores"
                                onChange={event => setStoreSelect(Number(event.currentTarget.value))}
                            />
                            <label htmlFor={store.name}>{store.name}</label>
                        </div>
                    );
                })}
                <button onClick={() => changeRole({ idStore: storeSelect })}>Set Manager</button>
            </fieldset>
        </div>
    );
}
