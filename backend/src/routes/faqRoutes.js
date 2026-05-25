const express = require('express');
const router = express.Router();
const {
  getFaqs,
  getFaq,
  getPublicFaqs,
} = require('../controllers/faqController');

router.get('/', getPublicFaqs);
router.get('/:id', getFaq);

module.exports = router;
