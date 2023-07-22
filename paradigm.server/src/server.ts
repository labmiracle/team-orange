import { ApiServer } from "@miracledevs/paradigm-express-webapi";
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import path from "path";
import * as swaggerDocument from "./docs/swagger.json";
import { MySqlConnectionFilter } from "./filters/mysql.filter";
import { HealthController } from "./controllers/health.controller";
import { Configuration } from "./configuration/configuration";
import { ProductController } from "./controllers/product.controller";
import { UserController } from "./controllers/user.controller";
import { StoreController } from "./controllers/store.controller";

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
        const port = configuration.port || process.env.PORT || 5000;

        this.expressApplication
            .set("etag", false)
            .set("port", port)
            .use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))
            .use(cors({ exposedHeaders: "x-auth" }))
            .use(express.urlencoded({ extended: false }))
            .use(express.json())
            .use("/", express.static(path.join(__dirname, "/assets")))
            .listen(port, () => this.logger.debug(`Listening on: http://localhost:${port}`));

        this.registerControllers([HealthController, ProductController, UserController, StoreController]);
        this.routing.ignoreClosedResponseOnFilters();
        this.routing.registerGlobalFilters([MySqlConnectionFilter]);
    }
}
