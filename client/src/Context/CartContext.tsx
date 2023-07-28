import React, { createContext, useContext, useEffect, useState } from "react";
import { ProductType } from "../types/types";
//import { useAuthContext } from "./AuthContext";
//import { CartLoader } from "../Loaders/CartLoader";

/* interface CartItem {
    product: ProductType;
    amount: number;
} */

interface ContextType {
    cart: ProductType[];
    setCart: React.Dispatch<React.SetStateAction<ProductType[]>>;
}
const CartContext = createContext<ContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<ProductType[]>([]);
    /* const { user } = useAuthContext();
    useEffect(() => {
        const load = async () => {
            const data = await CartLoader.getCart();
            setCart(data);
        };
        load();
    }, [user]); */

    useEffect(() => {
        try {
            const cart = window.localStorage.getItem("cart");
            if (cart && cart?.length > 0) setCart(JSON.parse(cart));
        } catch (err) {
            console.error(err);
        }
    }, []);

    useEffect(() => {
        if (cart.length > 0) window.localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    return <CartContext.Provider value={{ cart, setCart }}>{children}</CartContext.Provider>;
}

export function useCart() {
    const authContext = useContext(CartContext);

    if (!authContext) throw new Error("You have to wrap your app with cartProvider");

    const { cart, setCart } = authContext;

    /*    useEffect(() => {
        window.localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]); */

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
        /* const productExistsInCart = cart.some(item => item.id === product.id);
        if (productExistsInCart) {
            const updatedCart = cart.map(item => {
                if (item.id === product.id) {
                    return { ...item, quantity: item.quantity + quantity };
                }
                return item;
            });

            setCart(updatedCart);
        } else {
            setCart([...cart, { product, amount }]);
        } */
    }

    function clearCart() {
        window.localStorage.removeItem("cart");
        setCart([]);
    }

    return { cart, addProduct, clearCart };
}
