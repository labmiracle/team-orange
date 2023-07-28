export const CartLoader = {
    async getCart() {
        const token = window.localStorage.getItem("user");

        try {
            if (token && token !== undefined) {
                const response = await fetch("http://localhost:4000/api/cart", {
                    method: "GET",
                    headers: { "x-auth": token },
                });
                const cart = await response.json();
                return cart.data;
            }
        } catch (e) {
            return console.error((e as Error).message);
        }
    },
};
