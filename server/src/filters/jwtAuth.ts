import { Injectable, DependencyLifeTime } from "@miracledevs/paradigm-web-di";
import { IFilter, HttpContext } from "@miracledevs/paradigm-express-webapi";
import { UserRepository } from "../repositories/user.repository";
import { ProductDBRepository } from "../repositories/productDB.repository";
import { UserAuth } from "../utils/userInstancer";
import { ProcessToken } from "../utils/processToken";

@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class JWTAuthFilter implements IFilter {
    constructor(private readonly userRepo: UserRepository, private readonly processToken: ProcessToken) {}

    async beforeExecute(httpContext: HttpContext): Promise<void> {
        const token = httpContext.request.header("x-auth");
        const decodedToken = this.processToken.verify(token);
        this.userRepo.setAuth(decodedToken, UserAuth);
    }

    async afterExecute(httpContext: HttpContext): Promise<void> {
        const { email } = this.userRepo.getAuth();
        try {
            const user = await this.userRepo.getById(email);
            delete user.password;
            const token = this.processToken.sign(user);
            httpContext.response.setHeader("x-auth", token);
        } catch {
            httpContext.response.removeHeader("x-auth");
        }
    }
}

@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class isAdminFilter implements IFilter {
    constructor(private readonly userRepo: UserRepository) {}

    async beforeExecute(): Promise<void> {
        const { email } = this.userRepo.getAuth();
        const user = await this.userRepo.getById(email);
        if (user.rol !== "Admin") throw new Error("Unauthorized");
    }
}

@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class isManagerFilter implements IFilter {
    constructor(private readonly userRepo: UserRepository) {}

    async beforeExecute(): Promise<void> {
        const { email } = this.userRepo.getAuth();
        const user = await this.userRepo.getById(email);
        if (user.rol !== "Manager") throw new Error("Unauthorized");
    }
}

/**
 * Check if the user is authorize to modify the product
 */
@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class authProductFilter implements IFilter {
    constructor(private productDBRepo: ProductDBRepository, private readonly userRepo: UserRepository) {}

    async beforeExecute(httpContext: HttpContext): Promise<void> {
        const { email: emailUser } = this.userRepo.getAuth();
        const { id: idProduct } = httpContext.request.body;
        const { productId } = httpContext.request.params;
        const emailManager = await this.productDBRepo.getManager(idProduct ?? productId);
        if (emailManager !== emailUser) throw new Error("Unauthorized Store");
    }
}
