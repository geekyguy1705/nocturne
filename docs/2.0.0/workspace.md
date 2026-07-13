# Workspace Configuration

Nocturne 2.0.0 uses a `nocturne.workspace.json` file at the repo root to control workspace-level settings — which app `pnpm dev` runs, dev server options, and build output.

---

## `nocturne.workspace.json`

Create this file at the **repo root** (not inside an app directory):

```json
{
  "defaultApp": "my-site",
  "apps": ["my-site"],
  "dev": {
    "port": 4321,
    "host": false
  },
  "build": {
    "outputDir": "dist"
  }
}
```

### All options

| Field | Type | Default | Description |
|---|---|---|---|
| `defaultApp` | `string \| undefined` | `undefined` | App name to run with `pnpm dev`. If omitted, uses the first app in `apps/`. |
| `apps` | `string[] \| undefined` | `undefined` | Explicit list of app directory names under `apps/`. If omitted, auto-discovers. |
| `dev.port` | `number` | `4321` | Dev server port |
| `dev.host` | `boolean` | `false` | Expose dev server on network |
| `build.outputDir` | `string` | `"dist"` | Build output directory |
| `package.name` | `string \| undefined` | `undefined` | Informational — workspace package name |
| `package.version` | `string \| undefined` | `undefined` | Informational — workspace version |

---

## Default app resolution

The `scripts/dev.mjs` script determines which app to run:

1. Read `nocturne.workspace.json` → use `defaultApp` if set
2. If `defaultApp` is not set → scan `apps/` for the first directory with a `package.json`
3. If no apps found → error with a helpful message

This means: when you create your first app, it automatically becomes the default without needing to update any config file. Setting `defaultApp` is the explicit override.

---

## `scripts/dev.mjs`

The dev script at the repo root reads `nocturne.workspace.json` and runs the resolved app:

```bash
pnpm dev              # reads workspace config, runs defaultApp
pnpm --filter my-site dev  # run a specific app directly
```

The script passes `--port` and `--host` flags from the workspace config to the Astro dev server.

---

## `NocturneWorkspaceConfig` type

Exported from `@geekyguy1705/nocturne/workspace`:

```ts
import type { NocturneWorkspaceConfig } from "@geekyguy1705/nocturne/workspace"
```

### `loadWorkspaceConfig()`

Loads and merges the workspace config with defaults:

```ts
import { loadWorkspaceConfig } from "@geekyguy1705/nocturne/workspace"

const config = loadWorkspaceConfig()
// or: loadWorkspaceConfig("/path/to/nocturne.workspace.json")
```

### `resolveDefaultApp()`

Resolves which app to run, given a workspace config:

```ts
import { loadWorkspaceConfig, resolveDefaultApp } from "@geekyguy1705/nocturne/workspace"

const config = loadWorkspaceConfig()
const app = resolveDefaultApp(config)
// returns config.defaultApp or first app in apps/ directory
```

---

## Example configurations

### Single personal app

```json
{
  "defaultApp": "my-site",
  "apps": ["my-site"],
  "dev": { "port": 4321, "host": false },
  "build": { "outputDir": "dist" }
}
```

### Demo app (core branch)

```json
{
  "defaultApp": "demo",
  "apps": ["demo"],
  "dev": { "port": 4321, "host": false },
  "build": { "outputDir": "dist" }
}
```

### Multiple apps with explicit default

```json
{
  "defaultApp": "portfolio-abhishek",
  "apps": ["portfolio-abhishek", "demo"],
  "dev": { "port": 4321, "host": false },
  "build": { "outputDir": "dist" }
}
```

### Auto-discovery (no defaultApp)

```json
{
  "dev": { "port": 3000 },
  "build": { "outputDir": "dist" }
}
```

The first directory in `apps/` with a `package.json` becomes the default.
