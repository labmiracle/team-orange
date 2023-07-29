import { DependencyLifeTime, Injectable } from "@miracledevs/paradigm-web-di";

@Injectable({ lifeTime: DependencyLifeTime.Transient })
export class Brand {
    id = 0;
    name = "";
}

@Injectable({ lifeTime: DependencyLifeTime.Transient })
export class Category {
    id = 0;
    name = "";
}

@Injectable({ lifeTime: DependencyLifeTime.Transient })
export class Size {
    id = 0;
    name = "";
}

@Injectable({ lifeTime: DependencyLifeTime.Transient })
export class productCategory {
    id? = 0;
    productId = 0;
    categoryId = 0;
}

@Injectable({ lifeTime: DependencyLifeTime.Transient })
export class productSize {
    id? = 0;
    productId = 0;
    sizeId = 0;
}
