import { Action, ApiController, Controller, HttpMethod } from "@miracledevs/paradigm-express-webapi";
import { JWTAuthFilter } from "../filters/jwtAuth";
import { ProductSaleArrayFilter } from "../filters/product.filter";
import { Path, POST, GET } from "typescript-rest";
import { InvoiceRepository } from "../repositories/invoice.repository";
import { ItemRepository } from "../repositories/item.repository";
import { InvoiceViewRepository } from "../repositories/invoiceView.repository";
import { Tags, Response } from "typescript-rest-swagger";
import { InvoiceViewInterface } from "../models/invoiceView";
import { ProductSaleInterface } from "../models/product";
import dotenv from "dotenv";
import { UserRepository } from "../repositories/user.repository";
import { Emailer } from "../utils/emailer";
dotenv.config();

@Path("/api/checkout")
@Tags("Cart")
@Controller({ route: "/api/checkout" })
export class CheckoutController extends ApiController {
    constructor(
        private readonly invoiceRepo: InvoiceRepository,
        private readonly itemRepo: ItemRepository,
        private readonly invoiceViewRepo: InvoiceViewRepository,
        private readonly userRepo: UserRepository,
        private readonly emailer: Emailer
    ) {
        super();
    }

    @GET
    @Path("/get")
    @Response<InvoiceViewInterface[]>(200, "Retrieve an invoice.")
    @Response(404, "Invoice not found.")
    @Response(500, "Server error.")
    @Action({ route: "/get", method: HttpMethod.GET, filters: [JWTAuthFilter] })
    async getInvoice() {
        const { email } = this.userRepo.getAuth();
        const invoiceView = await this.invoiceViewRepo.find({ email: email });
        if (invoiceView.length === 0) return [];
        return invoiceView;
    }

    @POST
    @Path("/produce")
    @Action({ route: "/produce", method: HttpMethod.POST, filters: [ProductSaleArrayFilter, JWTAuthFilter], fromBody: true })
    async produceInvoice(products: ProductSaleInterface[]) {
        if (products.length === 0) throw new Error("No items in cart");
        const { email: userEmail } = this.userRepo.getAuth();
        const date = new Date();
        const grandTotal = [...products].reduce((acc, c) => acc + c.price * c.discountPercentage * c.quantity, 0);
        const user = await this.userRepo.getById(userEmail);
        const invoice = await this.invoiceRepo.insertOne({ userId: user.id, date: date, total: grandTotal });
        const items = products.map(item => ({
            invoiceId: invoice.insertId,
            productId: item.id,
            unitPrice: item.price,
            quantity: item.quantity,
            total: item.price * item.discountPercentage * item.quantity,
        }));
        await this.itemRepo.insertItem(items);
        const invoiceView = await this.invoiceViewRepo.getById(invoice.insertId);
        const urlInfo = await this.emailer.send(invoiceView);
        return { ...invoiceView, messageUrl: urlInfo };
    }
}
