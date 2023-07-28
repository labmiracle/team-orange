import { useContext, useEffect } from "react";
import { CartContext } from "../Context/CartContext";
import { ProductType } from "../types/types";

export function useCart() {
    const cartContext = useContext(CartContext);

    if (!cartContext) throw new Error("You have to wrap your app with cartProvider");

    const { cart, setCart } = cartContext;

    useEffect(() => {
        window.localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    function addProduct(product: ProductType, amount: number) {
        if (cart.some(item => item.id === product.id)) {
            const updatedCart = cart.map(item => {
                if (item.id === product.id) return { ...item, quantity: (item.quantity ??= 0) + amount };
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

    return { cart, addProduct, clearCart };
}
