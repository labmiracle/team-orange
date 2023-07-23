import { useCart } from "../../Context/CartContext";

export function Cart() {
    const { cart } = useCart();

    if (cart === null) {
        return;
    }

    return (
        <div>
            {cart.map(item => (
                <li>{item.product.name}</li>
            ))}
        </div>
    );
}
