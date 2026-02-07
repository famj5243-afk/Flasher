import React from 'react';
import './TemplateList.css';

const TemplateList = ({ templates, onSelect, selectedTemplate }) => {
  return (
    <div className="template-list">
      {templates.length === 0 ? (
        <div className="empty-state">
          <p>Loading templates...</p>
        </div>
      ) : (
        templates.map((template) => (
          <div
            key={template.id}
            className={`template-card ${
              selectedTemplate?.id === template.id ? 'selected' : ''
            }`}
            onClick={() => onSelect(template.id)}
          >
            <h3>{template.name}</h3>
            <p>{template.description}</p>
            {selectedTemplate?.id === template.id && (
              <span className="selected-badge">✓ Selected</span>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default TemplateList;
