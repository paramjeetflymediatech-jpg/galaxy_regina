const Quote = require('../models/Quote');

const submitQuote = (req, res) => {
    Quote.create(req.body, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "Server Error" });
        }
        res.status(201).json({ 
            success: true, 
            message: "Quote submitted successfully!",
            id: result.insertId 
        });
    });
};

const getAllQuotes = (req, res) => {
    Quote.getAll((err, results) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, data: results });
    });
};

const updateQuoteStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    Quote.updateStatus(id, status, (err) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, message: "Status updated successfully" });
    });
};
const deleteQuote = (req, res) => {

    const { id } = req.params;

    Quote.delete(id, (err) => {

        if (err) {

            return res.status(500).json({
                success: false,
                message: err.message
            });

        }

        res.json({
            success: true,
            message: 'Quote deleted successfully'
        });

    });
};

module.exports = { submitQuote, getAllQuotes, updateQuoteStatus, deleteQuote };