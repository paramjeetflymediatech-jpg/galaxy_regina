const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');

router.get('/page/:page', contentController.getPageContent);
router.put('/page/:page/:section', contentController.updatePageContent);

module.exports = router;
