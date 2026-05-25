const ContentModel = require('../models/ContentModel');

exports.getPageContent = (req, res) => {
  const { page } = req.params;

  ContentModel.getContentByPage(page, (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Failed to load page content',
        error: err,
      });
    }

    const content = results.reduce((acc, item) => {
      if (!acc[item.section]) {
        acc[item.section] = {};
      }
      acc[item.section][item.key] = item.value;
      return acc;
    }, {});

    res.json({
      success: true,
      page,
      content,
    });
  });
};

exports.updatePageContent = (req, res) => {
  const { page, section } = req.params;
  const data = req.body;

  if (!page || !section) {
    return res.status(400).json({
      success: false,
      message: 'Page and section are required',
    });
  }

  if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Update payload is required',
    });
  }

  ContentModel.bulkUpsertContent(page, section, data, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Failed to save content',
        error: err,
      });
    }

    res.json({
      success: true,
      message: 'Content updated successfully',
      updated: result.affectedRows,
    });
  });
};
