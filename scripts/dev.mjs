import { readFileSync, existsSync, readdirSync } from "fs"
import { execSync } from "child_process"
import { join } from "path"

const configPath = "nocturne.workspace.json"
let config = {}
if (existsSync(configPath)) {
  config = JSON.parse(readFileSync(configPath, "utf-8"))
}

let app = config.defaultApp
if (!app) {
  const appsDir = "apps"
  if (existsSync(appsDir)) {
    const dirs = readdirSync(appsDir).filter((d) =>
      existsSync(join(appsDir, d, "package.json"))
    )
    app = dirs[0]
  }
}

if (!app) {
  console.error(
    "No app found. Create an app in apps/ or set defaultApp in nocturne.workspace.json"
  )
  process.exit(1)
}

const portFlag = config.dev?.port ? ` --port ${config.dev.port}` : ""
const hostFlag = config.dev?.host ? " --host" : ""
execSync(`pnpm --filter ${app} dev${portFlag}${hostFlag}`, {
  stdio: "inherit",
})
