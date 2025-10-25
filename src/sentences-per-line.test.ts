import * as markdownlint from "markdownlint/sync";
import { describe, expect, test } from "vitest";

import { sentencesPerLine } from "./sentences-per-line.js";

describe("sentences-per-line", () => {
	test.each([
		["", undefined],
		["abc", undefined],
		["abc.", undefined],
		[
			"Abc. Def.",
			"Abc. Def.",
			{
				fixInfo: {
					deleteCount: 1,
					editColumn: 5,
					insertText: "\n",
					lineNumber: 1,
				},
				lineNumber: 1,
			},
		],
		[
			"Abc def. Ghi jkl.",
			"Abc def. Ghi j",
			{
				fixInfo: {
					deleteCount: 1,
					editColumn: 9,
					insertText: "\n",
					lineNumber: 1,
				},
				lineNumber: 1,
			},
		],
		[
			"Abc def! Ghi jkl.",
			"Abc def! Ghi j",
			{
				fixInfo: {
					deleteCount: 1,
					editColumn: 9,
					insertText: "\n",
					lineNumber: 1,
				},
				lineNumber: 1,
			},
		],
		[
			"Abc def? Ghi jkl!",
			"Abc def? Ghi j",
			{
				fixInfo: {
					deleteCount: 1,
					editColumn: 9,
					insertText: "\n",
					lineNumber: 1,
				},
				lineNumber: 1,
			},
		],
		["A single sentence A.B.C.", undefined],
		["Continuation... of this topic.", undefined],
		["This sentences has capitalized examples, e.g. Company A.", undefined],
		["This sentences has capitalized examples, ie. Company A.", undefined],
		["This sentences has capitalized examples (eg. Company A).", undefined],
		["This sentences has capitalized examples (ex. Company A).", undefined],
		// Test that words ending in ignored word patterns are still caught
		[
			"This is complex. Another sentence.",
			"comple",
			{
				fixInfo: {
					deleteCount: 1,
					editColumn: 17,
					insertText: "\n",
					lineNumber: 1,
				},
				lineNumber: 1,
			},
		],
		[
			"This is a movie. Another sentence.",
			"a movi",
			{
				fixInfo: {
					deleteCount: 1,
					editColumn: 17,
					insertText: "\n",
					lineNumber: 1,
				},
				lineNumber: 1,
			},
		],
		// Test edge case: "ex" at start of line (word boundary)
		["ex. This should not trigger.", undefined],
		["Ex. This should not trigger.", undefined],
		["# Level 1 Header.", undefined],
		["# Level 1 Header. With Sentences.", undefined],
		["#### Level 4 Header.", undefined],
		["#### Level 4 Header. With Sentences.", undefined],
		["  #### Level 4 Indented Header.", undefined],
		["  #### Level 4 Indented Header. With Sentences.", undefined],
		["1. List.", undefined],
		[
			"1. List. With Sentences.",
			"1. List. With ",
			{
				fixInfo: {
					deleteCount: 1,
					editColumn: 9,
					insertText: "\n",
					lineNumber: 1,
				},
				lineNumber: 1,
			},
		],
		["  11. List.", undefined],
		[
			"  11. List. With Sentences.",
			"1. List. Wi",
			{
				fixInfo: {
					deleteCount: 1,
					editColumn: 12,
					insertText: "\n",
					lineNumber: 1,
				},
				lineNumber: 1,
			},
		],
		["| Table. | Sentence Two. |", undefined],
		["| Table. With Sentences. | Sentence Two. |", undefined],
		["| Table! With Sentences? | Sentence Two. |", undefined],
		["  | Indented Table. With Sentences. | Sentence Two. |", undefined],
		["  | Indented Table! With Sentences? | Sentence Two! |", undefined],
		["`Abc. Def.`", undefined],
		["`Abc.` Def.", undefined],
		["`Abc?` Def.", undefined],
		["`Abc.` `Def.`", undefined],
		["``Abc.`` Def.", undefined],
		[
			"`Abc.` Def. Ghi",
			"c.` Def. Gh",
			{
				fixInfo: {
					deleteCount: 1,
					editColumn: 12,
					insertText: "\n",
					lineNumber: 1,
				},
				lineNumber: 1,
			},
		],
		["```js```.", undefined],
		// Test for malformed inline code: backticks extending to end of line
		["Abc. ```", undefined],
		["Def. ````", undefined],
		// Test for malformed inline code: unclosed backtick
		["Abc. `Def", undefined],
		["Ghi. ``Jkl", undefined],
		[
			`
\`\`\`plaintext
Abc. Def.
\`\`\`
`,
			undefined,
		],
		[
			`
\`\`\`plaintext
Abc. Def.
\`\`\`

Abc.
Def.
`,
			undefined,
		],
		[
			`
\`\`\`plaintext
Abc. Def.
\`\`\`

Abc. Def.
`,
			"Abc. Def.",
			{
				fixInfo: {
					deleteCount: 1,
					editColumn: 5,
					insertText: "\n",
					lineNumber: 6,
				},
				lineNumber: 6,
			},
		],
	] as const)("%s", (input, errorContext, report?) => {
		const actual = markdownlint.lint({
			config: {
				default: false,
				"sentences-per-line": true,
			},
			customRules: [sentencesPerLine],
			strings: { input },
		});

		expect(actual).toEqual({
			input: errorContext
				? [
						{
							errorContext,
							errorDetail: null,
							errorRange: null,
							ruleDescription: "Each sentence should be on its own line",
							ruleInformation: null,
							ruleNames: ["sentences-per-line"],
							...report,
						},
					]
				: [],
		});
	});
});
