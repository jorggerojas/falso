# Falso

Falso is a local-first CLI for generating fake content for developers, testers,
designers, and product builders.

It produces fake data, random text, structured mock objects, and reusable
payloads for forms, QA workflows, UI mockups, demos, dashboards, and CMS
entries, all from the terminal, with no network calls.

## Installation

```bash
# From the repo (development)
pnpm install
pnpm dev -- --help

# After publishing
pnpm add -g falso
falso --help
```

## Usage

Run the CLI locally during development:

```bash
pnpm dev -- generate <type>
```

Build and run the compiled entry point:

```bash
pnpm build
node dist/index.js --help
```

### Commands

#### `generate <type>`

Use `generate` to print fake values directly to stdout. String-based
generators print one value per line, and `persona` prints formatted JSON.

```bash
falso generate name
falso generate email
falso generate full-name
falso generate username
falso generate persona
falso generate paragraph
falso generate password
falso generate url --domain example.dev --slug "Team Launch"
```

| Type | Output |
| ---- | ------ |
| `name` | First or given name |
| `email` | Email address |
| `address` | Address |
| `city` | City |
| `state` | State |
| `zip` | Zip code |
| `country` | Country |
| `phone` | Phone number |
| `website` | Website |
| `company` | Company |
| `job-title` | Job title |
| `url` | URL |
| `ip` | IP address |
| `ipv6` | IPv6 address |
| `mac` | MAC address |
| `uuid` | UUID |
| `binary` | Binary data |
| `hex` | Hexadecimal data |
| `octal` | Octal data |
| `decimal` | Decimal data |
| `full-name` | First and last name |
| `username` | Username / handle |
| `persona` | Structured person profile (name, email, username, etc.) |
| `paragraph` | Lorem-style paragraph (length from config) |
| `password` | Random password |

Current generator options:

- `--count` controls batch size for every generator.
- `--locale` falls back to English when an unsupported locale is provided.
- `--domain` customizes `email` and `url` output.
- `--path` and `--slug` customize `url` output.

#### `config`

Use `config` to manage local CLI defaults stored on disk.

```bash
falso config paragraph-size 3        # paragraphs length (sentences or size tier)
falso config field add email         # enable a field in fill defaults
falso config field remove username   # disable a field in fill defaults
falso config add company="Acme"       # add one custom company value
falso config add url="acme.com"      # add one custom URL value
falso config list                    # show current settings
```

The config file stores paragraph size, enabled fields used by `fill`, and
custom catalog values. By default, `fill` includes every `generate` type. Use
`config field remove` to disable fields and `config field add` to enable them
again. Use `config add <catalog>="value"` to add one custom catalog value at a
time. Duplicate values are ignored and print `already exists`. Custom company
values are used by `generate company`, `generate persona`, and `fill`. Custom
URL values are used by `generate url` and `fill`; values such as `acme.com` are
normalized to valid URLs such as `https://acme.com/`. Falso reads and writes
`~/.config/falso/config.json` unless `FALSO_CONFIG_PATH` points elsewhere.

#### `fill`

Use `fill` to generate a local payload from the enabled config fields. It prints
JSON for CLI pipelines and future automation instead of writing to the OS.

```bash
falso fill              # print a key-value fill payload using current config
falso fill --dry-run    # preview the fill plan with mode and field values
```

By default, `fill` includes every `generate` type as a key-value object.
Use `config field remove` / `config field add` to customize the enabled fields.

## Scripts

- `pnpm dev` — run the CLI with `tsx` (pass flags after `--`).
- `pnpm build` — bundle the CLI with `tsup`.
- `pnpm lint` — run Biome checks and apply safe fixes.
- `pnpm lint:ci` — run Biome in CI mode (no writes).
- `pnpm format` — format source files with Biome.
- `pnpm test` — run Vitest.
- `pnpm test:watch` — run Vitest in watch mode.
- `pnpm release` — cut a patch release with `standard-version`.
- `pnpm release:minor` / `release:patch` / `release:major` — explicit semver bumps.

## Project structure

- `src/index.ts` — CLI entry point (Commander program).
- `src/commands/` — command definitions and handlers.
- `src/lib/cli/` — config persistence and fill-plan helpers.
- `src/lib/generators/` — person, web, content, and shared generator logic.
- `src/lib/contracts/` — shared types and Zod schemas.
- `src/data/` — typed catalog and dataset definitions.

## Conventions

- Keep the project CLI-first and local-first.
- Use TypeScript with strict mode; do not introduce `any`.
- Use pnpm for package management.
- Do not add backend, auth, analytics, or AI APIs.
- Keep generated data clearly fake and safe for demos.
- Avoid unnecessary dependencies and broad refactors.
