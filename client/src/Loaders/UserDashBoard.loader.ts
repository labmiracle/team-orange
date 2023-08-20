import { CheckoutService } from "../services/Checkout.service";
import { UsersService } from "../services/User.service";
import { Params } from "react-router-dom";
export const UserLoader = {
    async getInvoices() {
        try {
            const checkout = new CheckoutService();
            const data = await checkout.getInvoices();
            return data;
        } catch (e) {
            console.error(e);
        }
    },
    async getUser({ params }: { params: Params }) {
        try {
            const user = new UsersService();
            const { id } = params;
            const data = await user.getUser(Number(id));
            return data.data;
        } catch (e) {
            console.error(e);
        }
    },
};
