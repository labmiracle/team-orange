import jwt, { JwtPayload } from "jsonwebtoken";
import { DependencyLifeTime, Injectable } from "@miracledevs/paradigm-web-di";

@Injectable({ lifeTime: DependencyLifeTime.Transient })
export class ProcessToken {
    public verify(token: string) {
        if (!token) throw new Error("Token not found");
        const decodedToken = jwt.verify(token, process.env.SHOPPY__ACCESS_TOKEN) as JwtPayload;
        delete decodedToken.iat;
        delete decodedToken.exp;
        return decodedToken;
    }
    public sign(entity: Record<any, any>) {
        if (!entity) throw new Error("Cannot sign undefined object");
        const token = jwt.sign({ ...entity }, process.env.SHOPPY__ACCESS_TOKEN, { expiresIn: "2d" });
        return token;
    }
}
