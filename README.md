# Cracked Metrics

Crackedmetrics is a comprehensive testing analytics platform that helps teams track, analyze, and visualize their test results across multiple projects and tools.

## 🏗️ Project Structure

This monorepo contains:

### Applications

- **`dashboard`** - Vite React-based web application for viewing test metrics and analytics
- **`dashboard-e2e`** - End-to-end Playwright tests for the dashboard application

### Libraries

- **`@crackedmetrics/ui`** - Shared UI components and design system
- **`@crackedmetrics/cli`** - Custom CLI tool (`cm`) for uploading test results
- **`@crackedmetrics/types`** - Shared TypeScript type definitions

## 🚀 Quick Start

### Prerequisites

- Node.js (latest LTS)
- pnpm (v10.11.0+)
- nx (v21.1.2) (if `nx` cli is installed globally, you do not need to prefix `nx` commands with `pnpm dlx`)

### Installation

```sh
pnpm install
pnpm add nx --global
```

### Development

To start the dashboard development server:

```sh
pnpx dlx nx dev dashboard
```

To create a production bundle:

```sh
pnpm dlx nx build dashboard
```

## 🧪 Testing

Run tests for specific projects:

```sh
pnpx dlx nx test dashboard
pnpx dlx nx test ui
pnpx dlx nx test cli
```

Run all tests across the workspace:

```sh
pnpx dlx nx run-many --target=test --all
```

Run end-to-end tests:

```sh
pnpx dlx nx e2e dashboard-e2e
```

## 🛠️ Development Commands

### Common Nx Commands

- `pnpx dlx nx dev <project>` - Start development server
- `pnpx dlx nx build <project>` - Build a project
- `pnpx dlx nx lint <project>` - Lint a project
- `pnpx dlx nx test <project>` - Test a project
- `pnpx dlx nx e2e <project>` - Run end-to-end tests
- `pnpx dlx nx affected:test` - Run tests for affected projects
- `pnpx dlx nx affected:build` - Build affected projects
- `pnpx dlx nx reset` - Clear Nx cache

### Code Quality

```sh
# Format code
pnpm format

# Type checking
pnpx dlx nx run <project>:typecheck

# Linting
pnpx dlx nx run <project>:lint
```

## 📊 Database Schema

The application uses Supabase as the backend with the following key entities:

- **Tenants** - Organizations
- **Projects** - Test projects within organizations
- **API Keys** - Authentication keys for uploading test results. `CM` CLI uses this when `cm vitest` is run.
- **Reports** - Individual test execution reports
- **Memberships** - User roles within organizations

See [db.md](./db.md) for detailed schema information.

## 🔧 Custom CLI Tool

The `@crackedmetrics/cli` library provides a custom CLI tool (`cm`) that:

- Uploads test results to the dashboard
- Integrates with test runners like Vitest and Playwright
- Handles authentication via API keys

## 🏛️ Architecture

- **Frontend**: React 19 with Vite, Tailwind CSS, Radix UI
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Testing**: Vitest, Playwright
- **Build Tool**: Nx with Vite
- **Package Manager**: pnpm

## 📚 Additional Resources

- [AGENTS.md](./AGENTS.md) - Contributor guide and development tips
- [db.md](./db.md) - Database schema documentation

## 🔗 Useful Links

Learn more about this workspace:

- [Nx Documentation](https://nx.dev)
- [React Tutorial](https://nx.dev/getting-started/tutorials/react-monorepo-tutorial)
- [Nx Console](https://nx.dev/getting-started/editor-setup) - IDE extension for better DX

## 🤝 Contributing

See [AGENTS.md](./AGENTS.md) for detailed development guidelines and tips.
