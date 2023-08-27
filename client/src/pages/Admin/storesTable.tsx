import { useLoaderData } from "react-router-dom";
import { StoreName, User } from "../../types";
import styles from "./index.module.css";
import { StoreService } from "../../services/Store.service";

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
    const storeService = new StoreService();

    const stores = data.stores.map(store => {
        return (
            <tr key={store.id}>
                <td>{store.id}</td>
                <td>{store.name}</td>
                <td>{store.managerId}</td>
                <td>
                    {
                        <>
                            <button className={styles.button} title="disable">
                                ⛔
                            </button>
                            <button className={styles.button} title="restore">
                                ✅
                            </button>
                            <button className={styles.button} title="create">
                                ➕
                            </button>
                        </>
                    }
                </td>
            </tr>
        );
    });

    return (
        <table className={styles.table}>
            <thead>
                <tr>
                    <th colSpan={4}>STORES</th>
                </tr>
                <tr>
                    <th>id</th>
                    <th>name</th>
                    <th>manager</th>
                    <th>actions</th>
                </tr>
            </thead>
            <tbody>{stores}</tbody>
        </table>
    );
}
