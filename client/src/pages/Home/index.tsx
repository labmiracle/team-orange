import { useAuthContext } from "../../Context/AuthContext";
import styles from "./index.module.css";

export function Home() {
    const { user } = useAuthContext();
    console.log(user);
    return (
        <main className={styles.container}>
            <p>
                Hello, {user?.name} {user?.lastname}
            </p>
        </main>
    );
}
