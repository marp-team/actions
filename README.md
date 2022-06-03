# marp-team/actions

Common [GitHub Actions] and scripts for [Marp team](https://github.com/marp-team) projects.

```yaml
jobs:
  something:
    steps:
      - uses: marp-team/actions@v1
        with:
          task: release
          token: ${{ secrets.GITHUB_TOKEN }}
```

Please note that provided actions are only for Marp team projects.

[github actions]: https://github.com/features/actions

## [GitHub Actions]

Pass the name of task to `task` parameter in `with` key of the step.

### `release`: Update GitHub Release

Update GitHub Release for the tagged version based on parsed contents from `CHANGELOG.md`.

```yaml
on:
  push:
    tags:
      - v*

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1
      - uses: marp-team/actions@v1
        with:
          task: release
          token: ${{ secrets.GITHUB_TOKEN }}
```

#### Inputs

- `task` (required): Must be `release`.
- `token` (required): GitHub token.

<!--
- `convertGitHubMention` (optional: `true` by default): Set whether to convert Markdown links to GitHub profile like `[@marp-team](https://github.com/marp-team/)` into a plain GitHub mention.

<details>
<summary>Details about <code>convertGitHubMention</code></summary>

For giving honor, `CHANGELOG.md` may mention to outside contributors who made a good improvement (e.g. Bug fix, critical update of docs, and so on. Minor fix such as typo may not mention to the contributor).

We are using a traditional Markdown link into GitHub profile page to keep accessible when reading `CHANGELOG.md` directly, but using `@mention` syntax for GitHub releases is better because of [the avatar list for to highlight and celebrate our collaborators.](https://github.blog/changelog/2021-09-14-releases-now-have-an-avatar-list/)

</details>
-->

### `upload`: Upload assets to existing GitHub Release

Upload files to existing GitHub release for specified version.

```yaml
on:
  push:
    tags:
      - v*

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1
      - uses: marp-team/actions@v1
        with:
          task: upload
          token: ${{ secrets.GITHUB_TOKEN }}
          files: dist,pkg/xxxxxxxx.zip
```

#### Inputs

- `task` (required): Must be `upload`.
- `token` (required): GitHub token.
- `files` (required): Comma-separated string for upload files or directories.

## `npm version` helper script

This repository also provides a helper script of `npm version` for including update of `CHANGELOG.md` to bumped commit.

```javascript
// package.json
{
  "scripts": {
    "version": "curl https://raw.githubusercontent.com/marp-team/actions/v1/lib/scripts/version.js | node && git add -A CHANGELOG.md"
  }
}
```

## Development

We are following [the contributing guideline of marp-team projects](https://github.com/marp-team/.github/blob/master/CONTRIBUTING.md). Please read these guidelines this before starting work in this repository.

### Release

```bash
$ npm version [major|minor|patch]
$ git push && git push --tag
```

`vX.X.X-release` tag for production use will [create automatically](.github/workflows/release.yml) when pushed a semantic versioning tag such as `vX.X.X`. It includes compiled JS scripts and dependent modules for production.

In addition, the primary version tag such as `v1` will move to the created commit by updated release tag when the pushed tag has no identifiers for prerelease.

## Author

Managed by [@marp-team](https://github.com/marp-team).

## License

[MIT License](LICENSE)
