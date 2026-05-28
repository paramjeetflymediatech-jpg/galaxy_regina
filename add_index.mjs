import 'dotenv/config';
import { sequelize } from './src/lib/db.js';

try {
  await sequelize.authenticate();
  console.log('Connected.');

  // First, remove duplicate rows keeping only the latest id per (service_id, location_id)
  await sequelize.query(`
    DELETE FROM service_locations
    WHERE id NOT IN (
      SELECT MAX(id)
      FROM service_locations
      GROUP BY service_id, location_id
    );
  `);
  console.log('Duplicates removed.');

  // Now create the unique index
  await sequelize.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS unique_service_location
    ON service_locations (service_id, location_id);
  `);
  console.log('✅ Unique index created on service_locations(service_id, location_id)');
  process.exit(0);
} catch (err) {
  console.error('❌ Error:', err.message);
  process.exit(1);
}
