import React, { useState, useEffect } from 'react';
import './EmailForm.css';

const EmailForm = ({ template, onSend, loading }) => {
  const [formData, setFormData] = useState({
    to: '',
    subject: '',
    text: '',
    html: '',
  });

  useEffect(() => {
    if (template) {
      setFormData({
        to: '',
        subject: template.subject || '',
        text: template.text || '',
        html: template.html || '',
      });
    }
  }, [template]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.to || !formData.subject || (!formData.text && !formData.html)) {
      alert('Please fill in all required fields');
      return;
    }
    onSend(formData);
  };

  if (!template) {
    return (
      <div className="empty-form">
        <div className="empty-form-content">
          <span className="empty-icon">📋</span>
          <h3>No Template Selected</h3>
          <p>Please select a template from the list to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="email-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="to">
            Recipient Email <span className="required">*</span>
          </label>
          <input
            type="email"
            id="to"
            name="to"
            value={formData.to}
            onChange={handleChange}
            placeholder="student@example.com"
            required
            disabled={loading}
          />
          <small className="form-hint">
            For educational testing only. Use your own email address.
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="subject">
            Subject <span className="required">*</span>
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Enter email subject"
            required
            disabled={loading}
          />
          <small className="form-hint">
            "[SIMULATION]" will be prepended automatically
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="text">
            Text Content <span className="required">*</span>
          </label>
          <textarea
            id="text"
            name="text"
            value={formData.text}
            onChange={handleChange}
            placeholder="Plain text email content"
            rows="6"
            disabled={loading}
          />
          <small className="form-hint">
            Plain text version of the email
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="html">HTML Content (Optional)</label>
          <textarea
            id="html"
            name="html"
            value={formData.html}
            onChange={handleChange}
            placeholder="<html>...</html>"
            rows="8"
            disabled={loading}
          />
          <small className="form-hint">
            HTML version of the email (optional)
          </small>
        </div>

        <div className="disclaimer-box">
          <strong>⚠️ Educational Disclaimer:</strong>
          <p>
            All emails sent from this platform automatically include an educational
            disclaimer footer: "This is a simulation for educational purposes only."
          </p>
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner"></span>
              Sending...
            </>
          ) : (
            <>
              <span>📤</span>
              Send Simulation Email
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default EmailForm;
