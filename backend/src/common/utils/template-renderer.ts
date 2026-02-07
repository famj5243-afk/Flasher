/**
 * Email template renderer utility
 * Renders templates with variables and appends mandatory educational disclaimer
 */

export const EDUCATION_DISCLAIMER = `
<div style="margin-top: 40px; padding: 20px; border-top: 2px solid #E5E7EB; background-color: #F9FAFB; text-align: center;">
  <p style="color: #6B7280; font-size: 14px; margin: 0;">
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </p>
  <p style="color: #EF4444; font-weight: 600; font-size: 14px; margin: 10px 0;">
    ⚠️ EDUCATIONAL SIMULATION
  </p>
  <p style="color: #6B7280; font-size: 12px; margin: 10px 0;">
    This email is a simulation for educational purposes only and does not represent a real transaction.
  </p>
  <p style="color: #6B7280; font-size: 14px; margin: 0;">
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </p>
</div>
`;

export interface TemplateVariables {
  [key: string]: string | number;
}

/**
 * Render template by replacing variables
 * Variables format: {{variable_name}}
 */
export function renderTemplate(template: string, variables: TemplateVariables): string {
  let rendered = template;

  // Replace all variables in the format {{variable_name}}
  Object.keys(variables).forEach((key) => {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    rendered = rendered.replace(regex, String(variables[key]));
  });

  return rendered;
}

/**
 * Append educational disclaimer to email body
 */
export function appendDisclaimer(htmlBody: string): string {
  // Check if body already has closing </body> tag
  if (htmlBody.includes('</body>')) {
    return htmlBody.replace('</body>', `${EDUCATION_DISCLAIMER}</body>`);
  }

  // Otherwise, just append
  return htmlBody + EDUCATION_DISCLAIMER;
}

/**
 * Extract variable names from template
 * Finds all occurrences of {{variable_name}}
 */
export function extractVariables(template: string): string[] {
  const regex = /{{\\s*(\\w+)\\s*}}/g;
  const variables: string[] = [];
  let match;

  while ((match = regex.exec(template)) !== null) {
    if (!variables.includes(match[1])) {
      variables.push(match[1]);
    }
  }

  return variables;
}

/**
 * Validate that all required variables are provided
 */
export function validateVariables(
  template: string,
  providedVariables: TemplateVariables,
): { valid: boolean; missing: string[] } {
  const requiredVariables = extractVariables(template);
  const missing = requiredVariables.filter(
    (varName) => !(varName in providedVariables),
  );

  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * Add SIMULATION prefix to email subject
 */
export function addSimulationPrefix(subject: string): string {
  if (!subject.toUpperCase().includes('[SIMULATION]')) {
    return `[SIMULATION] ${subject}`;
  }
  return subject;
}

/**
 * Render complete email with variables and disclaimer
 */
export function renderEmail(
  htmlBody: string,
  subject: string,
  variables: TemplateVariables,
): { renderedHtml: string; renderedSubject: string } {
  const renderedHtml = appendDisclaimer(renderTemplate(htmlBody, variables));
  const renderedSubject = addSimulationPrefix(renderTemplate(subject, variables));

  return {
    renderedHtml,
    renderedSubject,
  };
}
