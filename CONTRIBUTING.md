# Contributing to LLM API Performance Bench

Thank you for your interest in contributing to the LLM API Performance Bench project! This document outlines the process for contributing to this project.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with the following information:
- A clear, descriptive title
- Steps to reproduce the bug
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment details (browser, OS, etc.)

### Suggesting Enhancements

For feature requests or enhancements:
- Use a clear, descriptive title
- Provide a detailed description of the proposed feature
- Explain why this feature would be useful to the project
- Include any relevant mockups or examples

### Pull Requests

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Run tests to ensure your changes don't break existing functionality
5. Commit your changes: `git commit -m 'Add some feature'`
6. Push to the branch: `git push origin feature/your-feature-name`
7. Submit a pull request

#### Pull Request Guidelines

- Follow the existing code style and conventions
- Include tests for new features
- Update documentation as needed
- Keep pull requests focused on a single change
- Link related issues in the pull request description

## Development Setup

### Prerequisites
- Node.js (v16.x or later)
- npm (v8.x or later)
- PostgreSQL (v14.x or later)

### Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/llm-api-perf-bench.git
   cd llm-api-perf-bench
   ```

2. Install dependencies:
   ```bash
   # Install frontend dependencies
   cd client
   npm install
   
   # Install backend dependencies
   cd ../server
   npm install
   ```

3. Set up environment variables (see README.md for required variables)

4. Start the development servers:
   ```bash
   # Frontend
   cd client
   npm run dev
   
   # Backend
   cd server
   npm run dev
   ```

## Coding Standards

- Use consistent indentation (2 spaces)
- Follow React best practices for frontend code
- Use async/await for asynchronous operations
- Write descriptive variable and function names
- Add comments for complex logic

## Commit Guidelines

Follow conventional commits format for commit messages:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code changes that neither fix bugs nor add features
- `test`: Adding or updating tests
- `chore`: Changes to the build process or auxiliary tools

Example: `feat: add API key validation`

## License

By contributing to this project, you agree that your contributions will be licensed under the project's license.

## Questions?

If you have any questions about contributing, please reach out to Shizhang Yin at shizhang.yin@mail.utoronto.ca. 