import React, { useState, useEffect } from 'react';
import './App.css';
import EmailForm from './components/EmailForm';
import TemplateList from './components/TemplateList';
import { getTemplates, sendEmail } from './services/api';

function App() {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const data = await getTemplates();
      setTemplates(data.templates || []);
    } catch (error) {
      console.error('Failed to load templates:', error);
      setMessage({ type: 'error', text: 'Failed to load templates' });
    }
  };

  const handleSelectTemplate = async (templateId) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/templates/${templateId}`);
      const data = await response.json();
      setSelectedTemplate(data.template);
      setMessage(null);
    } catch (error) {
      console.error('Failed to load template:', error);
      setMessage({ type: 'error', text: 'Failed to load template details' });
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async (emailData) => {
    setLoading(true);
    setMessage(null);
    try {
      const result = await sendEmail(emailData);
      setMessage({
        type: 'success',
        text: 'Educational simulation email sent successfully!',
        previewUrl: result.data.previewUrl
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to send email'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      {/* Educational Disclaimer Banner */}
      <div className="disclaimer-banner">
        <div className="disclaimer-content">
          <span className="disclaimer-icon">⚠️</span>
          <strong>EDUCATIONAL PLATFORM:</strong> This is a simulation for educational purposes only.
          Do not use for real communications or to impersonate real entities.
        </div>
      </div>

      <header className="App-header">
        <h1>📧 Flasher</h1>
        <p className="subtitle">Educational Email Simulation Platform</p>
      </header>

      <main className="App-main">
        <div className="container">
          {message && (
            <div className={`message ${message.type}`}>
              <p>{message.text}</p>
              {message.previewUrl && (
                <a href={message.previewUrl} target="_blank" rel="noopener noreferrer" className="preview-link">
                  View Preview
                </a>
              )}
            </div>
          )}

          <div className="content-grid">
            <div className="templates-section">
              <h2>Email Templates</h2>
              <p className="section-description">
                Select a template to customize and send educational simulation emails
              </p>
              <TemplateList
                templates={templates}
                onSelect={handleSelectTemplate}
                selectedTemplate={selectedTemplate}
              />
            </div>

            <div className="form-section">
              <h2>Customize & Send</h2>
              <EmailForm
                template={selectedTemplate}
                onSend={handleSendEmail}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </main>

      <footer className="App-footer">
        <div className="footer-content">
          <p>
            <strong>Educational Disclaimer:</strong> This platform is strictly for educational
            and testing purposes. All emails include disclaimers and should not be used for
            real communications.
          </p>
          <p className="footer-note">
            Built for learning about email systems, web development, and notification design.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
