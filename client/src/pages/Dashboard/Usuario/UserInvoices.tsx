import { useLoaderData } from "react-router-dom";
import Invoice from "../../utilities/Invoice";
import { InvoiceInterface } from "../../../types";
import styles from "./userInvoices.module.css";

export default function UserInvoices() {
    const invoices = useLoaderData() as InvoiceInterface[];
    if (!(invoices.length > 0)) return <p>No tiene compras</p>;
    const html = invoices.map(invoice => (
        <div className={styles.invoice} key={invoice.id}>
            <Invoice {...{ invoice }} />
        </div>
    ));
    return <main className={styles.main}>{html}</main>;
}
