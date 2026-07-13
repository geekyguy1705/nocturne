# Nocturne 2.0 Path Ownership

## Core branches

Package/core work may change only:

- `packages/nocturne/**`
- `apps/demo/**`
- `nocturne.workspace.json`
- `scripts/dev.mjs`
- Root workspace and build configuration required by Nocturne 2.0
- Generic documentation
- Nocturne 2.0 CI and release validation

Core branches must not contain personal content, configuration, assets, identifiers, or production deployment settings.

## Personal site branch

`nocturne-2.0/site-abhishek` may change only:

- `apps/portfolio-abhishek/**`
- Explicit Nocturne 2.0 staging deployment configuration

The personal branch consumes the public package API. It must not duplicate or modify package implementation source. It is created from completed `nocturne-2.0/core`; the old `portfolio-abhishek` branch is a read-only data source and is never merged.

## Protected sources

`main`, `origin/main`, `portfolio-abhishek`, and `origin/portfolio-abhishek` must not be committed to, merged, rebased, reset, cherry-picked, force-pushed, deleted, or used to alter an existing production deployment.
