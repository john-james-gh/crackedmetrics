# Database Schema

## 1. Tenants (Organizations/Users)

| Column     | Type      | Description                                  |
| ---------- | --------- | -------------------------------------------- |
| id         | uuid      | Primary Key                                  |
| name       | string    |                                              |
| created_at | timestamp |                                              |
| owner_id   | uuid      | FK to Auth users (user who created this org) |

## 2. Projects

| Column     | Type      | Description            |
| ---------- | --------- | ---------------------- |
| id         | uuid      | Primary Key            |
| tenant_id  | uuid      | Foreign Key to Tenants |
| name       | string    |                        |
| created_at | timestamp |                        |

## 3. API Keys

| Column      | Type      | Description                                        |
| ----------- | --------- | -------------------------------------------------- |
| id          | uuid      | Primary Key                                        |
| key         | string    | Unique key (e.g. crk_live_abc123...)               |
| tenant_id   | uuid      | Foreign Key to Tenants                             |
| project_id  | uuid      | Nullable Foreign Key to Projects                   |
| created_at  | timestamp |                                                    |
| expires_at  | timestamp | Nullable                                           |
| revoked     | boolean   | Default: false                                     |
| description | string    | Optional, for user labeling (e.g. "CI server key") |

## 4. Test Runs

| Column      | Type      | Description                     |
| ----------- | --------- | ------------------------------- |
| id          | uuid      | Primary Key                     |
| tenant_id   | uuid      | Foreign Key to Tenants          |
| project_id  | uuid      | Foreign Key to Projects         |
| test_tool   | string    | e.g. 'vitest', 'playwright'     |
| run_at      | timestamp |                                 |
| raw_json    | jsonb     | Full report blob                |
| commit_hash | string    | Optional, for VCS integration   |
| branch      | string    | Optional                        |
| creator     | string    | Optional, username/email        |
| duration    | number    | Optional, total ms              |
| status      | string    | Optional: passed/failed/partial |

## Users (Memberships Table)

| Column    | Type      | Description                        |
| --------- | --------- | ---------------------------------- |
| id        | uuid      | Primary Key                        |
| user_id   | uuid      | FK to `auth.users` (Supabase Auth) |
| tenant_id | uuid      | FK to Tenants (org)                |
| role      | string    | 'admin', 'member', etc.            |
| joined_at | timestamp | When user was added                |
