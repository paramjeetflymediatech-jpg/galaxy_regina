import { sequelize } from './src/lib/db';
import { Location, Service } from './src/lib/models';

async function checkQuery() {
  try {
    await sequelize.authenticate();
    const location = await Location.findOne({
      where: { slug: 'abbey' },
      include: [
        {
          model: Service,
          where: { slug: 'antique-and-art-movers' },
          required: false,
          through: { attributes: ['content', 'faqs', 'description'] }
        }
      ]
    });

    if (!location) {
      console.log('Location not found!');
      return;
    }

    const locJson = location.toJSON();
    if (locJson.Services && locJson.Services.length > 0) {
      const firstService = locJson.Services[0];
      console.log('Service keys:', Object.keys(firstService));
      for (const k of Object.keys(firstService)) {
        if (k.toLowerCase().includes('location')) {
          console.log(`Matched key: "${k}"`, typeof firstService[k]);
        }
      }
    } else {
      console.log('No services found in include!');
    }

  } catch (err) {
    console.error('Error during query:', err);
  } finally {
    await sequelize.close();
  }
}

checkQuery();
