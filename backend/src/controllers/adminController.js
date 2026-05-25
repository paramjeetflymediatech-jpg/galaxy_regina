const db = require('../config/db');
const bcrypt = require('bcryptjs');

const loginAdmin = (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email and password are required'
        });
    }

    const sql = `
        SELECT * FROM admins
        WHERE email = ?
    `;

    db.query(
        sql,
        [email],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            if (result.length === 0) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            const admin = result[0];
            const storedPassword = admin.password;

            const verifyPassword = async () => {
                if (storedPassword.startsWith('$2a$') || storedPassword.startsWith('$2b$') || storedPassword.startsWith('$2y$')) {
                    return bcrypt.compare(password, storedPassword);
                }
                return storedPassword === password;
            };

            verifyPassword().then((match) => {
                if (!match) {
                    return res.status(401).json({
                        success: false,
                        message: 'Invalid credentials'
                    });
                }

                const safeAdmin = { ...admin };
                delete safeAdmin.password;

                res.json({
                    success: true,
                    message: 'Login successful',
                    admin: safeAdmin
                });
            }).catch((bcryptError) => {
                return res.status(500).json({
                    success: false,
                    message: bcryptError.message
                });
            });
        }
    );
};

const signupAdmin = (req, res) => {

    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
        return res.status(400).json({
            success: false,
            message: 'Name, email, password and confirm password are required'
        });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message: 'Passwords do not match'
        });
    }

    const checkSql = `
        SELECT * FROM admins
        WHERE email = ?
    `;

    db.query(checkSql, [email], (checkErr, checkResult) => {
        if (checkErr) {
            return res.status(500).json({
                success: false,
                message: 'Database error',
                error: checkErr,
            });
        }

        if (checkResult.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Admin with this email already exists'
            });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const insertSql = `
            INSERT INTO admins
            (name, email, password)
            VALUES (?, ?, ?)
        `;

        db.query(insertSql, [name, email, hashedPassword], (insertErr, insertResult) => {
            if (insertErr) {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to register admin',
                    error: insertErr,
                });
            }

            res.status(201).json({
                success: true,
                message: 'Admin account created successfully'
            });
        });
    });
};

module.exports = {
    loginAdmin,
    signupAdmin
};