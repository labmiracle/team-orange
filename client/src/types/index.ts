export type Product = {
    id: number;
    name: string;
    brand: string;
    categories: string[];
    currentStock: number;
    reorderPoint: number;
    minimum: number;
    price: number;
    discountPercentage: number;
    description: string;
    url_img: string;
    sizes: string[];
    quantity: number;
    total?: number;
};

export type ProductForCreation = {
    name: string;
    brand: string;
    reorderPoint: number;
    minimum: number;
    price: number;
    discountPercentage: number;
    description: string;
    url_img: string;
    sizes: string[];
    categories: string[];
    currentStock: number;
};

export interface ProductResponse {
    products: Product[];
    pagination: {
        page: number;
        perPage: number;
        totalPages: number;
        totalItems: number;
        hasNextPage: boolean;
    };
}

export type ItemCart = {
    product: Product;
    amount: number;
};

export interface InvoiceInterface {
    id: number;
    date: Date;
    total: number;
    name: string;
    lastName: string;
    email: string;
    idDocumentType: string;
    idDocumentNumber: number;
    messageUrl: string;
    products: {
        name: string;
        store: string;
        price: number;
        quantity: number;
        total: number;
    }[];
}

export type Color = { hue: number; sat: number; light: number };

export type ColorsType = {
    primary: Color;
    secondary: Color;
};

export type StoreType = {
    id: number;
    name: string;
    managerId: number;
    apiUrl: string;
    colors: ColorsType;
    categories: string[];
    sizes: string[];
    status: number;
};

export type StoreWithProducts = StoreType & {
    products: Product[];
};

export type setFilterType = ({ category, size }: { category?: string; size?: string }) => void;

export type LoaderResponse<T> = {
    data: T | undefined;
    message: string;
    error: boolean;
};

export type StoreName = {
    id: number;
    name: string;
    managerId: number | null;
    status: number;
};

export type User = {
    id?: number;
    name: string;
    lastName: string;
    email: string;
    password: string;
    idDocumentType: string;
    idDocumentNumber: number;
    rol: string;
    status?: number;
    createdAt?: Date;
    updatedAt?: Date;
};

export type Token = User & {
    iat: number;
    exp: number;
};

export type AuthData = {
    token: string;
    rol: string;
    name: string;
    lastName: string;
};

export type RegisterData = {
    email: string;
    password: string;
    name: string;
    lastName: string;
    docType: string;
    docNumber: number;
};

export enum InputError {
    "USER_NOT_FOUND",
    "EMAIL",
    "DUP_EMAIL",
    "NAME",
    "LAST_NAME",
    "PASSWORD",
    "PASSWORD_MISMATCH",
    "DUP_DNI",
    "DNI",
    "ERROR",
    "NONE",
}
