const { loadEnvConfig } = require('@next/env');
// Load environment variables from .env.local
loadEnvConfig(process.cwd());

const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function setupAndCreateAdmin() {
  const dbHost = process.env.DB_HOST || 'localhost';
  const dbUser = process.env.DB_USER || 'root';
  const dbPassword = process.env.DB_PASSWORD || '';
  const dbName = process.env.DB_NAME || 'galaxy_regina';
  const dbPort = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306;

  const args = process.argv.slice(2);
  const email = args[0] || 'admin@galaxy.com';
  const password = args[1] || 'Admin@123';
  const name = args[2] || 'Galaxy Admin';

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

    // 2. Now load Sequelize models and sync
    const { sequelize } = require('./src/lib/db');
    const { Admin } = require('./src/lib/models');

    console.log('Syncing database tables...');
    await sequelize.sync();
    console.log('✅ Tables synchronized.');

    // 3. Create the admin user
    const existing = await Admin.findOne({ where: { email } });
    if (existing) {
      console.log(`⚠️ Admin with email '${email}' already exists!`);
    } else {
      const hashedPassword = bcrypt.hashSync(password, 10);
      await Admin.create({
        name,
        email,
        password: hashedPassword
      });
      console.log('---------------------------------------------');
      console.log('✅ Admin Account Created Successfully!');
      console.log(`Email: ${email}`);
      console.log(`Password: ${password}`);
      console.log(`Name: ${name}`);
      console.log('---------------------------------------------');
    }
    
    await sequelize.close();
  } catch (error) {
    console.error('❌ Error during setup:', error);
  }
}

setupAndCreateAdmin();
