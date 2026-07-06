.PHONY: help svgs build start dev

.DEFAULT_GOAL := help

help:
	@echo.
	@echo Usage: make [target]
	@echo.
	@echo Target     Command                                        Description
	@echo -------------------------------------------------------------------------
	@echo svgs       pnpm --filter web run gen:paths               Generate SVG path data for headings
	@echo build      svgs + astro build + pagefind                 Full production build
	@echo start      build + astro preview                         Build then serve locally
	@echo dev        pnpm --filter web run dev                     Start Astro dev server (no build)
	@echo.

svgs:
	pnpm --filter web run gen:paths

build: svgs
	pnpm --filter web run build

start: build
	pnpm --filter web run preview

dev:
	pnpm --filter web run dev
