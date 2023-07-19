export interface Product {
    name: string;
    description: string;
    price: number;
    discountPercentage: number;
    currentStock: number;
    reorderPoint: number;
    minimum: number;
    brandId: string;
    storeId: number;
}

export interface ResponseProduct extends Omit<Product, "brandId"> {
    categories: string[];
    sizes: string[];
    brandName: string;
}
