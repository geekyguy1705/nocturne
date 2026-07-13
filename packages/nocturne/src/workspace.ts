import { readFileSync, existsSync, readdirSync } from "fs"
import { join, resolve } from "path"

export interface NocturneWorkspaceConfig {
  /** App name to run with `pnpm dev`. If omitted, uses the first app in `apps/`. */
  defaultApp?: string
  /** Explicit list of app directory names under `apps/`. If omitted, auto-discovers via glob. */
  apps?: string[]
  /** Dev server settings */
  dev?: {
    port?: number
    host?: boolean
  }
  /** Build settings */
  build?: {
    outputDir?: string
  }
  /** Package manager settings (informational, not enforced) */
  package?: {
    name?: string
    version?: string
  }
}

export const defaultWorkspaceConfig: NocturneWorkspaceConfig = {
  dev: {
    port: 4321,
    host: false,
  },
  build: {
    outputDir: "dist",
  },
}

function deepMerge<T>(base: T, override: Partial<T> | undefined): T {
  if (override === undefined) return base
  if (typeof base !== "object" || base === null) return (override ?? base) as T
  if (Array.isArray(base)) return (override as T) ?? base
  const result = { ...base } as Record<string, unknown>
  const ov = override as Record<string, unknown>
  for (const key of Object.keys(ov)) {
    if (
      typeof base[key as keyof T] === "object" &&
      base[key as keyof T] !== null &&
      !Array.isArray(base[key as keyof T]) &&
      typeof ov[key] === "object" &&
      ov[key] !== null
    ) {
      result[key] = deepMerge(
        base[key as keyof T],
        ov[key] as Partial<T[keyof T]>
      )
    } else {
      result[key] = ov[key]
    }
  }
  return result as T
}

export function loadWorkspaceConfig(
  configPath?: string
): NocturneWorkspaceConfig {
  const resolvedPath = resolve(configPath ?? "nocturne.workspace.json")
  if (!existsSync(resolvedPath)) {
    return defaultWorkspaceConfig
  }
  const raw = JSON.parse(readFileSync(resolvedPath, "utf-8"))
  return deepMerge(defaultWorkspaceConfig, raw)
}

export function resolveDefaultApp(
  config: NocturneWorkspaceConfig,
  appsDir = "apps"
): string | undefined {
  if (config.defaultApp) return config.defaultApp
  if (!existsSync(appsDir)) return undefined
  const dirs = readdirSync(appsDir).filter((d) =>
    existsSync(join(appsDir, d, "package.json"))
  )
  return dirs[0]
}
