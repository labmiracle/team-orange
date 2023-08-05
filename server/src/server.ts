import { ApiServer } from "@miracledevs/paradigm-express-webapi";
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "./docs/swagger.json";
import { MySqlConnectionFilter } from "./filters/mysql.filter";
import { HealthController } from "./controllers/health.controller";
import { Configuration } from "./configuration/configuration";
import { ProductController } from "./controllers/product.controller";
import { UserController } from "./controllers/user.controller";
import { StoreController } from "./controllers/store.controller";
import cookieParser from "cookie-parser";
import { CartController } from "./controllers/cart.controller";
import { CheckoutController } from "./controllers/checkout.controller";
import { ErrorFilter } from "./filters/error.filter";
import path from "path";

/**
 * Represents the api server application.
 * It contains the main DI container, the router and express application.
 */
export class Server extends ApiServer {
    /**
     * Configures the server before starting.
     */
    protected configureApplication(): void {
        this.logger.debug("Configuring application...");
        const configuration = this.configurationBuilder.build(Configuration);
        const port = configuration.port || process.env.PORT || 4000;

        this.expressApplication
            .set("etag", false)
            .set("port", port)
            .use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))
            .use(cors({ exposedHeaders: "x-auth" }))
            .use(express.urlencoded({ extended: false }))
            .use(express.json())
            .use(cookieParser())
            .use("/images", express.static("./public"))
            .use(express.static(path.join(__dirname, "../../client/dist")))
            .get("/", (req, res) => res.sendFile(path.join(__dirname, "../../client/dist/index.html")))
            .listen(port, () => this.logger.debug(`Listening on: http://localhost:${port}`));
        this.registerControllers([HealthController, ProductController, UserController, StoreController, CartController, CheckoutController]);
        this.routing.ignoreClosedResponseOnFilters();
        this.routing.registerGlobalFilters([MySqlConnectionFilter, ErrorFilter]);
    }
}
