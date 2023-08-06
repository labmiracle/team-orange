import { Injectable, DependencyLifeTime } from "@miracledevs/paradigm-web-di";
import { IFilter, HttpContext } from "@miracledevs/paradigm-express-webapi";

@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class ErrorFilter implements IFilter {
    
}
