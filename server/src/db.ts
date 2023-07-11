import { createPool } from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const poolOptions = {
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    host: process.env.MYSQLHOST,
    database: process.env.MYSQLDATABASE,
    port: Number(process.env.MYSQLPORT),
};

export const pool = createPool(poolOptions);
