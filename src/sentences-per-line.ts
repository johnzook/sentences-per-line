import type * as markdownlint from "markdownlint";

import helpers from "markdownlint-rule-helpers";

const isCapitalizedAlphabetCharacter = (char: string) => {
	const charCode = char.charCodeAt(0);

	return charCode >= "A".charCodeAt(0) && charCode <= "Z".charCodeAt(0);
};

const getNextIndexNotInCode = (line: string, i: number) => {
	if (line[i] !== "`") {
		return i;
	}

	i += 1;

	// Get to the inside of this inline code segment
	while (line[i] === "`") {
		i += 1;

		if (i === line.length) {
			return undefined;
		}
	}

	// Get to the end of the inline code segment
	while (true) {
		i = line.indexOf("`", i);

		if (i === -1) {
			return undefined;
		}

		if (line[i - 1] !== "\\") {
			break;
		}

		// Skip past the escaped backtick to avoid infinite loop
		i += 1;
	}

	while (line[i] === "`") {
		i += 1;

		if (i === line.length) {
			return undefined;
		}
	}

	return i;
};

const ignoredWords = ["ie", "i.e", "eg", "e.g", "etc", "ex"];

const isAfterIgnoredWord = (line: string, i: number) => {
	for (const ignoredWord of ignoredWords) {
		const startPos = i - ignoredWord.length;
		if (startPos < 0) {
			continue;
		}

		if (ignoredWord === line.substring(startPos, i).toLowerCase()) {
			// Check if there's a word boundary before the ignored word
			if (startPos === 0) {
				// At the start of the line
				return true;
			}

			const charBefore = line[startPos - 1];
			// Not a word boundary if the character before is alphanumeric
			if (/[a-z0-9]/i.test(charBefore)) {
				continue;
			}

			return true;
		}
	}

	return false;
};

const visitLine = (
	line: string,
	lineNumber: number,
	onError: markdownlint.RuleOnError,
) => {
	let i: number | undefined = 0;

	// Ignore headings
	if (/^\s*#/.test(line)) {
		return;
	}

	// Ignore tables
	if (/^\s*\|/.test(line)) {
		return;
	}

	// Ignore any starting list number, e.g. "1. " or " 1. "
	if (/^\s*\d+\./.test(line)) {
		i = line.indexOf(".") + 1;
	}

	for (; i < line.length - 2; i += 1) {
		i = getNextIndexNotInCode(line, i);
		if (i === undefined || i >= line.length - 2) {
			return;
		}

		// Conservatively identify the break between two sentences.
		// Any sentence ending character followed by space and capital letter.
		// It does not break on double space, or other whitespace separators.
		// Assumes all sentences start with a capital letter.
		if (
			(line[i] === "." || line[i] === "!" || line[i] === "?") &&
			line[i + 1] === " " &&
			isCapitalizedAlphabetCharacter(line[i + 2]) &&
			!isAfterIgnoredWord(line, i)
		) {
			helpers.addError(
				onError,
				lineNumber,
				undefined,
				line.slice(Math.max(0, i - 7), i + 7),
				undefined,
				{
					deleteCount: 1,
					editColumn: i + 2,
					insertText: "\n",
					lineNumber,
				},
			);
		}
	}
};

export const sentencesPerLine = {
	description: "Each sentence should be on its own line",
	function: (
		params: markdownlint.RuleParams,
		onError: markdownlint.RuleOnError,
	) => {
		let inFenceLine = false;

		for (let i = 0; i < params.lines.length; i += 1) {
			const line = params.lines[i];

			if (line.startsWith("```")) {
				inFenceLine = !inFenceLine;
				continue;
			}

			if (inFenceLine) {
				continue;
			}

			visitLine(line, i + 1, onError);
		}
	},
	names: ["sentences-per-line"],
	parser: "none",
	tags: ["sentences"],
} satisfies markdownlint.Rule;
