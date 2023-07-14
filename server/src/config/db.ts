export const dbconfig = {
  user: process.env.MYSQLUSER || "root",
  password: process.env.MYSQLPASSWORD || "shoppy-teamorange4",
  host: process.env.MYSQLHOST || "127.0.0.1",
  database: process.env.MYSQLDATABASE || "shoppy",
  port: Number(process.env.MYSQLPORT) || 3306,
};