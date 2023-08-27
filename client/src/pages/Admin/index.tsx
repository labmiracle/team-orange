import UsersTable from "./usersTable";
import StoresTable from "./storesTable";
import styles from "./index.module.css";
import { useLoaderData } from "react-router-dom";
import { useState } from "react";
import { StoreName, User } from "../../types";

export default function Admin() {
    const dataLoader = useLoaderData() as { users: User[]; stores: StoreName[] };
    const [data, setData] = useState(dataLoader);

    return (
        <main className={styles.container}>
            <UsersTable data={data} setData={setData} />
            <StoresTable data={data} setData={setData} />
        </main>
    );
}
