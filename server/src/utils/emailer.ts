/* eslint-disable indent */
import nodemailer from "nodemailer";
import { InvoiceViewInterface } from "../models/invoiceView";
import { DependencyLifeTime, Injectable } from "@miracledevs/paradigm-web-di";
import SMTPTransport from "nodemailer/lib/smtp-transport";

type TMessage = {
    from: string;
    to: string;
    subject: string;
    html: string;
};

interface IEmailerService {
    send: (message: TMessage) => Promise<string | false>;
}

class NodeService implements IEmailerService {
    private transport: nodemailer.Transporter<SMTPTransport.SentMessageInfo> = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        auth: {
            user: process.env.NODEMAILER_USER,
            pass: process.env.NODEMAILER_PASSWORD,
        },
        tls: {
            rejectUnauthorized: false, // Configuración para permitir certificados auto-firmados
        },
    });
    public async send(message: TMessage) {
        const info = await this.transport.sendMail(message);
        const url = nodemailer.getTestMessageUrl(info);
        return url;
    }
}

@Injectable({ lifeTime: DependencyLifeTime.Transient })
export class Emailer {
    constructor(private readonly EmailerService: NodeService) {}

    private odd(number: number) {
        return number % 2 === 0 ? "background-color:silver;padding-right:5px;" : "background-color:white;padding-right:5px;";
    }
    async sendInvoice(invoice: InvoiceViewInterface) {
        const html = `
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
                    <thead>
                        <tr>
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
                        </tr>
                    </thead>
                    <tbody>
                    ${invoice.products
                        .map((product, i) => {
                            const num = this.odd(i);
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
                    </tbody>
                </table>
                <h2>Grand Total: ${invoice.total}</h2>
            </div>`;

        const message = {
            from: "shoppy@email.com",
            to: invoice.email,
            subject: "Invoice",
            html: html,
        };

        return await this.EmailerService.send(message);
    }
}
