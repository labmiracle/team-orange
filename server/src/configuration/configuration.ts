import { MySqlConfiguration } from "./mysql.configuration";

export class Configuration {
    /**
     * Indicates if the application is running in development or production mode.
     */
    development: boolean;

    /**
     * Indicates the server port to bind the server.
     */
    port = 4000;

    /**
     * The mysql connection configuration.
     */
    mysql = new MySqlConfiguration();

    /**
     * Session timeout
     */
    sessionTimeout: string;
}
