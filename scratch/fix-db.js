const mysql = require('mysql2/promise');
const { loadEnvConfig } = require('@next/env');
loadEnvConfig(process.cwd());

async function fix() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'galaxy_regina',
            port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306
        });

        console.log("Connected. Altering table...");
        
        try {
            await connection.query('ALTER TABLE `locations` ADD COLUMN `province_id` INTEGER NULL;');
            console.log("Added province_id");
        } catch (e) { console.log(e.message); }

        try {
            await connection.query('ALTER TABLE `locations` ADD COLUMN `district_id` INTEGER NULL;');
            console.log("Added district_id");
        } catch (e) { console.log(e.message); }

        await connection.end();
        console.log("Done");
    } catch (e) {
        console.error(e);
    }
}
fix();
