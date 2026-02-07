const Joi = require('joi');

/**
 * Validation schemas for email operations
 */
const emailSchemas = {
  sendEmail: Joi.object({
    to: Joi.string().email().required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Recipient email is required'
      }),
    subject: Joi.string().min(5).max(200).required()
      .messages({
        'string.min': 'Subject must be at least 5 characters',
        'string.max': 'Subject must not exceed 200 characters',
        'any.required': 'Subject is required'
      }),
    text: Joi.string().min(10).max(5000)
      .messages({
        'string.min': 'Email text must be at least 10 characters',
        'string.max': 'Email text must not exceed 5000 characters'
      }),
    html: Joi.string().max(10000)
      .messages({
        'string.max': 'Email HTML must not exceed 10000 characters'
      }),
    from: Joi.string().email()
      .messages({
        'string.email': 'From address must be a valid email'
      })
  }).or('text', 'html')
    .messages({
      'object.missing': 'Either text or html content is required'
    })
};

/**
 * Validation middleware
 */
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => detail.message);
      return res.status(400).json({
        error: 'Validation failed',
        details: errors,
        disclaimer: 'This is a simulation for educational purposes only.'
      });
    }

    next();
  };
};

module.exports = {
  emailSchemas,
  validate
};
