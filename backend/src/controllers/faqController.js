const FaqModel = require('../models/FaqModel');

exports.getFaqs = (req, res) => {
  FaqModel.getAllFaqs((err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Failed to load FAQs',
        error: err,
      });
    }

    res.json({
      success: true,
      faqs: results,
    });
  });
};

exports.getFaq = (req, res) => {
  const { id } = req.params;

  FaqModel.getFaqById(id, (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Failed to load FAQ',
        error: err,
      });
    }

    if (!results || results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found',
      });
    }

    res.json({
      success: true,
      faq: results[0],
    });
  });
};

exports.getPublicFaqs = (req, res) => {
  FaqModel.getVisibleFaqs((err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Failed to load FAQs',
        error: err,
      });
    }

    res.json({
      success: true,
      faqs: results,
    });
  });
};

exports.createFaq = (req, res) => {
  const { question, answer } = req.body;

  if (!question || !answer) {
    return res.status(400).json({
      success: false,
      message: 'Question and answer are required',
    });
  }

  FaqModel.createFaq({ question, answer, locked: false }, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create FAQ',
        error: err,
      });
    }

    res.status(201).json({
      success: true,
      message: 'FAQ created successfully',
      faqId: result.insertId,
    });
  });
};

exports.updateFaq = (req, res) => {
  const { id } = req.params;
  const { question, answer } = req.body;

  if (!question && !answer) {
    return res.status(400).json({
      success: false,
      message: 'Question or answer must be provided to update',
    });
  }

  FaqModel.updateFaq(id, { question, answer }, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update FAQ',
        error: err,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found',
      });
    }

    res.json({
      success: true,
      message: 'FAQ updated successfully',
    });
  });
};

exports.setFaqLock = (req, res) => {
  const { id } = req.params;
  const { locked } = req.body;

  if (typeof locked === 'undefined') {
    return res.status(400).json({
      success: false,
      message: 'Locked value is required',
    });
  }

  FaqModel.updateFaq(id, { locked }, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update FAQ lock state',
        error: err,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found',
      });
    }

    res.json({
      success: true,
      message: `FAQ has been ${locked ? 'locked' : 'unlocked'} successfully`,
    });
  });
};

exports.deleteFaq = (req, res) => {
  const { id } = req.params;

  FaqModel.deleteFaq(id, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete FAQ',
        error: err,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found',
      });
    }

    res.json({
      success: true,
      message: 'FAQ deleted successfully',
    });
  });
};
