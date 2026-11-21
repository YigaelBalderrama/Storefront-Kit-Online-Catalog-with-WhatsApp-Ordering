# OnlineStore

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.1.7.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

No end-to-end runner is configured in this project yet. The installed Playwright agent skill provides browser testing guidance; it does not install a project test suite.

## Code quality

Install the locked dependencies with `npm ci`.

The `prepare` script automatically activates the Husky Git hooks when installing dependencies. Before each commit, `.husky/pre-commit` runs `npm run lint` followed by `npm run format:check` across the project. Either failure blocks the commit. Fix reported issues with `npm run lint:fix` and `npm run format`, review and stage the changes, then retry the commit. To reactivate hooks in an existing checkout, run `npm run prepare`.

| Command                | Purpose                                                                                         |
| ---------------------- | ----------------------------------------------------------------------------------------------- |
| `npm run lint`         | Check TypeScript and Angular templates, including accessibility rules; warnings fail the check. |
| `npm run lint:fix`     | Apply available ESLint fixes.                                                                   |
| `npm run format`       | Format source and configuration files with Prettier.                                            |
| `npm run format:check` | Check formatting without modifying files.                                                       |
| `npm run test:ci`      | Run the existing Angular/Vitest unit tests once.                                                |
| `npm run check`        | Run formatting, lint, unit tests, and the production build.                                     |

ESLint uses flat configuration in `eslint.config.mjs`, with Angular 22, TypeScript, and template accessibility recommendations. `eslint-config-prettier` disables conflicting formatting rules. Prettier owns formatting, uses the Angular HTML parser, and normalizes line endings to LF. Generated output, dependencies, lockfiles, and agent instructions are excluded from formatting.

VS Code recommends the Angular Language Service, ESLint, and Prettier extensions. Workspace settings enable formatting and ESLint fixes on explicit save.

## Agent skills

The following skills were installed for the current Codex user in `~/.codex/skills` and become available on the next turn:

- [angular-developer](https://github.com/angular/skills/tree/main/angular-developer): official Angular guidance, including unit testing, HTTP testing, routing tests, and end-to-end testing.
- [angular-material](https://github.com/angular-sanctuary/angular-agent-skills/tree/main/skills/angular-material): Material theming, components, CDK, and component harnesses. Its reference baseline is Angular Material 21; verify APIs against Angular 22 before use.
- [playwright](https://github.com/openai/skills/tree/main/skills/.curated/playwright): browser automation and interaction testing.

Skills are installed in the user's environment, not as npm dependencies. Repository instructions take precedence over their examples, including typed reactive forms, default Angular 22 change detection, and layouts without media queries.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
