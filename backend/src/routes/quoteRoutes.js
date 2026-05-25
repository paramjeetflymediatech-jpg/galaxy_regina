const express = require('express');
const router = express.Router();
const { submitQuote, getAllQuotes, updateQuoteStatus ,deleteQuote} = require('../controllers/quoteController');


router.post('/submit', submitQuote);


router.get('/all', getAllQuotes);                    
router.put('/status/:id', updateQuoteStatus);      
router.delete('/delete/:id', deleteQuote);  


router.get('/:id', (req, res) => {

    res.status(501).json({ message: "Not implemented yet" });
});

module.exports = router;