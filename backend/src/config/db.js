const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

(async () => {

    try {

        const connection = await db.getConnection();

        console.log('MySQL Database Connected Successfully');

        // CREATE site_contents TABLE
        const createContentTable = `
            CREATE TABLE IF NOT EXISTS site_contents (
                id INT AUTO_INCREMENT PRIMARY KEY,
                page VARCHAR(100) NOT NULL,
                section VARCHAR(100) NOT NULL,
                \`key\` VARCHAR(100) NOT NULL,
                value TEXT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
                ON UPDATE CURRENT_TIMESTAMP,
                UNIQUE KEY unique_content (page, section, \`key\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `;

        await connection.query(createContentTable);


        // CREATE FAQ TABLE
        const createFaqTable = `
            CREATE TABLE IF NOT EXISTS faqs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                question TEXT NOT NULL,
                answer TEXT NOT NULL,
                locked TINYINT(1) NOT NULL DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
                ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `;

        await connection.query(createFaqTable);

        connection.release();

    } catch (error) {

        console.error('❌ Database Connection Failed:', error.message);

    }

})();

module.exports = db;