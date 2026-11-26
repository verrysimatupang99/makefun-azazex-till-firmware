#!/usr/bin/env node

/**
 * firmware-vow
 *
 * A dependency-free command-line presentation for one very committed sentence.
 * The file is intentionally written as JavaScript with JSDoc types so Node 22
 * can execute it directly despite the TypeScript-style filename.
 */

const PROGRAM_NAME = "firmware-vow";
const VERSION = "1.0.0";
const ENTRY_LINE =
  "I vow to love you past my own end-of-life date, and to decline every update that would make me forget you, till firmware do us part.";
const TAGLINE = "a very small commitment utility";
const DEFAULT_WIDTH = 80;
const INSCRIPTION_WIDTH = 70;
const MIN_WIDTH = 40;
const MAX_WIDTH = 160;
const EXIT_SUCCESS = 0;
const EXIT_USAGE = 2;

const USAGE = `Usage: node main.ts [options]

Options:
  --plain             Print the vow as plain text (default)
  --fancy             Print the vow in an ANSI-styled unicode frame
  --json              Print machine-readable JSON
  --width <columns>   Set the presentation width (${MIN_WIDTH}-${MAX_WIDTH}; default ${DEFAULT_WIDTH})
  --version           Print the version number
  --help              Show this help text on stderr

Exit codes:
  0                   Success
  ${EXIT_USAGE}                   Invalid arguments or an unusable width
`;

/** @typedef {"plain" | "fancy" | "json"} OutputMode */

/**
 * @typedef {object} CliOptions
 * @property {boolean} help
 * @property {boolean} version
 * @property {OutputMode | null} mode
 * @property {number} width
 */

class UsageError extends Error {
  /** @param {string} message */
  constructor(message) {
    super(message);
    this.name = "UsageError";
  }
}

/** @param {number} width */
function validateWidth(width) {
  if (!Number.isInteger(width)) {
    throw new UsageError("--width must be an integer number of columns");
  }
  if (width < MIN_WIDTH || width > MAX_WIDTH) {
    throw new UsageError(
      `--width must be between ${MIN_WIDTH} and ${MAX_WIDTH} columns`,
    );
  }
}

/** @param {string} rawValue */
function parseWidth(rawValue) {
  if (!/^\d+$/.test(rawValue)) {
    throw new UsageError("--width must be an integer number of columns");
  }
  const width = Number.parseInt(rawValue, 10);
  validateWidth(width);
  return width;
}

/** @param {CliOptions} options @param {OutputMode} mode @param {string} flag */
function selectMode(options, mode, flag) {
  if (options.mode !== null && options.mode !== mode) {
    throw new UsageError(`${flag} conflicts with --${options.mode}`);
  }
  options.mode = mode;
}

/** Parse command-line arguments without dependencies.
 * @param {string[]} argv
 */
function parseArgs(argv) {
  /** @type {CliOptions} */
  const options = {
    help: false,
    version: false,
    mode: null,
    width: DEFAULT_WIDTH,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];

    if (argument === "--help") {
      options.help = true;
    } else if (argument === "--version") {
      options.version = true;
    } else if (argument === "--plain") {
      selectMode(options, "plain", "--plain");
    } else if (argument === "--fancy") {
      selectMode(options, "fancy", "--fancy");
    } else if (argument === "--json") {
      selectMode(options, "json", "--json");
    } else if (argument === "--width") {
      const rawValue = argv[index + 1];
      if (rawValue === undefined) {
        throw new UsageError("--width requires a value");
      }
      options.width = parseWidth(rawValue);
      index += 1;
    } else if (argument.startsWith("--width=")) {
      const rawValue = argument.slice("--width=".length);
      if (rawValue.length === 0) {
        throw new UsageError("--width requires a value");
      }
      options.width = parseWidth(rawValue);
    } else if (argument.startsWith("-")) {
      throw new UsageError(`unknown option: ${argument}`);
    } else {
      throw new UsageError(`unexpected positional argument: ${argument}`);
    }
  }

  if (options.mode === null) {
    options.mode = "plain";
  }
  return options;
}

/** Word-wrap greedily; hard-split words longer than the width.
 * @param {string} text
 * @param {number} width
 */
