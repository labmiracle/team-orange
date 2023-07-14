export as namespace Types;

export type ProductType = {
    id: number;
    name: string;
    brand: string;
    category: string;
    color: string;
    stock: number;
    price: number;
    discount: number;
    description: string;
    url_img: string;
    size: "Hombre" | "Mujer" | "Niños";
};

export type Color = { hue: number; sat: number; light: number };

export type ColorsType = {
    primary: Color;
    secondary: Color;
};

export type StoreType = {
    name: string;
    colors: ColorsType;
    products: ProductType[];
};

export type setFilterType = ({ type, size }: { type?: string; size?: string }) => void;
