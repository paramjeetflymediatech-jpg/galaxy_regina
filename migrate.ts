const { loadEnvConfig } = require('@next/env');
// Load environment variables from .env or .env.local
loadEnvConfig(process.cwd());

const mysql = require('mysql2/promise');

async function runMigration() {
  const dbHost = process.env.DB_HOST || 'localhost';
  const dbUser = process.env.DB_USER || 'root';
  const dbPassword = process.env.DB_PASSWORD || '';
  const dbName = process.env.DB_NAME || 'galaxy_regina';
  const dbPort = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306;

  try {
    // 1. Connect without database to create it if it doesn't exist
    console.log(`Connecting to MySQL at ${dbHost}:${dbPort} as ${dbUser}...`);
    const connection = await mysql.createConnection({
      host: dbHost,
      user: dbUser,
      password: dbPassword,
      port: dbPort
    });

    console.log(`Ensuring database '${dbName}' exists...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await connection.end();
    console.log(`✅ Database '${dbName}' is ready.`);

    // 2. Load Sequelize models and sync
    console.log('Loading database models...');
    const { sequelize } = await import('./src/lib/db');
    await import('./src/lib/models'); // Ensure all models are initialized

    console.log('Running database migration (syncing tables with alter: true)...');
    
    // Workaround for Sequelize bug: drop the index first so it doesn't throw "Duplicate key name"
    try {
      await sequelize.query('ALTER TABLE `site_contents` DROP INDEX `unique_content`;');
    } catch (e) {
      // Ignore if index doesn't exist
    }

    // Using alter: true will check the current state of the table in the database 
    // and perform necessary changes to match the defined models.
    await sequelize.sync({ alter: true });
    console.log('✅ Migration completed successfully! Tables are up-to-date with your models.');
    
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
