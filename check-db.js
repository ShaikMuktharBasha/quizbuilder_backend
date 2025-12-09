const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
  console.log('Starting connection test...');
  console.log('Host:', process.env.DB_HOST || process.env.MYSQLHOST);
  console.log('User:', process.env.DB_USER || process.env.MYSQLUSER);
  console.log('Port:', process.env.DB_PORT || process.env.MYSQLPORT || 3306);
  
  try {
    const connectionParams = {
      host: process.env.DB_HOST || process.env.MYSQLHOST,
      user: process.env.DB_USER || process.env.MYSQLUSER,
      password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD,
      database: process.env.DB_NAME || process.env.MYSQLDATABASE,
      port: Number(process.env.DB_PORT || process.env.MYSQLPORT || 3306),
      connectTimeout: 10000,
      ssl: {
        rejectUnauthorized: false
      }
    };

    // If using URL
    if (process.env.MYSQL_URL) {
        console.log('Using MYSQL_URL for connection test');
    }

    const conn = process.env.MYSQL_URL 
        ? await mysql.createConnection(process.env.MYSQL_URL)
        : await mysql.createConnection(connectionParams);

    console.log('mysql2 connect: OK');
    await conn.end();
    process.exit(0);
  } catch (e) {
    console.error('mysql2 connect FAILED:', e.code || e.message, e);
    process.exit(1);
  }
})();
