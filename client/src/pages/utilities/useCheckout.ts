import { useCart } from "../../services/useCart";

export function useCheckout() {
    const { cart } = useCart();

    function submit() {
        const user = window.localStorage.getItem("user");
        if (!user) return;
        const invoice = fetch("http://localhost:4000/api/checkout/produce", {
            method: "POST",
            headers: { "Content-Type": "application/json", "x-auth": user },
            body: JSON.stringify(cart),
        })
            .then(response => response.json())
            .then(invoice => {
                return invoice.data;
            });
        return invoice;
    }
    return { submit };
}
