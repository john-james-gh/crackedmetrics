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

| Column       | Type      | Description                                             |
| ------------ | --------- | ------------------------------------------------------- |
| id           | uuid      | Primary Key                                             |
| key          | string    | Unique key (e.g. crk_live_abc123...), (no embedded JWT) |
| tenant_id    | uuid      | Foreign Key to Tenants                                  |
| project_id   | uuid      | Nullable Foreign Key to Projects                        |
| created_at   | timestamp |                                                         |
| expires_at   | timestamp | Nullable                                                |
| revoked      | boolean   | Default: false                                          |
| description  | string    | Optional, for user labeling (e.g. "CI server key")      |
| last_used_at | timestamp | Ror rotation and auditing                               |

## 4. Reports

| Column       | Type      | Description                        |
| ------------ | --------- | ---------------------------------- |
| id           | uuid      | Primary Key                        |
| tenant_id    | uuid      | Foreign Key to Tenants             |
| project_id   | uuid      | Foreign Key to Projects            |
| test_tool    | enum      | e.g. 'vitest', 'playwright'        |
| run_at       | timestamp |                                    |
| raw_json     | jsonb     | Full report blob                   |
| commit_hash  | string    | Optional, for VCS integration      |
| branch       | string    | Optional                           |
| creator_id   | uuid      | FK to `auth.users` (Supabase Auth) |
| creator_type | enum      | Optional, human/ci                 |
| duration     | number    | Optional, total ms                 |
| status       | enum      | Optional: passed/failed/partial    |

## Memberships

| Column    | Type      | Description                        |
| --------- | --------- | ---------------------------------- |
| id        | uuid      | Primary Key                        |
| user_id   | uuid      | FK to `auth.users` (Supabase Auth) |
| tenant_id | uuid      | FK to Tenants (org)                |
| role      | enum      | 'admin', 'member', etc.            |
| joined_at | timestamp | When user was added                |
