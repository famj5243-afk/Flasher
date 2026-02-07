const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');
const { validate, emailSchemas } = require('../utils/validation');

/**
 * @route   POST /api/emails/send
 * @desc    Send a simulated educational email
 * @access  Public (with rate limiting)
 */
router.post('/send', validate(emailSchemas.sendEmail), emailController.sendEmail);

/**
 * @route   GET /api/emails/status
 * @desc    Get email service status
 * @access  Public
 */
router.get('/status', emailController.getStatus);

module.exports = router;
