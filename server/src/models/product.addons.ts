import { DependencyLifeTime, Injectable } from "@miracledevs/paradigm-web-di";

@Injectable({ lifeTime: DependencyLifeTime.Transient })
export class Brand {
    /** @IsInt */
    id? = 0;
    name = "";
}

@Injectable({ lifeTime: DependencyLifeTime.Transient })
export class Category {
    /** @IsInt */
    id? = 0;
    name = "";
}

@Injectable({ lifeTime: DependencyLifeTime.Transient })
export class Size {
    /** @IsInt */
    id? = 0;
    name = "";
}

@Injectable({ lifeTime: DependencyLifeTime.Transient })
export class productCategory {
    /** @IsInt */
    id? = 0;
    /** @IsInt */
    productId = 0;
    /** @IsInt */
    categoryId = 0;
}

@Injectable({ lifeTime: DependencyLifeTime.Transient })
export class productSize {
    /** @IsInt */
    id? = 0;
    /** @IsInt */
    productId = 0;
    /** @IsInt */
    sizeId = 0;
}
