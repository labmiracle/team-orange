import { useContext, useEffect } from "react";
import { CartContext } from "../Context/CartContext";
import { AuthData, Product } from "../types";
import { ProductService } from "../services/Product.service";
import Fetcher from "../services/Fetcher";
import { baseEndpoints } from "../endpoints";
import { CartService } from "../services/Cart.service";

export function useCart() {
    const cartContext = useContext(CartContext);

    if (!cartContext) throw new Error("You have to wrap your app with cartProvider");

    const { cart, setCart } = cartContext;

    useEffect(() => {
        window.localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    function addProduct(product: Product, amount: number) {
        if (cart.length > 0 && cart.some(item => item.product.id === product.id)) {
            const updatedCart = cart.map(item => {
                if (item.product.id === product.id) return { product: item.product, amount: item.amount + amount };
                return item;
            });
            setCart(updatedCart);
        } else {
            setCart(prev => [...prev, { product, amount }]);
        }
    }

    function clearCart() {
        setCart([]);
    }

    function checkout() {
        const user = window.localStorage.getItem("user");

        const cartService = new CartService();
        if (user) {
            return cartService.checkout(cart, user).then(invoice => {
                return invoice.data;
            });
        } else {
            return cartService.checkout(cart).then(invoice => {
                return invoice.data;
            });
        }
    }

    return { cart, addProduct, clearCart, checkout };
}
