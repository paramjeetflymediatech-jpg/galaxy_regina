import fs from 'fs';
import path from 'path';
import { Service } from './src/lib/models';
import { testConnection } from './src/lib/db';

async function seedServices() {
  try {
    await testConnection();
    
    const servicesPath = path.join(process.cwd(), 'services.json');
    const fileData = fs.readFileSync(servicesPath, 'utf-8');
    const services = JSON.parse(fileData);

    console.log(`Found ${services.length} services to insert.`);

    for (const service of services) {
      // Use findOrCreate to avoid duplicates if run multiple times
      const [record, created] = await Service.findOrCreate({
        where: { slug: service.slug },
        defaults: service
      });
      
      if (created) {
        console.log(`✅ Created service: ${service.title}`);
      } else {
        console.log(`ℹ️ Service already exists: ${service.title}`);
      }
    }

    console.log('🎉 Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding services:', error);
    process.exit(1);
  }
}

seedServices();
