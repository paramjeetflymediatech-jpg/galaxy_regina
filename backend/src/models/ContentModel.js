const db = require('../config/db');

const ContentModel = {
  getContentByPage: (page, callback) => {
    const query = `
      SELECT page, section, \`key\`, value
      FROM site_contents
      WHERE page = ?
    `;

    db.query(query, [page], callback);
  },

  bulkUpsertContent: (page, section, data, callback) => {
    const rows = Object.entries(data).map(([key, value]) => [
      page,
      section,
      key,
      value,
    ]);

    if (rows.length === 0) {
      return callback(null, { affectedRows: 0 });
    }

    const query = `
      INSERT INTO site_contents (page, section, \`key\`, value)
      VALUES ?
      ON DUPLICATE KEY UPDATE value = VALUES(value)
    `;

    db.query(query, [rows], callback);
  },
};

module.exports = ContentModel;