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

type ColorsType = {
    primary: { hue: number; sat: number; light: number };
    secondary: { hue: number; sat: number; light: number };
};

export type StoreType = {
    name: string;
    colors: ColorsType;
    products: ProductType[];
};
