import { DependencyLifeTime, Injectable } from "@miracledevs/paradigm-web-di";

@Injectable({ lifeTime: DependencyLifeTime.Transient })
export class Product {
    id = 0;
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
    brandName = "";
}

@Injectable({ lifeTime: DependencyLifeTime.Transient })
export class ProductDB {
    name = "";
    description = "";
    price = 0;
    discountPercentage = 0;
    currentStock = 0;
    reorderPoint = 0;
    minimum = 0;
    storeId = 0;
    brandId = 0;
}
