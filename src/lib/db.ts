import { Sequelize } from 'sequelize';
// @ts-ignore
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

// Custom global type expansion for Node.js global context to prevent type errors in typescript
declare global {
  var sequelize: Sequelize | undefined;
}

const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306;

function sanitizeDatabaseUrl(url: string | undefined): string | undefined {
  if (!url) return url;
  return url.replace(/\\%/g, '%');
}

const databaseUrl = sanitizeDatabaseUrl(process.env.DATABASE_URL);
console.log(databaseUrl,'irl')
if (!databaseUrl && (!dbName || !dbUser)) {
  // If variables aren't loaded yet (e.g. at compile time), we still want to avoid crashing
  // But we will print a warning. In runtime they must be loaded.
  console.warn('⚠️ Database connection string (DATABASE_URL) or legacy variables (DB_NAME/DB_USER) are not set.');
}

let sequelize: Sequelize;

const isProduction = process.env.NODE_ENV === 'production';

const dialectOptions = {
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
};

if (databaseUrl) {
  if (isProduction) {
    sequelize = new Sequelize(databaseUrl, {
      dialect: 'postgres',
      dialectModule: pg,
      logging: false,
      dialectOptions,
      define: { timestamps: true, underscored: true },
    });
  } else {
    if (!global.sequelize) {
      global.sequelize = new Sequelize(databaseUrl, {
        dialect: 'postgres',
        dialectModule: pg,
        logging: console.log,
        dialectOptions,
        define: { timestamps: true, underscored: true },
      });
    }
    sequelize = global.sequelize;
  }
} else {
  if (isProduction) {
    sequelize = new Sequelize(
      dbName || 'galaxy_regina',
      dbUser || 'root',
      dbPassword || 'root',
      {
        host: dbHost,
        port: dbPort,
        dialect: 'postgres',
        dialectModule: pg,
        logging: false,
        dialectOptions,
        define: {
          timestamps: true,
          underscored: true,
        },
      }
    );
  } else {
    if (!global.sequelize) {
      global.sequelize = new Sequelize(
        dbName || 'galaxy_regina',
        dbUser || 'root',
        dbPassword || 'root',
        {
          host: dbHost,
          port: dbPort,
          dialect: 'postgres',
          dialectModule: pg,
          logging: console.log,
          dialectOptions,
          define: {
            timestamps: true,
            underscored: true,
          },
        }
      );
    }
    sequelize = global.sequelize;
  }
}

export async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Sequelize: Database connection has been established successfully.');
  } catch (error) {
    console.error('❌ Sequelize: Unable to connect to the database:', error);
  }
}

export { sequelize };
