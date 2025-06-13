# Contributor Guide

## Dev Environment Tips

- Use `pnpm dlx nx show projects` to see all available projects in your workspace.
- Use `pnpm dlx nx run <project_name>:<target>` to run specific targets for a project (e.g., `pnpm dlx nx run dashboard:test`).
- Use `pnpm dlx nx graph` to visualize project dependencies and understand the workspace structure.
- Use `pnpm format` to run prettier.
- Check the name field inside each package's package.json to confirm the right name—skip the top-level one.

## Testing Instructions

- Run `pnpm dlx nx run <project_name>:test` to run tests for that specific project.
- Run `pnpm dlx nx run-many --target=test --all` to run tests for all projects.
- After moving files or changing imports, run `pnpm dlx nx run <project_name>:lint` to be sure ESLint rules still pass.
- After moving files or changing imports, run `pnpm dlx nx run <project_name>:typecheck` to be sure TypeScript compiler still passes.

## Common Nx Commands

- `pnpm dlx nx dev <project_name>` - Start development server for a project
- `pnpm dlx nx build <project_name>` - Build a project
- `pnpm dlx nx lint <project_name>` - Lint a project
- `pnpm dlx nx test <project_name>` - Test a project
- `pnpm dlx nx e2e <project_name>` - Run end-to-end tests for a project
- `pnpm dlx nx affected:test` - Run tests for affected projects
- `pnpm dlx nx affected:build` - Build affected projects
- `pnpm dlx nx reset` - Clear Nx cache
