export class MySqlConfiguration {
    /**
     * The database server host address.
     */
    host: string = process.env.SHOPPY__MYSQLHOST;

    /**
     * The database server host address port, if null the default 3306 port will be used.
     */
    port?: number = Number(process.env.SHOPPY__MYSQLPORT);

    /**
     * The name of the database.
     */
    database: string = process.env.SHOPPY__MYSQLDATABASE;

    /**
     * The name of the user.
     */
    user: string = process.env.SHOPPY__MYSQLUSER;

    decimalNumbers = true;
    /**
     * The password of the user.
     */
    password?: string = process.env.SHOPPY__MYSQLPASSWORD;

    /**
     * A connection timeout limit in milliseconds.
     */
    connectTimeout?: number;

    /**
     * The limit of maximum parallel connections at the same time.
     */
    connectionLimit?: number;

    /**
     * Indicates if it should allow multiple statements at the same time.
     */
    multipleStatements?: boolean;
}
