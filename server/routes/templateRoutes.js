const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController');

/**
 * @route   GET /api/templates
 * @desc    Get all available email templates
 * @access  Public
 */
router.get('/', templateController.getAllTemplates);

/**
 * @route   GET /api/templates/:id
 * @desc    Get a specific template by ID
 * @access  Public
 */
router.get('/:id', templateController.getTemplate);

/**
 * @route   POST /api/templates/:id/render
 * @desc    Render a template with provided variables
 * @access  Public
 */
router.post('/:id/render', templateController.renderTemplate);

module.exports = router;
