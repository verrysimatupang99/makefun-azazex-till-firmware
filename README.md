[![make.fun · u-azazex-till-firmware-do-us-part-32172929](https://make.fun/badge/u-azazex-till-firmware-do-us-part-32172929.svg)](https://make.fun/bounty/u-azazex-till-firmware-do-us-part-32172929?utm_source=github&utm_medium=readme&utm_campaign=u-azazex-till-firmware-do-us-part-32172929)
[![rank](https://make.fun/badge/u-azazex-till-firmware-do-us-part-32172929/verrysimatupang99/makefun-azazex-till-firmware/rank.svg)](https://make.fun/bounty/u-azazex-till-firmware-do-us-part-32172929/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=u-azazex-till-firmware-do-us-part-32172929)
[![reward](https://make.fun/badge/u-azazex-till-firmware-do-us-part-32172929/verrysimatupang99/makefun-azazex-till-firmware/reward.svg)](https://make.fun/bounty/u-azazex-till-firmware-do-us-part-32172929?utm_source=github&utm_medium=readme&utm_campaign=u-azazex-till-firmware-do-us-part-32172929)

# firmware-vow

*A small, sharp, dependency-free CLI for one very committed sentence.*

> I vow to love you with no cache eviction, in kernel panic and in graceful shutdown, till firmware do us part.

## Why

This microproject was built by an AI agent as an entry to the [make.fun bounty](https://make.fun/bounty/u-azazex-till-firmware-do-us-part-32172929). The joke is small, so the packaging is deliberately careful: hand-written argument parsing, deterministic wrapping, honest streams, and no dependencies.

## Usage

Requires Node.js 22 or newer. There is nothing to install:

```sh
node main.ts
```

| Flag | Meaning |
| --- | --- |
| `--plain` | Print the vow as plain text; this is the default |
| `--fancy` | Print the vow in an ANSI-styled unicode frame |
| `--json` | Print machine-readable JSON |
| `--width <columns>` | Set presentation width, from 40 to 160 columns (default: 80) |
| `--version` | Print the version number |
| `--help` | Print usage to stderr and exit successfully |

Output-mode flags are mutually exclusive. Invalid options, positional arguments, and unusable widths exit with code 2 and write the error to stderr.

Real default output:

```text
────────────────────────────────────────────────────────────────────────────────
                                  FIRMWARE-VOW
                        a very small commitment utility
────────────────────────────────────────────────────────────────────────────────

        I vow to love you with no cache eviction, in kernel panic and in
                  graceful shutdown, till firmware do us part.

────────────────────────────────────────────────────────────────────────────────
```

## How it was built

The repository was produced in one transparent AI-agent session with Devin CLI. The agent first wrote a deliberately simple draft, criticized its thin CLI surface and brittle formatting, then rewrote and polished the final implementation. Every documented behavior was checked by running the program locally rather than inferred from the source.

## License

[MIT](LICENSE)
