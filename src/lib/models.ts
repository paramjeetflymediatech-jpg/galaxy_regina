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

// 4a. Province Model
export class Province extends Model {
  declare id: number;
  declare name: string;
  declare slug: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}
Province.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(255), allowNull: false },
    slug: { type: DataTypes.STRING(255), allowNull: false, unique: true },
  },
  { sequelize, tableName: 'provinces', underscored: true }
);

// 4b. District Model
export class District extends Model {
  declare id: number;
  declare name: string;
  declare slug: string;
  declare province_id: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}
District.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(255), allowNull: false },
    slug: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    province_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Province, key: 'id' },
      onDelete: 'CASCADE'
    },
    state_id: {
      type: DataTypes.VIRTUAL,
      get() { return this.getDataValue('province_id'); },
      set(value: number) { this.setDataValue('province_id', value); }
    },
  },
  { 
    sequelize, 
    tableName: 'districts', 
    underscored: true,
    hooks: {
      beforeValidate: (district: any) => {
        if (!district.slug && district.name) {
          district.slug = district.name.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
        }
      },
      beforeFind: (options: any) => {
        if (options.where && typeof options.where === 'object' && 'state_id' in options.where) {
          options.where.province_id = options.where.state_id;
          delete options.where.state_id;
        }
      }
    }
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
  declare province_id: number | null;
  declare district_id: number | null;
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
    name: {
      type: DataTypes.VIRTUAL,
      get() { return this.getDataValue('location_name'); },
      set(value: string) { this.setDataValue('location_name', value); }
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
    province_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: Province, key: 'id' },
      onDelete: 'SET NULL'
    },
    state_id: {
      type: DataTypes.VIRTUAL,
      get() { return this.getDataValue('province_id'); },
      set(value: number | null) { this.setDataValue('province_id', value); }
    },
    district_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: District, key: 'id' },
      onDelete: 'SET NULL'
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

// 7. Service Model
export class Service extends Model {
  declare id: number;
  declare title: string;
  declare slug: string;
  declare short_description: string | null;
  declare content: string | null;
  declare icon: string | null;
  declare image_url: string | null;
  declare meta_title: string | null;
  declare meta_description: string | null;
  declare is_active: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}
Service.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING(255), allowNull: false },
    name: {
      type: DataTypes.VIRTUAL,
      get() { return this.getDataValue('title'); },
      set(value: string) { this.setDataValue('title', value); }
    },
    slug: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    short_description: { type: DataTypes.TEXT, allowNull: true },
    description: {
      type: DataTypes.VIRTUAL,
      get() { return this.getDataValue('short_description'); },
      set(value: string) { this.setDataValue('short_description', value); }
    },
    content: { type: DataTypes.TEXT, allowNull: true },
    icon: { type: DataTypes.STRING(100), allowNull: true },
    image_url: { type: DataTypes.STRING(500), allowNull: true },
    meta_title: { type: DataTypes.STRING(255), allowNull: true },
    meta_description: { type: DataTypes.TEXT, allowNull: true },
    faqs: { type: DataTypes.TEXT, allowNull: true },
    is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  },
  { sequelize, tableName: 'services', underscored: true }
);

// Define Relationships for Provinces, Districts, Locations
Province.hasMany(District, { foreignKey: 'province_id', as: 'districts' });
District.belongsTo(Province, { foreignKey: 'province_id', as: 'province' });

Province.hasMany(Location, { foreignKey: 'province_id', as: 'locations' });
Location.belongsTo(Province, { foreignKey: 'province_id', as: 'province' });

District.hasMany(Location, { foreignKey: 'district_id', as: 'locations' });
Location.belongsTo(District, { foreignKey: 'district_id', as: 'district' });

// 8. ServiceLocation Model
export class ServiceLocation extends Model {
  declare id: number;
  declare service_id: number;
  declare location_id: number;
  declare description: string | null;
  declare content: string | null;
  declare faqs: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}
ServiceLocation.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    service_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: Service, key: 'id' }, onDelete: 'CASCADE' },
    location_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: Location, key: 'id' }, onDelete: 'CASCADE' },
    description: { type: DataTypes.TEXT, allowNull: true },
    content: { type: DataTypes.TEXT, allowNull: true },
    faqs: { type: DataTypes.TEXT, allowNull: true },
  },
  { sequelize, tableName: 'service_locations', underscored: true }
);

Service.belongsToMany(Location, { through: ServiceLocation, foreignKey: 'service_id' });
Location.belongsToMany(Service, { through: ServiceLocation, foreignKey: 'location_id' });

// 9. Seo Model
export class Seo extends Model {
  declare id: number;
  declare page_path: string;
  declare title: string | null;
  declare description: string | null;
  declare keywords: string | null;
  declare canonical_url: string | null;
  declare og_title: string | null;
  declare og_description: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}
Seo.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    page_path: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    title: { type: DataTypes.STRING(255), allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    keywords: { type: DataTypes.TEXT, allowNull: true },
    canonical_url: { type: DataTypes.STRING(255), allowNull: true },
    og_title: { type: DataTypes.STRING(255), allowNull: true },
    og_description: { type: DataTypes.TEXT, allowNull: true },
    og_image: { type: DataTypes.STRING(500), allowNull: true },
    header_scripts: { type: DataTypes.TEXT, allowNull: true },
    footer_scripts: { type: DataTypes.TEXT, allowNull: true },
  },
  { sequelize, tableName: 'seos', underscored: true }
);

// Alias Province to State for backward compatibility with import scripts
export const State = Province;

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


