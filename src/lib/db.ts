import { Sequelize } from 'sequelize';

// Custom global type expansion for Node.js global context to prevent type errors in typescript
declare global {
  var sequelize: Sequelize | undefined;
}

const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306;

if (!dbName || !dbUser) {
  // If variables aren't loaded yet (e.g. at compile time), we still want to avoid crashing
  // But we will print a warning. In runtime they must be loaded.
  console.warn('⚠️ Database environment variables DB_NAME or DB_USER are not set.');
}

let sequelize: Sequelize;

if (process.env.NODE_ENV === 'production') {
  sequelize = new Sequelize(
    dbName || 'galaxy_regina',
    dbUser || 'root',
    dbPassword || 'root',
    {
      host: dbHost,
      port: dbPort,
      dialect: 'mysql',
      logging: false,
      define: {
        timestamps: true,
        underscored: true, // This maps camelCase fields like createdAt/updatedAt to created_at/updated_at automatically
      },
    }
  );
} else {
  // Prevent multiple connections during Next.js hot reloading
  if (!global.sequelize) {
    global.sequelize = new Sequelize(
      dbName || 'galaxy_regina',
      dbUser || 'root',
      dbPassword || 'root',
      {
        host: dbHost,
        port: dbPort,
        dialect: 'mysql',
        logging: console.log,
        define: {
          timestamps: true,
          underscored: true,
        },
      }
    );
  }
  sequelize = global.sequelize;
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
