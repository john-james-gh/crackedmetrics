# Contributor Guide

## Dev Environment Tips

- Use `nx show projects` to see all available projects in your workspace.
- Use `nx run <project_name>:<target>` to run specific targets for a project (e.g., `nx run dashboard:test`).
- Use `nx graph` to visualize project dependencies and understand the workspace structure.
- Use `pnpm format` to run prettier.
- Check the name field inside each package's package.json to confirm the right name—skip the top-level one.
- cm (short for Cracked Metrics) is an internal CLI that uploads test results after test runner finishes.

## Testing Instructions

- Run `nx run <project_name>:test` to run tests for that specific project.
- Run `nx run-many --target=test --all` to run tests for all projects.
- After moving files or changing imports, run `nx run <project_name>:lint` to be sure ESLint rules still pass.
- After moving files or changing imports, run `nx run <project_name>:typecheck` to be sure TypeScript compiler still passes.

## Common Nx Commands

- `nx dev <project_name>` - Start development server for a project
- `nx build <project_name>` - Build a project
- `nx lint <project_name>` - Lint a project
- `nx test <project_name>` - Test a project
- `nx e2e <project_name>` - Run end-to-end tests for a project
- `nx affected:test` - Run tests for affected projects
- `nx affected:build` - Build affected projects
- `nx reset` - Clear Nx cache
