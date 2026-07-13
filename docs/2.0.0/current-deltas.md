# Current Branch Delta Map

This map classifies every path reported by `git diff --name-status main...portfolio-abhishek`. Each path appears exactly once.

| Status | Path | Classification | Disposition |
| --- | --- | --- | --- |
| A | `.github/workflows/sync-profile-to-geekyguy1705_github_io.yml` | personal deployment/documentation | Do not copy; it targets the existing personal mirror workflow. |
| A | `Makefile` | personal deployment/documentation | Do not copy; replace with workspace scripts owned by the 2.0 core. |
| M | `README.md` | personal deployment/documentation | Copy only app-specific information later if still needed. |
| A | `apps/web/public/abhishek-profile.png` | personal config/content/asset | Copy only to the isolated personal consumer. |
| D | `apps/web/src/content/articles/astro-content-collections.md` | personal config/content/asset | The deletion represents the personal article set; retain generic fixture content in core. |
| D | `apps/web/src/content/articles/build-time-svg-fonts-opentype.md` | personal config/content/asset | The deletion represents the personal article set; retain generic fixture content in core. |
| D | `apps/web/src/content/articles/dark-mode-design.md` | personal config/content/asset | The deletion represents the personal article set; retain generic fixture content in core. |
| A | `apps/web/src/content/articles/docker-vs-podman.md` | personal config/content/asset | Copy only to the isolated personal consumer. |
| D | `apps/web/src/content/articles/figma-tokens-tailwind-v4.md` | personal config/content/asset | The deletion represents the personal article set; retain generic fixture content in core. |
| A | `apps/web/src/content/articles/getting-started-with-devops.md` | personal config/content/asset | Copy only to the isolated personal consumer. |
| A | `apps/web/src/content/articles/getting-started-with-kubernetes.md` | personal config/content/asset | Copy only to the isolated personal consumer. |
| A | `apps/web/src/content/articles/google-io-2025.md` | personal config/content/asset | Copy only to the isolated personal consumer. |
| A | `apps/web/src/content/articles/kubernetes-ingress-essentials.md` | personal config/content/asset | Copy only to the isolated personal consumer. |
| A | `apps/web/src/content/articles/pods-deployments-and-services.md` | personal config/content/asset | Copy only to the isolated personal consumer. |
| D | `apps/web/src/content/articles/svg-stroke-animations-animejs.md` | personal config/content/asset | The deletion represents the personal article set; retain generic fixture content in core. |
| D | `apps/web/src/content/articles/theming-css-variables-oklch.md` | personal config/content/asset | The deletion represents the personal article set; retain generic fixture content in core. |
| M | `apps/web/src/content/profile/profile.md` | personal config/content/asset | Copy personal profile values only to the isolated personal consumer. |
| D | `apps/web/src/content/projects/kanban-flow.md` | personal config/content/asset | The deletion represents the personal project set; retain generic fixture content in core. |
| M | `apps/web/src/content/projects/nocturne.md` | personal config/content/asset | Copy personal project values only to the isolated personal consumer. |
| D | `apps/web/src/content/projects/palette-studio.md` | personal config/content/asset | The deletion represents the personal project set; retain generic fixture content in core. |
| M | `apps/web/src/pages/index.astro` | personal config/content/asset | Move the personal hero role into consumer config; do not copy the hard-coded value. |
| M | `apps/web/src/site.config.ts` | personal config/content/asset | Map values into the isolated consumer's typed config; never use them as package defaults. |

## Divergent behavior outside the three-dot delta

`main` advanced after the branches diverged. The following two-dot differences are explicitly classified before implementation.

| Area | Classification | Decision for Nocturne 2.0 |
| --- | --- | --- |
| `GlobalSearch` | reusable 2.0 behavior | Preserve `main`'s tag-aware search and project/article grouping. The older personal implementation is obsolete behavior. |
| `Header` | reusable 2.0 behavior | Preserve `main`'s config-driven portfolio navigation and combined article/project search. Make profile and search visibility typed config options. |
| `ProjectCard` | reusable 2.0 behavior | Preserve `main`'s generic `tags` field. The personal branch's older `tech` field is obsolete behavior. |
| Portfolio index route | reusable 2.0 behavior | Preserve feature modes, tag browsing, and generic labels from `main`; move labels into normalized config. |
| Portfolio detail route | reusable 2.0 behavior | Preserve `main`'s `tags` contract and conditional static routes. The personal `tech` contract is obsolete behavior. |
| Portfolio tag route | reusable 2.0 behavior | Preserve `main`'s `tags` contract and `Tag:` terminology. The personal `tech` contract is obsolete behavior. |
| Portfolio tags route | reusable 2.0 behavior | Preserve the generic tags index from `main`; its absence on the personal branch is obsolete behavior. |
| `content.config.ts` | reusable 2.0 behavior | Preserve `main`'s article/project/profile schemas, extracting schema factories while consumers retain `glob()` ownership. The personal `tech` schema is obsolete behavior. |
| `gen-svg-paths.ts` | reusable 2.0 behavior | Preserve project-tag and profile heading generation, but remove fixed paths, hard-coded profile fallback, and pnpm-store version coupling. |
| `docs/configuration.md` | reusable 2.0 behavior | Preserve generic documentation and rewrite it for the public package contract. Do not copy personal values. |
| Removed `apps/web/public/nocturne-logo-04.svg` | obsolete experiment | Do not carry it into the package unless a runtime reference is found during migration. |
