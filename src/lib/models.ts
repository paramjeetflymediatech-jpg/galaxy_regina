import { DataTypes, Model } from 'sequelize';
import { sequelize, testConnection } from './db';

// 1. Admin Model
export class Admin extends Model {
  declare id: number;
  declare name: string;
  declare email: string;
  declare password: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}
Admin.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'admins',
    underscored: true,
  }
);

// 2. Blog Model
export class Blog extends Model {
  declare id: number;
  declare title: string;
  declare slug: string;
  declare description: string | null;
  declare content: string | null;
  declare category: string | null;
  declare image_url: string | null;
  declare meta_title: string | null;
  declare meta_description: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}
Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    image_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    meta_title: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    meta_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'blogs',
    underscored: true,
  }
);

// 3. Faq Model
export class Faq extends Model {
  declare id: number;
  declare question: string;
  declare answer: string;
  declare locked: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}
Faq.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    question: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    answer: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    locked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'faqs',
    underscored: true,
  }
);

// 4. Quote Model
export class Quote extends Model {
  declare id: number;
  declare full_name: string;
  declare email: string | null;
  declare mobile: string | null;
  declare move_type: string | null;
  declare pickup_address: string | null;
  declare dropoff_address: string | null;
  declare moving_date: string | null;
  declare comments: string | null;
  declare status: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}
Quote.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    full_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    mobile: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    move_type: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    pickup_address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    dropoff_address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    moving_date: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    comments: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'pending',
    },
  },
  {
    sequelize,
    tableName: 'quotes',
    underscored: true,
  }
);

// 5. Location Model
export class Location extends Model {
  declare id: number;
  declare location_name: string;
  declare slug: string;
  declare hero_title: string | null;
  declare hero_subtitle: string | null;
  declare content: string | null;
  declare meta_title: string | null;
  declare meta_description: string | null;
  declare meta_keywords: string | null;
  declare image_url: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}
Location.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    location_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    hero_title: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    hero_subtitle: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    meta_title: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    meta_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    meta_keywords: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    image_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'locations',
    underscored: true,
  }
);

// 6. Content Model
export class Content extends Model {
  declare id: number;
  declare page: string;
  declare section: string;
  declare key: string;
  declare value: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}
Content.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    page: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    section: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    key: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    value: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'site_contents',
    underscored: true,
    indexes: [
      {
        unique: true,
        name: 'unique_content',
        fields: ['page', 'section', 'key'],
      },
    ],
  }
);

// Auto-sync database helper (synchronized inside runtime connection checks)
export async function syncDatabase() {
  try {
    // In production, we'd normally use migrations, but for simple app development, sync() is extremely useful and handles schema creation.
    await sequelize.sync();
    console.log('✅ Sequelize: Database schema synchronized successfully.');
  } catch (error) {
    console.error('❌ Sequelize: Error synchronizing database schema:', error);
  }
}

// Run database initialization in the background on module load
(async () => {
  try {
    await testConnection();
    await syncDatabase();
  } catch (error) {
    console.error('❌ Sequelize: Fatal error during database initialization:', error);
  }
})();


