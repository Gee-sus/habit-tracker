# Contributing to Habit Tracker

First off, thank you for considering contributing to Habit Tracker! It's people like you that make this app better for everyone.

## 🤝 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** (screenshots, code snippets)
- **Describe the behavior you observed and what you expected**
- **Include details about your environment** (OS, device, app version)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description** of the suggested enhancement
- **Explain why this enhancement would be useful**
- **List some examples** of how it would work

### Pull Requests

1. **Fork the repo** and create your branch from `main`
2. **Follow the existing code style**
3. **Test your changes** thoroughly
4. **Update documentation** if needed
5. **Write clear commit messages**
6. **Submit your pull request!**

## 💻 Development Setup

1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Set up your `.env` file (see `.env.example`)
4. Start the development server: `npx expo start`

## 📝 Code Style Guidelines

- Use **TypeScript** for all new code
- Follow **React Hooks** best practices
- Use **functional components** over class components
- Keep components **small and focused**
- Write **meaningful variable and function names**
- Add **comments** for complex logic
- Follow the existing **file structure**

### Naming Conventions

- **Components**: PascalCase (e.g., `HabitCard.tsx`)
- **Functions**: camelCase (e.g., `handleSubmit`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `DATABASE_ID`)
- **Interfaces/Types**: PascalCase (e.g., `Habit`)

### File Structure

```
New Feature/
├── components/          # Feature-specific components
├── hooks/              # Custom hooks
├── utils/              # Helper functions
└── types/              # TypeScript types
```

## 🧪 Testing

Before submitting a PR:

1. Run the linter: `npm run lint`
2. Check TypeScript: `npx tsc --noEmit`
3. Test on both iOS and Android (if possible)
4. Test all affected features manually

## 📋 Commit Message Guidelines

Use clear and meaningful commit messages:

- `feat: add calendar view for habit history`
- `fix: resolve streak counting bug`
- `docs: update installation instructions`
- `style: format code with prettier`
- `refactor: simplify habit completion logic`
- `test: add tests for auth flow`
- `chore: update dependencies`

## 🎯 Priority Areas

We're especially interested in contributions for:

- 📅 Calendar view implementation
- 📈 Analytics and insights
- 🔔 Push notifications
- 🎨 Theme customization
- 🧪 Unit and integration tests
- 📱 Accessibility improvements
- 🌐 Internationalization (i18n)

## 🐛 Found a Security Issue?

Please **DO NOT** open a public issue. Instead, email the maintainer directly (find contact info in profile).

## ❓ Questions?

Feel free to open an issue with the `question` label or reach out to the maintainer.

## 📜 Code of Conduct

### Our Pledge

We pledge to make participation in this project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards others

**Unacceptable behavior includes:**
- Trolling, insulting/derogatory comments, and personal attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Habit Tracker! 🎉

