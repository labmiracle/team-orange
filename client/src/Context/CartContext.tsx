import React, { createContext, useState } from "react";
import { ProductType } from "../types/types";

interface ContextType {
    cart: ProductType[];
    setCart: React.Dispatch<React.SetStateAction<ProductType[]>>;
}
export const CartContext = createContext<ContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<ProductType[]>(() => JSON.parse(window.localStorage.getItem("cart") || "[]"));

    return <CartContext.Provider value={{ cart, setCart }}>{children}</CartContext.Provider>;
}
