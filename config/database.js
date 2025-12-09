const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

if (process.env.MYSQL_URL || process.env.DATABASE_URL) {
  // Use connection string if available (Railway often provides MYSQL_URL)
  sequelize = new Sequelize(process.env.MYSQL_URL || process.env.DATABASE_URL, {
    dialect: 'mysql',
    logging: console.log,
    dialectOptions: {
      // SSL is often required for cloud databases
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  });
} else {
  // Fallback to individual parameters
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: 'mysql',
      logging: console.log,
    }
  );
}

module.exports = sequelize;