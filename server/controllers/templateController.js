const { templates, renderTemplate } = require('../templates/emailTemplates');

/**
 * Template Controller - Manages email templates
 */
class TemplateController {
  /**
   * Get all available templates
   */
  async getAllTemplates(req, res) {
    try {
      const templateList = Object.values(templates).map(template => ({
        id: template.id,
        name: template.name,
        description: template.description
      }));

      res.json({
        message: 'Available educational email templates',
        templates: templateList,
        disclaimer: 'This is a simulation for educational purposes only.'
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        disclaimer: 'This is a simulation for educational purposes only.'
      });
    }
  }

  /**
   * Get a specific template by ID
   */
  async getTemplate(req, res) {
    try {
      const { id } = req.params;
      const template = templates[id];

      if (!template) {
        return res.status(404).json({
          error: 'Template not found',
          availableTemplates: Object.keys(templates),
          disclaimer: 'This is a simulation for educational purposes only.'
        });
      }

      res.json({
        message: 'Template retrieved successfully',
        template: template,
        disclaimer: 'This is a simulation for educational purposes only.'
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        disclaimer: 'This is a simulation for educational purposes only.'
      });
    }
  }

  /**
   * Render a template with variables
   */
  async renderTemplate(req, res) {
    try {
      const { id } = req.params;
      const variables = req.body;

      const template = templates[id];

      if (!template) {
        return res.status(404).json({
          error: 'Template not found',
          availableTemplates: Object.keys(templates),
          disclaimer: 'This is a simulation for educational purposes only.'
        });
      }

      const rendered = renderTemplate(template, variables);

      res.json({
        message: 'Template rendered successfully',
        rendered: rendered,
        disclaimer: 'This is a simulation for educational purposes only.'
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        disclaimer: 'This is a simulation for educational purposes only.'
      });
    }
  }
}

module.exports = new TemplateController();
