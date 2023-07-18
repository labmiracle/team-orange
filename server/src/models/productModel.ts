export interface Product {
    name: string;
    description: string;
    price: number;
    discountPercentage: number;
    currentStock: number;
    reorderPoint: number;
    minimum: number;
    brandId: string;
    url_img: string;
    storeId: number;
}

export interface ResponseProduct extends Product {
    categories: string[];
    sizes: string[];
    brandName: string;
}
