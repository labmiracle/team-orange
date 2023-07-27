/* eslint-disable indent */
import { InvoiceViewI } from "../models/invoiceView";

export default function setEmail(invoice: InvoiceViewI) {
    const odd = (number: number) => (number % 2 === 0 ? "background-color:silver;padding-right:5px;" : "background-color:white;padding-right:5px;");
    return `
        <div style="display: block; background-color: white; max-width: 600px;">
          <header class="header">
            <h1 style="margin:5px; font-size: 36px;">INVOICE</h1>
            <h1 style="margin:5px; font-size: 36px;"><span style="margin-right: auto;">Shoppy</span></h1>
          </header>
          <p>Purchase Order: ${invoice.id}</p>
          <p>Date : ${invoice.date.toDateString()}</p>
          <b>BILL TO</b>
          <p>Name: ${invoice.name + " " + invoice.lastName}</p>
          <p>Email: ${invoice.email}</p>
          <p>${invoice.idDocumentType}: ${invoice.idDocumentNumber}</p>
          <table style="width: 100%; text-align: left;">
          <th><b>name</b></th><th><b>store</b></th><th><b>price</b></th><th><b>quantity</b></th><th><b>total</b></th>
          ${invoice.products
              .map((product, i) => {
                  const num = odd(i);
                  return `
                    <tr>
                      <td style=${num}>${product.name}</td>
                      <td style=${num}>${product.store}</td>
                      <td style=${num}>${product.price}</td>
                      <td style=${num}>${product.quantity}</td>
                      <td style=${num}>${product.total}</td>
                    </tr>`;
              })
              .join("")}
          </table>
          <h2>Grand Total: ${invoice.total}</h2>
        </div>`;
}
