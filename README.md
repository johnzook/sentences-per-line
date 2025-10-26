<h1 align="center">@johnzook/sentences-per-line</h1>

<p align="center">Contributed markdownlint rule for limiting sentences per line. 📐</p>

<p align="center">
	<a href="https://github.com/johnzook/sentences-per-line/blob/main/LICENSE.md" target="_blank">
		<img alt="License: MIT" src="https://img.shields.io/github/license/johnzook/sentences-per-line?color=21bb42">
	</a>
	<img alt="Style: Prettier" src="https://img.shields.io/badge/style-prettier-21bb42.svg" />
	<img alt="TypeScript: Strict" src="https://img.shields.io/badge/typescript-strict-21bb42.svg" />
	<img alt="npm package version" src="https://img.shields.io/npm/v/@johnzook/sentences-per-line?color=21bb42" />
</p>

> **Note:** This is an updated fork of [sentences-per-line](https://github.com/JoshuaKGoldberg/sentences-per-line) originally created by [Josh Goldberg](https://github.com/JoshuaKGoldberg).
> This fork includes bug fixes and additional features to handle a larger variety of sentence breaks.

```diff
- First sentence. Second sentence.
+ First sentence.
+ Second sentence.
```

In other words, sentences-per-line makes sure no line contains more than one sentence.
This is useful because:

- Shorter lines result in simpler, easier-to-understand Git diffs
- Longer lines are harder to read in source code

## Usage

First install this package as a devDependency:

```shell
npm i -D @johnzook/sentences-per-line
```

Then provide it to [markdownlint-cli's `--rules`](https://github.com/igorshubovych/markdownlint-cli):

```shell
markdownlint --rules @johnzook/sentences-per-line
```

## Development

See [`.github/CONTRIBUTING.md`](./.github/CONTRIBUTING.md), then [`.github/DEVELOPMENT.md`](./.github/DEVELOPMENT.md).
Thanks! 💖

## Credits

This package is a maintained fork of the original [sentences-per-line](https://github.com/JoshuaKGoldberg/sentences-per-line) project.

### Original Contributors

<!-- spellchecker: disable -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="http://www.joshuakgoldberg.com"><img src="https://avatars.githubusercontent.com/u/3335181?v=4?s=100" width="100px;" alt="Josh Goldberg"/><br /><sub><b>Josh Goldberg</b></sub></a><br /><a href="#tool-JoshuaKGoldberg" title="Tools">🔧</a> <a href="https://github.com/JoshuaKGoldberg/sentences-per-line/commits?author=JoshuaKGoldberg" title="Code">💻</a> <a href="#ideas-JoshuaKGoldberg" title="Ideas, Planning, & Feedback">🤔</a> <a href="#maintenance-JoshuaKGoldberg" title="Maintenance">🚧</a> <a href="#infra-JoshuaKGoldberg" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/andrewrynhard"><img src="https://avatars.githubusercontent.com/u/3383143?v=4?s=100" width="100px;" alt="Andrew Rynhard"/><br /><sub><b>Andrew Rynhard</b></sub></a><br /><a href="#ideas-andrewrynhard" title="Ideas, Planning, & Feedback">🤔</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->
<!-- spellchecker: enable -->

> 💙 The original package was templated with [create-typescript-app](https://github.com/JoshuaKGoldberg/create-typescript-app).
