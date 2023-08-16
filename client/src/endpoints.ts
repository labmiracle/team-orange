const baseUrl = import.meta.env.VITE_API_URL + "/api";

export const baseEndpoints = {
    products: {
        product: `${baseUrl}/product`,
    },
    stores: {
        store: `${baseUrl}/shop`,
        names: `${baseUrl}/shop/names`,
    },
    users: {
        login: `${baseUrl}/users/login`,
        register: `${baseUrl}/users/signup`,
        update: `${baseUrl}/users/update`,
        get: `${baseUrl}/users`,
    },
    checkout: {
        get: `${baseUrl}/checkout/get`,
        produce: `${baseUrl}/checkout/produce`,
    },
};
