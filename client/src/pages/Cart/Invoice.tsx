interface InvoiceI {
    id?: number;
    date: Date;
    total: number;
    name: string;
    lastName: string;
    email: string;
    idDocumentType: string;
    idDocumentNumber: number;
    messageUrl: string;
    products: {
        name: string;
        store: string;
        price: number;
        /**@IsInt */
        quantity: number;
        total: number;
    }[];
}

export default function Invoice({ invoice }: { invoice: InvoiceI }) {
    const date = new Date(invoice.date).toDateString();
    const odd = (number: number) =>
        number % 2 === 0
            ? { backgroundColor: "silver", paddingRight: 5 }
            : { backgroundColor: "white", paddingRight: 5 };
    return (
        <div style={{ display: "block", backgroundColor: "none", maxWidth: 600, margin: "auto" }}>
            <header className="header">
                <h1 style={{ margin: 5, fontSize: 36 }}>INVOICE</h1>
                <h1 style={{ margin: 5, fontSize: 36 }}>
                    <span style={{ marginRight: "auto" }}>Shoppy</span>
                </h1>
            </header>
            <p>Purchase Order: {invoice.id}</p>
            <p>Date : {date}</p>
            <b>BILL TO</b>
            <p>Name: {invoice.name + " " + invoice.lastName}</p>
            <p>Email: {invoice.email}</p>
            <p>
                {invoice.idDocumentType}: {invoice.idDocumentNumber}
            </p>
            <table style={{ width: "100%", textAlign: "left" }}>
                <th>
                    <b>name</b>
                </th>
                <th>
                    <b>store</b>
                </th>
                <th>
                    <b>price</b>
                </th>
                <th>
                    <b>quantity</b>
                </th>
                <th>
                    <b>total</b>
                </th>
                <tbody>
                    {invoice.products.map((product, i) => {
                        const num = odd(i);
                        return (
                            <tr key={product.name + i}>
                                <td style={num}>{product.name}</td>
                                <td style={num}>{product.store}</td>
                                <td style={num}>{product.price}</td>
                                <td style={num}>{product.quantity}</td>
                                <td style={num}>{product.total}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <p>
                Email sento to:{" "}
                <a href={invoice.messageUrl} target="_blank">
                    ethereal email
                </a>{" "}
            </p>
            <h2>Grand Total: ${invoice.total}</h2>
        </div>
    );
}
