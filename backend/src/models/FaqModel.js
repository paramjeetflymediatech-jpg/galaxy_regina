const db = require('../config/db');

const FaqModel = {

  // GET ALL FAQS
  getAllFaqs: async () => {

    const [rows] = await db.query(`
      SELECT id, question, answer, locked, created_at, updated_at
      FROM faqs
      ORDER BY created_at DESC
    `);

    return rows;
  },

  // GET BY ID
  getFaqById: async (id) => {

    const [rows] = await db.query(`
      SELECT id, question, answer, locked, created_at, updated_at
      FROM faqs
      WHERE id = ?
      LIMIT 1
    `, [id]);

    return rows[0];
  },

  // GET VISIBLE FAQS
  getVisibleFaqs: async () => {

    const [rows] = await db.query(`
      SELECT id, question, answer, locked, created_at, updated_at
      FROM faqs
      WHERE locked = 0
      ORDER BY created_at DESC
    `);

    return rows;
  },

  // CREATE FAQ
  createFaq: async (data) => {

    const [result] = await db.query(
      `INSERT INTO faqs (question, answer, locked)
       VALUES (?, ?, ?)`,
      [
        data.question,
        data.answer,
        data.locked ? 1 : 0
      ]
    );

    return result;
  },

  // UPDATE FAQ
  updateFaq: async (id, data) => {

    const fields = [];
    const values = [];

    if (typeof data.question === 'string') {
      fields.push('question = ?');
      values.push(data.question);
    }

    if (typeof data.answer === 'string') {
      fields.push('answer = ?');
      values.push(data.answer);
    }

    if (typeof data.locked !== 'undefined') {
      fields.push('locked = ?');
      values.push(data.locked ? 1 : 0);
    }

    if (fields.length === 0) {
      return { affectedRows: 0 };
    }

    const sql = `
      UPDATE faqs
      SET ${fields.join(', ')}
      WHERE id = ?
    `;

    values.push(id);

    const [result] = await db.query(sql, values);

    return result;
  },

  // DELETE FAQ
  deleteFaq: async (id) => {

    const [result] = await db.query(
      `DELETE FROM faqs WHERE id = ?`,
      [id]
    );

    return result;
  }

};

module.exports = FaqModel;