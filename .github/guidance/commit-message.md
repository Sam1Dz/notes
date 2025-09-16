# Commit Message Generation Rules

- The commit message must follow the Conventional Commits specification.
- The entire message must be in lowercase and written in English.
- Use the imperative mood (e.g., 'add user', not 'added user').

## Format Structure

- For new features, the format is mandatory: `feat(feature-name): description`.
- For all other types, the format is: `type: description`.

## Valid Types

- **`feat`**: A new feature. **Must include a scope** specifying the feature
  name.
  - Example: `feat(user-auth): add google oauth strategy`
- **`fix`**: A bug fix.
  - Example: `fix: resolve login validation issue`
- **`docs`**: Documentation only changes.
  - Example: `docs: update API documentation for payment gateway`
- **`style`**: Code style changes (formatting, etc).
  - Example: `style: fix indentation in user controller`
- **`refactor`**: Code changes that neither fix a bug nor add a feature.
  - Example: `refactor: optimize database query performance`
- **`test`**: Adding or correcting tests.
  - Example: `test: add unit tests for authentication`
- **`chore`**: Maintenance tasks (dependencies, build process).
  - Example: `chore: update dependencies`
