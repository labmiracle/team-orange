import React, { createContext, useState } from "react";
import { Product } from "../types";

interface ContextType {
    cart: Product[];
    setCart: React.Dispatch<React.SetStateAction<Product[]>>;
}
export const CartContext = createContext<ContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<Product[]>(() => JSON.parse(window.localStorage.getItem("cart") || "[]"));

    return <CartContext.Provider value={{ cart, setCart }}>{children}</CartContext.Provider>;
}
