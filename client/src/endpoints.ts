export const assetsUrl = "http://localhost:4000";
export const baseUrl = "http://localhost:4000/api";

export const baseEndpoints = {
    products: {
        get: `${baseUrl}/product`,
        getAll: `${baseUrl}/product/store`,
    },
    stores: {
        get: `${baseUrl}/shop`,
        names: `${baseUrl}/shop/names`,
        disable: `${baseUrl}/shop`,
        restore: `${baseUrl}/shop`,
        update: `${baseUrl}/shop/update`,
        create: `${baseUrl}/shop/`,
        delete: `${baseUrl}/shop`,
    },
    users: {
        login: `${baseUrl}/users/login`,
        register: `${baseUrl}/users/signup`,
        update: `${baseUrl}/users/update`,
        get: `${baseUrl}/users`,
        disable: `${baseUrl}/users/admin/disable`,
        delete: `${baseUrl}/users/admin/delete`,
        restore: `${baseUrl}/users/admin/restore`,
        changeRoleManager: `${baseUrl}/users/admin/change_role_manager`,
        changeRoleClient: `${baseUrl}/users/admin/change_role_client`,
    },
    checkout: {
        get: `${baseUrl}/checkout/get`,
        produce: `${baseUrl}/checkout/produce`,
    },
};
