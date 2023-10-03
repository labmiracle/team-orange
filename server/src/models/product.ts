import { DependencyLifeTime, Injectable } from "@miracledevs/paradigm-web-di";

export interface ProductInterface {
    /** @IsInt */
    id?: number;
    name: string;
    description: string;
    price: number;
    discountPercentage: number;
    /** @IsInt */
    currentStock: number;
    /** @IsInt */
    reorderPoint: number;
    /** @IsInt */
    minimum: number;
    /** @IsInt */
    storeId?: number;
    categories: string[];
    sizes: string[];
    brand: string;
    url_img: string;
    /** @IsInt */
    status?: number;
}

export interface ProductForCreationInterface {
    name: string;
    brand: string;
    /** @IsInt */
    reorderPoint: number;
    /** @IsInt */
    minimum: number;
    price: number;
    /** @IsInt */
    discountPercentage: number;
    description: string;
    img_file?: File;
    sizes: string;
    categories: string;
    /** @IsInt */
    currentStock: number;
}

export interface ProductSaleInterface extends ProductInterface {
    quantity: number;
    total?: number;
}

@Injectable({ lifeTime: DependencyLifeTime.Transient })
export class Product implements ProductInterface {
    id? = 0;
    name = "";
    description = "";
    price = 0;
    discountPercentage = 0;
    currentStock = 0;
    reorderPoint = 0;
    minimum = 0;
    storeId? = 0;
    categories: string[] = [];
    sizes: string[] = [];
    brand = "";
    url_img = "";
    status? = 1;
}

@Injectable({ lifeTime: DependencyLifeTime.Transient })
export class ProductSale implements ProductInterface {
    id? = 0;
    name = "";
    description = "";
    price = 0;
    discountPercentage = 0;
    currentStock = 0;
    reorderPoint = 0;
    minimum = 0;
    storeId = 0;
    categories: string[] = [];
    sizes: string[] = [];
    brand = "";
    url_img = "";
    status? = 1;
    quantity? = 0;
    total? = 0;
}

export interface ProductDBInterface {
    /**@IsInt */
    id?: number;
    name: string;
    description: string;
    price: number;
    discountPercentage: number;
    /**@IsInt */
    currentStock: number;
    /**@IsInt */
    reorderPoint: number;
    /**@IsInt */
    minimum: number;
    /**@IsInt */
    storeId: number;
    /**@IsInt */
    brandId: number;
    url_img: string;
    /**@IsInt */
    status?: number;
}

@Injectable({ lifeTime: DependencyLifeTime.Transient })
export class ProductDB implements ProductDBInterface {
    id? = 0;
    name = "";
    description = "";
    price = 0;
    discountPercentage = 0;
    currentStock = 0;
    reorderPoint = 0;
    minimum = 0;
    storeId = 0;
    brandId = 0;
    url_img = "";
    status? = 1;
}
