const express = require("express");
const router = express.Router();
const db = require("../config/db");
const multer = require("multer");
const path = require("path");


// IMAGE UPLOAD SETUP
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
        cb(
            null,
            Date.now() + path.extname(file.originalname)
        );
    },
});

const upload = multer({ storage });


// CREATE BLOG
router.post(
    "/add",
    upload.single("image"),
    async (req, res) => {
        try {

            const {
                title,
                slug,
                description,
                content,
                category,
                meta_title,
                meta_description,
            } = req.body;

            const image_url = req.file
                ? req.file.filename
                : null;

            const sql = `
                INSERT INTO blogs
                (
                    title,
                    slug,
                    description,
                    content,
                    category,
                    image_url,
                    meta_title,
                    meta_description
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;

            await db.query(sql, [
                title,
                slug,
                description,
                content,
                category,
                image_url,
                meta_title,
                meta_description,
            ]);

            res.json({
                success: true,
                message: "Blog Added Successfully",
            });

        } catch (error) {
            console.log(error);

            res.status(500).json({
                success: false,
                message: "Server Error",
            });
        }
    }
);


// GET ALL BLOGS
router.get("/", async (req, res) => {
    try {

        const [blogs] = await db.query(`
            SELECT * FROM blogs
            ORDER BY created_at DESC
        `);

        res.json({
            success: true,
            blogs,
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
});

module.exports = router;