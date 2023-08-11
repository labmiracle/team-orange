import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

export const createPool = () => {
    return mysql.createPool({
        host: process.env.SHOPPY__MYSQLHOST,
        port: Number(process.env.SHOPPY__MYSQLPORT),
        database: process.env.SHOPPY__MYSQLDATABASE,
        user: process.env.SHOPPY__MYSQLUSER,
        decimalNumbers: true,
        password: process.env.SHOPPY__MYSQLPASSWORD,
    });
};
