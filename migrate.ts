const { loadEnvConfig } = require('@next/env');
// Load environment variables from .env or .env.local
loadEnvConfig(process.cwd());

async function runMigration() {
  try {
    // Load Sequelize models and sync
    console.log('Loading database models...');
    const { sequelize } = await import('./src/lib/db');
    await import('./src/lib/models'); // Ensure all models are initialized

    console.log('Running database migration (syncing tables with alter: true)...');
    
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
