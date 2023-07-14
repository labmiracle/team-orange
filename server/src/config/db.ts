export const dbconfig = {
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  host: process.env.MYSQLHOST,
  database: process.env.MYSQLDATABASE,
  port: Number(process.env.MYSQLPORT),
};