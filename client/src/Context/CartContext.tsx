import React, { createContext, useState } from "react";
import { ItemCart } from "../types";

interface ContextType {
    cart: ItemCart[];
    setCart: React.Dispatch<React.SetStateAction<ItemCart[]>>;
}
export const CartContext = createContext<ContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<ItemCart[]>(() => JSON.parse(window.localStorage.getItem("cart") || "[]"));

    return <CartContext.Provider value={{ cart, setCart }}>{children}</CartContext.Provider>;
}
