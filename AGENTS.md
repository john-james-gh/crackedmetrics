# Contributor Guide

## Setup Tips

- To install the `cm` binary run `pnpm install`
- To install the `nx` CLI globally run `npm install nx -g` or use `npx nx` instead.

## Dev Environment Tips

- If `nx` CLI is installed globally, you do not need to prefix `nx` commands with `pnpm dlx` or `npx`)
- Use `nx show projects` to see all available projects in your workspace.
- Use `nx run <project_folder_name>:<target>` to run specific targets for a project (e.g., `nx run dashboard:test`).
- Use `nx graph` to visualize project dependencies and understand the workspace structure.
- Use `pnpm format` to run prettier.
- Check the name field inside each package's package.json to confirm the right name—skip the top-level one.
- cm (short for Cracked Metrics) is an internal CLI that uploads test results after test runner finishes.

## Testing Instructions

- Run `nx run <project_folder_name>:test` to run tests for that specific project.
- Run `nx run-many --target=test --all` to run tests for all projects.
- After moving files or changing imports, run `nx run <project_folder_name>:lint` to be sure ESLint rules still pass.
- After moving files or changing imports, run `nx run <project_folder_name>:typecheck` to be sure TypeScript compiler still passes.
- `cm` binary is installed in /libs/cli/package.json. Each project then installs `"@crackedmetrics/cli": "workspace:\*"` as its devDependency.
- The `cm` CLI uploads test reports to Supabase Database using a Supabase Edge Function.

## Common Nx Commands

- `nx dev <project_folder_name>` - Start development server for a project
- `nx build <project_folder_name>` - Build a project
- `nx lint <project_folder_name>` - Lint a project
- `nx test <project_folder_name>` - Test a project
- `nx e2e <project_folder_name>` - Run end-to-end tests for a project
- `nx affected:test` - Run tests for affected projects
- `nx affected:build` - Build affected projects
- `nx reset` - Clear Nx cache
