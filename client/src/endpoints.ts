const baseUrl = "http://localhost:4000/api";

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
    },
};
