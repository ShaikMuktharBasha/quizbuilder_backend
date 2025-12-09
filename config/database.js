const { Sequelize } = require('sequelize');
require('dotenv').config();

const dbConfig = {
  dialect: 'mysql',
  dialectModule: require('mysql2'), // Ensure mysql2 is used
  logging: false, // Set to console.log to see SQL queries
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
    acquire: 30000
  },
  dialectOptions: {
    // SSL configuration for cloud databases (Railway, etc.)
    ssl: {
      require: true,
      rejectUnauthorized: false 
    }
  },
  define: {
    timestamps: true
  }
};

let sequelize;

if (process.env.MYSQL_URL || process.env.DATABASE_URL) {
  console.log('Connecting to database using connection string...');
  sequelize = new Sequelize(process.env.MYSQL_URL || process.env.DATABASE_URL, dbConfig);
} else {
  console.log('Connecting to database using individual parameters...');
  sequelize = new Sequelize(
    process.env.DB_NAME || process.env.MYSQLDATABASE,
    process.env.DB_USER || process.env.MYSQLUSER,
    process.env.DB_PASSWORD || process.env.MYSQLPASSWORD,
    {
      ...dbConfig,
      host: process.env.DB_HOST || process.env.MYSQLHOST,
      port: Number(process.env.DB_PORT || process.env.MYSQLPORT || 3306),
    }
  );
}

module.exports = sequelize;