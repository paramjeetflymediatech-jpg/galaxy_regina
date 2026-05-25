const db = require('../config/db');

const Quote = {

    create: (data, callback) => {

        const sql = `
            INSERT INTO quotes 
            (
                full_name,
                email,
                mobile,
                move_type,
                pickup_address,
                dropoff_address,
                moving_date,
                comments
            ) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(sql, [
            data.full_name,
            data.email,
            data.mobile,
            data.move_type,
            data.pickup_address,
            data.dropoff_address,
            data.moving_date,
            data.comments
        ], callback);
    },

    getAll: (callback) => {
        db.query(
            'SELECT * FROM quotes ORDER BY created_at DESC',
            callback
        );
    },

    updateStatus: (id, status, callback) => {
        db.query(
            'UPDATE quotes SET status = ? WHERE id = ?',
            [status, id],
            callback
        );
    }
    ,
    delete: (id, callback) => {

    db.query(
        'DELETE FROM quotes WHERE id = ?',
        [id],
        callback
    );

}
};

module.exports = Quote;