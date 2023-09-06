import { useRouteError } from "react-router-dom";
import styles from "./index.module.css";
import { Link } from "../../components/ui/Link";

export function ErrorPage() {
    const error = useRouteError() as Error;
    console.error(error);

    return (
        <div className={styles.error_container}>
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.&#128532;</p>
            <p>
                <i>{error.message}</i>
            </p>
            <Link to="/" className={styles.link_home}>
                Go to homepage
            </Link>
        </div>
    );
}
