import { useContext, useEffect } from "react";
import { CartContext } from "../Context/CartContext";
import { Product } from "../types";
import { ProductService } from "./Product.service";


export function useCart() {
    const cartContext = useContext(CartContext);

    if (!cartContext) throw new Error("You have to wrap your app with cartProvider");

    const { cart, setCart } = cartContext;

    useEffect(() => {
        window.localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    function addProduct(product: Product, amount: number) {
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

    function checkout() {
        const user = window.localStorage.getItem("user");
        if (user) {
            return fetch("http://localhost:4000/api/checkout/produce", {
                method: "POST",
                headers: { "Content-Type": "application/json", "x-auth": user },
                body: JSON.stringify(cart),
            })
                .then(response => response.json())
                .then(invoice => {
                    return invoice.data;
                });
        } else {
            return fetch("http://localhost:4000/api/checkout/produce", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(cart),
            })
                .then(response => response.json())
                .then(invoice => {
                    return invoice.data;
                });
        }
    }

    return { cart, addProduct, clearCart, checkout };
}
