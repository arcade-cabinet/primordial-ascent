---
title: Primordial Ascent
updated: 2026-04-23
status: current
---

# Primordial Ascent

> Thumb a grapple up a primal face, feel each catch, reach a
> variable final climb that tests what you learned.

A portrait touch-grapple climber. You fire a hook at a cyan
anchor, swing, rest on moss, and out-climb the rising magma. The
run is built to feel each catch — not score chase — and every
third run scrambles the final face to see what you actually learned.

Built with React 19 + Vite 8 + @react-three/fiber + drei + rapier
(physics) + Koota ECS + Web Worker terrain streaming. Capacitor
wraps it as a portrait-locked debug APK for Android; web build
deploys to GitHub Pages at `/primordial-ascent/`.

## Quick start

```bash
pnpm install
pnpm dev          # Vite dev — http://localhost:5185
pnpm test         # node + dom
pnpm test:browser # real Chromium
pnpm build        # dist/
```

## Documentation

| File | Domain |
| ---- | ------ |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | technical |
| [docs/DESIGN.md](docs/DESIGN.md) | product |
| [docs/TESTING.md](docs/TESTING.md) | quality |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | ops |
| [docs/STATE.md](docs/STATE.md) | context |
| [docs/RELEASE.md](docs/RELEASE.md) | ops |
| [AGENTS.md](AGENTS.md) | agent entry |
| [CLAUDE.md](CLAUDE.md) | Claude entry |
| [STANDARDS.md](STANDARDS.md) | quality |
| [CHANGELOG.md](CHANGELOG.md) | release-please |

## License

MIT. See [LICENSE](LICENSE).
