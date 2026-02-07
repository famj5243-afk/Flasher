# Contributing to Flasher

Thank you for your interest in contributing to Flasher! This educational platform welcomes contributions that enhance its educational value.

## ⚠️ Important Disclaimer

**This is an educational platform for learning purposes only.**

All contributions must maintain the educational focus and ethical standards:
- ✅ Enhance educational value
- ✅ Improve security and validation
- ✅ Better documentation
- ❌ Enable fraud or impersonation
- ❌ Remove safety features
- ❌ Bypass validation

## How to Contribute

### Reporting Issues
1. Check existing issues to avoid duplicates
2. Use issue templates when available
3. Provide detailed information:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots if applicable

### Suggesting Enhancements
1. Open an issue with the "enhancement" label
2. Explain the educational benefit
3. Provide examples or mockups
4. Discuss implementation approach

### Code Contributions

#### Setup Development Environment
```bash
# Fork and clone the repository
git clone https://github.com/your-username/Flasher.git
cd Flasher

# Install dependencies
npm install
cd client && npm install && cd ..

# Create a feature branch
git checkout -b feature/your-feature-name
```

#### Making Changes
1. **Code Style:**
   - Follow existing code patterns
   - Use meaningful variable names
   - Add comments for complex logic
   - Keep functions focused and small

2. **Testing:**
   - Test your changes thoroughly
   - Ensure existing functionality works
   - Add tests for new features

3. **Documentation:**
   - Update README.md if needed
   - Add JSDoc comments to functions
   - Update API documentation

4. **Security:**
   - Maintain all security features
   - Don't remove validation logic
   - Keep educational disclaimers
   - Follow secure coding practices

#### Submitting Pull Requests
1. Commit your changes:
   ```bash
   git add .
   git commit -m "Description of changes"
   ```

2. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

3. Open a Pull Request:
   - Use a clear title
   - Describe what and why
   - Reference related issues
   - Include screenshots for UI changes

4. Respond to feedback:
   - Address review comments
   - Make requested changes
   - Be patient and respectful

## Types of Contributions

### Welcome Contributions
- 📚 **Documentation:** Improve guides, tutorials, examples
- 🎨 **UI/UX:** Better design, accessibility improvements
- 🔒 **Security:** Enhanced validation, better error handling
- 📧 **Templates:** New educational email templates
- ✅ **Testing:** Add test coverage, improve test quality
- 🐛 **Bug Fixes:** Fix reported issues
- ⚡ **Performance:** Optimize code, reduce load times

### Not Accepted
- ❌ Removing educational disclaimers
- ❌ Bypassing content validation
- ❌ Adding real company impersonation
- ❌ Enabling fraudulent use cases
- ❌ Removing security features

## Adding Email Templates

When adding new templates:
1. Create in `server/templates/emailTemplates.js`
2. Include educational disclaimers
3. Avoid real company branding
4. Use generic, educational examples
5. Test with various content

Example template structure:
```javascript
templateName: {
  id: 'template-id',
  name: 'Template Name',
  description: 'Educational description',
  subject: 'Subject with {{variables}}',
  text: 'Plain text version',
  html: 'HTML version with styling'
}
```

## Code Review Process

1. Maintainers review all PRs
2. Feedback provided within a week
3. Changes requested if needed
4. Approved PRs merged to main

## Questions?

- Open a GitHub issue
- Tag with "question" label
- Be specific and clear

## Code of Conduct

Be respectful and professional:
- Use welcoming language
- Respect different viewpoints
- Accept constructive criticism
- Focus on what's best for education

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for helping make Flasher a better educational platform!**
