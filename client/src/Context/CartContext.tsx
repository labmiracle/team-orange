import React, { createContext, useContext, useEffect, useState } from "react";
import { ProductType } from "../types/types";

interface CartItem {
    product: ProductType;
    amount: number;
}

interface ContextType {
    cart: CartItem[];
    setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}
const CartContext = createContext<ContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>(() => JSON.parse(window.localStorage.getItem("cart") || ""));

    return <CartContext.Provider value={{ cart: cart, setCart }}>{children}</CartContext.Provider>;
}

export function useCart() {
    const authContext = useContext(CartContext);

    if (!authContext) throw new Error("You have to wrap your app with cartProvider");

    const { cart, setCart } = authContext;

    useEffect(() => {
        window.localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    function addProduct(product: ProductType, amount: number) {
        if (isNaN(amount)) return;
        const productExistsInCart = cart.some(item => item.product.id === product.id);
        if (productExistsInCart) {
            const updatedCart = cart.map(item => {
                if (item.product.id === product.id) {
                    return { ...item, amount: item.amount + amount };
                }
                return item;
            });

            setCart(updatedCart);
        } else {
            setCart([...cart, { product, amount }]);
        }
    }

    function clearCart() {
        setCart([]);
    }

    return { cart, addProduct, clearCart };
}
