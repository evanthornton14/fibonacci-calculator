# Contributing

Thanks for wanting to contribute! A small checklist to get started:

- Fork the repository and create a feature branch from main.
- Run `npm run setup` to install dependencies and enable Git hooks.
- Run `npm run format` and `npm run lint` locally before committing, or rely on the pre-commit hook.
- Write tests for any new functionality and run `npm run test:unit`.
- Keep changes small and focused; open a PR describing the intent and what you changed.

Commit message guidance:

- Use `chore:`, `fix:`, or `feat:` prefixes for commit messages where appropriate.

If hooks or CI fail:

- Ensure you ran `npm install` and `npm run prepare`.
- To bypass hooks temporarily, use `git commit --no-verify` (not recommended except for emergencies).
