const express = require('express');

const router = express.Router();

const {
    loginAdmin,
    signupAdmin
} = require('../controllers/adminController');
const {
    getFaqs,
    getFaq,
    createFaq,
    updateFaq,
    setFaqLock,
    deleteFaq,
} = require('../controllers/faqController');

router.post('/login', loginAdmin);
router.post('/signup', signupAdmin);

router.get('/faqs', getFaqs);
router.get('/faqs/:id', getFaq);
router.post('/faqs', createFaq);
router.put('/faqs/:id', updateFaq);
router.patch('/faqs/:id/lock', setFaqLock);
router.delete('/faqs/:id', deleteFaq);

module.exports = router;