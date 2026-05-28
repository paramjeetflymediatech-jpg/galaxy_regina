import 'dotenv/config';
import { sequelize } from './src/lib/db';

async function run() {
  try {
    await sequelize.authenticate();
    console.log('Connected.');

    // Remove duplicate rows keeping only the latest id per (service_id, location_id)
    const [, deleteMeta] = await sequelize.query(`
      DELETE FROM service_locations
      WHERE id NOT IN (
        SELECT MAX(id)
        FROM service_locations
        GROUP BY service_id, location_id
      )
    `);
    console.log('Duplicates removed.');

    // Create the unique index
    await sequelize.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS unique_service_location
      ON service_locations (service_id, location_id)
    `);
    console.log('✅ Unique index created on service_locations(service_id, location_id)');
    process.exit(0);
  } catch (err: any) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

run();
