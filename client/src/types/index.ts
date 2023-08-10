export type Product = {
    id: number;
    name: string;
    brand: string;
    categories: string[];
    color: string;
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

export type Color = { hue: number; sat: number; light: number };

export type ColorsType = {
    primary: Color;
    secondary: Color;
};

export type StoreType = {
    name: string;
    colors: ColorsType;
    products: Product[];
};

export type setFilterType = ({ type, size }: { type?: string; size?: string }) => void;

export type LoaderResponse<T> = {
    data: T;
    message: string;
    error: boolean;
};

export type StoreName = {
    id: string;
    name: string;
};

export type User = {
    id: number;
    name: string;
    lastName: string;
    email: string;
    password: string;
    idDocumentType: string;
    idDocumentNumber: number;
    rol: string;
    status: number;
};

export type AuthData = {
    token: string;
    rol: string;
    name: string;
    lastName: string;
};
