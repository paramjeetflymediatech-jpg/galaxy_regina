const { loadEnvConfig } = require('@next/env');
// Load environment variables from .env.local
loadEnvConfig(process.cwd());

const bcrypt = require('bcryptjs');

async function setupAndCreateAdmin() {
  const args = process.argv.slice(2);
  const email = args[0] || 'admin@galaxy.com';
  const password = args[1] || 'Admin@123';
  const name = args[2] || 'Galaxy Admin';

  try {
    // 1. Load Sequelize models and sync
    const { sequelize } = require('./src/lib/db');
    const { Admin } = require('./src/lib/models');

    console.log('Syncing database tables...');
    await sequelize.sync();
    console.log('✅ Tables synchronized.');

    // 2. Create the admin user
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