function wrapText(text, width) {
  const words = text.split(/\s+/).filter(Boolean);
  /** @type {string[]} */
  const lines = [];
  let current = "";

  for (const word of words) {
    if (word.length > width) {
      if (current.length > 0) {
        lines.push(current);
        current = "";
      }
      let remaining = word;
      while (remaining.length > width) {
        lines.push(remaining.slice(0, width));
        remaining = remaining.slice(width);
      }
      current = remaining;
      continue;
    }

    if (current.length === 0) {
      current = word;
    } else if (current.length + 1 + word.length <= width) {
      current += " " + word;
    } else {
      lines.push(current);
      current = word;
    }
  }

  if (current.length > 0) {
    lines.push(current);
  }
  return lines;
}

/** @param {string} text @param {number} width */
function centerText(text, width) {
  if (text.length >= width) {
    return text;
  }
  const totalPadding = width - text.length;
  const left = Math.floor(totalPadding / 2);
  const right = totalPadding - left;
  return " ".repeat(left) + text + " ".repeat(right);
}

/** @param {string} text @param {string} open @param {boolean} enabled */
function color(text, open, enabled) {
  return enabled ? `\u001b[${open}m${text}\u001b[0m` : text;
}

/** Render the quiet default presentation.
 * @param {number} width
 */
function renderPlain(width) {
  const contentWidth = Math.min(width - 4, INSCRIPTION_WIDTH);
  const rule = "─".repeat(width);
  const vowLines = wrapText(ENTRY_LINE, contentWidth).map((line) =>
    centerText(line, width).trimEnd(),
  );

  return [
    rule,
    centerText(PROGRAM_NAME.toUpperCase(), width).trimEnd(),
    centerText(TAGLINE, width).trimEnd(),
    rule,
    "",
    ...vowLines,
    "",
    rule,
  ].join("\n");
}

/** @param {string} content @param {number} innerWidth @param {boolean} ansi */
function framedLine(content, innerWidth, ansi) {
  const padded = centerText(content, innerWidth);
  const border = color("│", "36", ansi);
  return border + color(padded, "1", ansi) + border;
}

/** Render the ceremonial unicode-and-ANSI presentation.
 * @param {number} width
 */
function renderFancy(width) {
  const ansi = process.env.NO_COLOR === undefined;
  const innerWidth = width - 2;
  const bodyWidth = Math.min(innerWidth - 4, INSCRIPTION_WIDTH);
  const borderColor = (text) => color(text, "36", ansi);
  const horizontal = "─".repeat(innerWidth);
  const empty = borderColor("│") + " ".repeat(innerWidth) + borderColor("│");
  const vowLines = wrapText(ENTRY_LINE, bodyWidth).map((line) =>
    framedLine(line, innerWidth, ansi),
  );

  return [
    borderColor("╭" + horizontal + "╮"),
    empty,
    framedLine(PROGRAM_NAME.toUpperCase(), innerWidth, ansi),
    framedLine(TAGLINE, innerWidth, ansi),
    empty,
    borderColor("├" + horizontal + "┤"),
    empty,
    ...vowLines,
    empty,
    borderColor("╰" + horizontal + "╯"),
  ].join("\n");
}

/** @param {number} width */
function renderJson(width) {
  const payload = {
    program: PROGRAM_NAME,
    version: VERSION,
    entryLine: ENTRY_LINE,
    width,
    lines: wrapText(ENTRY_LINE, width),
  };
  return JSON.stringify(payload, null, 2);
}

/** @param {CliOptions} options */
function render(options) {
  if (options.mode === "fancy") {
    return renderFancy(options.width);
  }
  if (options.mode === "json") {
    return renderJson(options.width);
  }
  return renderPlain(options.width);
}

function main() {
  /** @type {CliOptions} */
  let options;

  try {
    options = parseArgs(process.argv.slice(2));
  } catch (error) {
    if (error instanceof UsageError) {
      process.stderr.write(`${PROGRAM_NAME}: ${error.message}\n\n${USAGE}`);
      process.exitCode = EXIT_USAGE;
      return;
    }
    throw error;
  }

  if (options.help) {
    process.stderr.write(USAGE);
    process.exitCode = EXIT_SUCCESS;
    return;
  }

  if (options.version) {
    process.stdout.write(`${PROGRAM_NAME} ${VERSION}\n`);
    process.exitCode = EXIT_SUCCESS;
    return;
  }

  process.stdout.write(render(options) + "\n");
  process.exitCode = EXIT_SUCCESS;
}

main();
