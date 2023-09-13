import { useContext, useEffect } from "react";
import { CartContext } from "../Context/CartContext";
import { Product } from "../types";
import { CheckoutService } from "../services/Checkout.service";

export function useCart() {
    const cartContext = useContext(CartContext);

    if (!cartContext) throw new Error("You have to wrap your app with cartProvider");

    const { cart, setCart } = cartContext;

    useEffect(() => {
        window.localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    function addProduct(product: Product, amount: number) {
        if (cart.length > 0 && cart.some(item => item.id === product.id)) {
            const updatedCart = cart.map(item => {
                if (item.id === product.id) return { ...product, quantity: item.quantity + amount };
                return item;
            });
            setCart(updatedCart);
        } else {
            setCart(prev => [...prev, { ...product, quantity: amount }]);
        }
    }

    function clearCart() {
        setCart([]);
    }

    async function checkout() {
        const checkoutService = new CheckoutService();
        const invoice = await checkoutService.produceInvoice(cart);
        return invoice;
    }

    return { cart, addProduct, clearCart, checkout };
}
